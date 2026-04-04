# Gamebook Next Phase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在当前 MVP 基础上继续把 Gamebook 从 mock 同步产品推进到可持续开发的真实产品。

**Architecture:** 当前项目已经有完整的 Next.js App Router、Prisma、PostgreSQL、platform adapter、书柜页、详情页和笔记流。下一阶段应保持现有分层不变，优先替换 mock 平台接入、补认证与用户隔离、再增强同步与书柜体验，避免推翻现有模型。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma Client, PostgreSQL

---

## Current State

- 已有书柜首页：海报墙展示、平台筛选、排序
- 已有详情页：平台来源、同步时间、私密笔记增删改
- 已有 API：
  - `GET /api/connected-accounts`
  - `POST /api/connected-accounts/:platform/connect`
  - `POST /api/connected-accounts/:platform/sync`
  - `GET /api/library`
  - `GET /api/library/:userGameId`
  - `POST /api/library/:userGameId/notes`
  - `PATCH /api/notes/:noteId`
  - `DELETE /api/notes/:noteId`
- 已有 adapter 抽象，但 `Steam / PlayStation` 仍是 mock 数据
- 当前用户是 demo user，尚未接真实认证
- 数据库初始化已切到 `Prisma migrations` + `npm run db:init`

## Task 1: 稳定基础设施与开发基线

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/package.json`
- Modify: `/Users/cl/Projects/Gamebook/README.md`
- Modify: `/Users/cl/Projects/Gamebook/prisma/schema.prisma`
- Create: `/Users/cl/Projects/Gamebook/prisma/migrations/`
- Create: `/Users/cl/Projects/Gamebook/src/lib/env.ts`

**Steps:**
1. 把数据库初始化从手写 `init.sql` 逐步收敛到 Prisma migration 流程。
2. 增加统一 env 校验，显式声明平台接入、数据库、鉴权相关变量。
3. 补最小 smoke test，至少覆盖首页加载、书柜接口、笔记接口。
4. 更新 README，区分“当前 mock 版”和“真实平台版”的启动方式。

**Verification:**
- Run: `npm run test`
- Run: `npm run lint`
- Run: `npm run build`

## Task 2: 接入真实用户认证

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/demo-user.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/auth.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/lib/library-service.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/app/page.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/app/library/[userGameId]/page.tsx`

**Steps:**
1. 用真实 session 替换 demo user，确保每个请求都基于当前登录用户。
2. 所有库查询、账号绑定、同步、笔记操作继续走 user scoped 查询。
3. 未登录时首页显示登录引导，不返回其他用户数据。
4. 增加最小认证测试：未登录拒绝写接口，登录后只看见自己的库。

**Verification:**
- 未登录访问写接口返回 401 或重定向
- 登录后可绑定账号、同步、写笔记
- 两个用户间数据互不串库

## Task 3: 替换 Steam mock adapter

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/platforms/adapters.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/lib/platforms/types.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/platforms/steam.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/platforms/steam.test.ts`

**Steps:**
1. 保留 adapter 接口不变，实现真实 `SteamAdapter`。
2. 明确 `connect()` 输入和校验规则，至少支持当前准备采用的 Steam 标识形式。
3. `sync()` 拉真实游戏库数据，并转换到统一 `ExternalGame` 结构。
4. 补测试覆盖：成功拉取、账号不存在、平台返回空库、重复同步幂等。
5. 如果 Steam 资料公开性有限，明确产品回退路径和错误文案。

**Verification:**
- 真实 Steam 账号可绑定
- 手动同步能导入真实游戏
- 连续同步不产生重复 `UserGame`

## Task 4: 替换 PlayStation mock adapter

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/platforms/adapters.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/platforms/playstation.ts`
- Create: `/Users/cl/Projects/Gamebook/src/lib/platforms/playstation.test.ts`

**Steps:**
1. 在不改上层 API 的前提下实现真实 `PlayStationAdapter`。
2. 如果官方/非官方能力有限，先实现“可接受的半自动/只读同步路径”，但保持手动同步入口不变。
3. 明确失败状态写回 `ConnectedAccount.lastSyncError` 的规则。
4. 补测试覆盖：连接失败、同步失败、空库、重复同步。

**Verification:**
- PS 账号可绑定或有明确失败提示
- 同步失败不影响已有书柜和笔记

## Task 5: 增强书柜与详情体验

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/app/page.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/components/library-grid.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/components/library-controls.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/app/library/[userGameId]/page.tsx`
- Modify: `/Users/cl/Projects/Gamebook/src/components/note-panel.tsx`

**Steps:**
1. 首页补同步结果反馈、空状态、错误状态和平台未接入提示。
2. 书柜卡片增加“最近笔记时间 / 来源平台数 / 是否有笔记”更清晰的展示。
3. 详情页增加笔记为空时的引导和更清晰的平台来源块。
4. 补最小交互测试，覆盖筛选、排序、创建笔记后刷新结果。

**Verification:**
- 首页能清楚区分未绑定、已绑定未同步、同步失败、同步成功
- 筛选和排序切换后结果正确
- 新建笔记后详情页和首页状态都正确

## Task 6: 为 Xbox / Switch 做真正的扩展位

**Files:**
- Modify: `/Users/cl/Projects/Gamebook/src/lib/platforms/types.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/lib/platforms/adapters.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/components/library-controls.tsx`

**Steps:**
1. 保留现有枚举和模型，但把“未接入平台”的产品态做清楚。
2. 增加统一的 `not implemented` adapter 占位返回。
3. UI 上可展示“即将支持 Xbox / Switch”，但默认不暴露误导性 connect flow。

**Verification:**
- 新平台不会破坏现有页面和类型
- 未接入平台有明确反馈，不抛裸错误

## Task 7: 补测试矩阵

**Files:**
- Create: `/Users/cl/Projects/Gamebook/src/app/api/library/library-api.test.ts`
- Create: `/Users/cl/Projects/Gamebook/src/app/api/notes/notes-api.test.ts`
- Modify: `/Users/cl/Projects/Gamebook/src/lib/domain/library.test.ts`

**Steps:**
1. 扩充现有 domain test，覆盖跨平台合并、排序、平台过滤。
2. 增加 API 层测试，覆盖 connect、sync、notes 增删改。
3. 明确一组固定 seed 或 test helper，避免测试互相污染。

**Verification:**
- `npm run test` 稳定通过
- 单测能覆盖当前核心产品链路

## Recommended Execution Order

1. Task 1: 稳定基础设施与开发基线
2. Task 2: 接入真实用户认证
3. Task 3: 替换 Steam mock adapter
4. Task 4: 替换 PlayStation mock adapter
5. Task 7: 补测试矩阵
6. Task 5: 增强书柜与详情体验
7. Task 6: 为 Xbox / Switch 做真正的扩展位

## Notes For Future Sessions

- 当前代码已经可跑，不要重写整体架构。
- 优先沿用现有 `library-service`、`adapter`、`api route` 分层。
- 真实平台接入是下一阶段最大不确定性，先验证可行性，再扩 UI 细节。
- 若后续引入 Postgres，也应先保持 Prisma model 不变，先替换 datasource。
