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
- 生产域名：`https://gamebook.us.ci`

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

## Steam 回调域名

- Steam OpenID 的 `realm` 和 `return_to` 现在会按当前访问域名动态生成。
- 这可以避免 Vercel 别名变更后，环境变量里的旧域名导致授权回调落到 `404`。
- 因此不再需要维护 `STEAM_OPENID_REALM` / `STEAM_OPENID_RETURN`。

## 自定义域名记录

- 当前生产主域名是 `gamebook.us.ci`。
- Vercel 绑定自定义域名时，根域名使用 `A` 记录指向 `216.198.79.1`。
- 如果域名曾绑定过其他 Vercel 账号，需要额外添加 `_vercel` 的 `TXT` 验证记录。
- 绑定完成后，Steam 授权与回调会自动跟随当前访问域名，无需再改代码或环境变量。
