# Gamebook Auth Design

**Date:** 2026-04-04

## Goal

把当前固定 demo user 的单用户实现，升级为真实多用户系统；未登录用户仍可访问首页壳子，但不能看到任何人的游戏库数据。

## Chosen Approach

使用 `Auth.js` + `Google` Provider。

原因：
- 与 `Next.js 16 App Router` 和 `Prisma` 最顺
- 不需要先做邮箱系统
- 能快速替换当前 `demo-user` 逻辑
- 后续可以继续追加 `GitHub` 等 provider

## Product Behavior

### Home `/`

- 未登录：
  - 可访问首页
  - 可看到品牌壳子、登录入口、书库空态提示
  - 不返回任何书库数据
- 已登录：
  - 显示当前用户自己的游戏库
  - 保留平台筛选和手动同步

### Settings `/settings`

- 未登录：
  - 显示登录提示
  - 不显示任何账号连接状态
- 已登录：
  - 显示当前用户的平台连接与同步控制

### Game Detail `/library/:userGameId`

- 未登录：
  - 不展示详情内容
  - 重定向到登录，或跳回首页登录引导
- 已登录：
  - 仅可访问自己的 `UserGame`
  - 非本人数据继续 `notFound`

### API

- `GET` 类读接口：
  - 只返回当前登录用户的数据
  - 未登录时返回空态或明确拒绝，按页面用途区分
- `POST/PATCH/DELETE` 写接口：
  - 未登录统一返回 `401`

## Data Model

保留现有业务主表 `User`，继续通过 `userId` 关联：
- `ConnectedAccount`
- `UserGame`
- `GameNote`

为 `Auth.js` 新增标准认证表：
- `Account`
- `Session`
- `VerificationToken`

原则：
- 不改现有业务数据归属方式
- session 最终映射到现有 `User.id`
- 每个用户继续可以分别绑定自己的平台账号

## Service Layer Changes

- 删除固定 demo user 假设
- `getCurrentUser()` 改为从服务端 session 获取用户
- 未登录时返回 `null` 或抛认证错误，由上层页面/API 分别处理
- 所有现有按 `userId` 过滤的查询逻辑保留

## Security Boundary

- 不允许未登录用户通过 API 读到任何私人书库、笔记、连接状态
- 不允许未登录用户执行 connect/sync/note 写操作
- 不允许用户访问其他用户的 `UserGame` 或 `GameNote`

## UI Direction

- 首页未登录空态文案强调：
  - 登录后即可同步 Steam
  - 登录后展示个人游戏库和私密笔记
- 保持当前产品约束：
  - 首页不加账号控制面板
  - 设置页仍是平台连接入口
  - 不恢复 PlayStation mock

## Testing Focus

- 未登录访问写接口返回 `401`
- 已登录用户只能读写自己的数据
- 未登录首页渲染空态而非真实书库
- 已登录首页正常渲染书库

## Out of Scope

- 邮箱密码系统
- 多 provider 账户合并策略扩展
- 公开分享书库
- PlayStation 真实接入
