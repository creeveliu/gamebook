# Gamebook

一个“个人游戏书柜”网站。

## 当前能力

- 真实绑定 `Steam`
- 首页手动触发 `同步游戏库`
- 海报墙形式展示个人游戏库
- 默认按 `最近游玩` 排序
- 显示总游玩时长和近两周游玩时长
- 每个游戏下支持多篇私密笔记

## 当前状态

- `Steam`：真实授权和真实同步已完成
- `PlayStation`：未接入真实同步，设置页只保留“即将支持”
- 首页 `/`：只展示游戏库和同步按钮
- 设置页 `/settings`：负责授权、连接、手动同步
- 游戏详情 `/library/:userGameId`：展示来源、时长和私密笔记

## 当前限制

- Steam 同步基于 `owned games` 语义，不等于完整“玩过历史”
- `家庭共享 / 借来的游戏` 不保证会被同步出来
- 最近游玩排序优先依赖 `GetOwnedGames` 中的 `rtime_last_played`
- `GetRecentlyPlayedGames` 只作为补充信号，可能为空
- 中文游戏名暂未做本地化补全，当前以 Steam 返回名称为准
- `PlayStation / Xbox / Switch` 暂无真实平台接入

## 技术栈

- `Next.js 16` + `App Router`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Prisma Client`
- `PostgreSQL`
- `Vitest`

## 数据模型

- `User`
- `ConnectedAccount`
- `Game`
- `UserGame`
- `UserGameSource`
- `GameNote`

`UserGame` 当前额外保存：
- `recentRank`
- `playtimeForeverMinutes`
- `playtimeLastTwoWeeksMinutes`

## 本地启动

```bash
npm install
npm run db:init
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

```env
DATABASE_URL="postgresql://..."
STEAM_WEB_API_KEY=your_key
STEAM_OPENID_REALM=http://localhost:3000
STEAM_OPENID_RETURN=http://localhost:3000/api/auth/steam/callback
```

线上部署时把这两个地址改成正式域名：

```env
STEAM_OPENID_REALM=https://your-domain.com
STEAM_OPENID_RETURN=https://your-domain.com/api/auth/steam/callback
```

## 可用脚本

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run db:init
npm run prisma:generate
npm run prisma:migrate:deploy
```

## 当前 API

- `GET /api/auth/steam/start`
- `GET /api/auth/steam/callback`
- `GET /api/connected-accounts`
- `POST /api/connected-accounts/:platform/connect`
- `POST /api/connected-accounts/:platform/sync`
- `GET /api/library`
- `GET /api/library/:userGameId`
- `POST /api/library/:userGameId/notes`
- `PATCH /api/notes/:noteId`
- `DELETE /api/notes/:noteId`

## Steam 接入说明

- 授权：`Steam OpenID`
- 用户资料：`ISteamUser/GetPlayerSummaries`
- 游戏库：`IPlayerService/GetOwnedGames`
- 最近游玩：优先取 `rtime_last_played`
- 近两周时长：尝试取 `GetRecentlyPlayedGames`

## 代码结构

- `src/app`：页面与 API routes
- `src/components`：前端组件
- `src/lib/library-service.ts`：书柜、同步、笔记服务层
- `src/lib/platforms/steam.ts`：Steam 平台接入
- `src/lib/platforms/adapters.ts`：平台 adapter 分发
- `prisma/schema.prisma`：Prisma schema
- `prisma/migrations`：数据库 migration
- `docs/plans/2026-04-04-gamebook-next-phase.md`：后续开发计划

## 部署说明

- 托管：`Vercel`
- 数据库：`PostgreSQL`
- 构建时需要先执行 Prisma migration
- 线上至少要配置：
  - `DATABASE_URL`
  - `STEAM_WEB_API_KEY`
  - `STEAM_OPENID_REALM`
  - `STEAM_OPENID_RETURN`
