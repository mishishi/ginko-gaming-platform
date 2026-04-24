# 银古客栈产品增强需求文档

> 创建时间：2026-04-24
> 优先级：P0 > P1 > P2 > P3

---

## P0 - 必须解决（影响核心体验）

### P0-1: 游戏成就触发链路修复

**问题描述**
游戏没有发送 postMessage，成就永远不解锁，核心激励循环失效。

**现状分析**
- `GameFrame.tsx` 监听 `SCORE_REPORT` 消息并调用 `recordPlay()`
- 但 idol/quiz/fate 三个游戏项目未发送该消息
- `child-game` 项目的 RhythmPage 在 `endGame()` 后未调用 `parent.postMessage()`

**解决方案**
在每个游戏项目的游戏结束位置添加 postMessage 调用：

```javascript
// 游戏结束时向平台发送成绩
parent.postMessage({
  type: 'SCORE_REPORT',
  score: playResult.score,
  duration: gameDurationSeconds,
  won: playResult.grade !== 'D'
}, '*')
```

**涉及文件**
- `child-game/src/renderer/components/RhythmPage.tsx` (endGame 函数)
- idol/quiz/fate 游戏项目（需确认路径后修改）

**验收标准**
- 在游戏页面控制台手动发送 postMessage 后，成就系统能正确解锁对应成就

---

### P0-2: 成就解锁仪式感

**问题描述**
成就解锁了但用户感知不到，没有反馈。

**现状分析**
- `useGameStats.recordPlay()` 返回 `newlyUnlocked` 成就列表
- 但 `GameFrame.tsx` 只记录了成绩，未处理成就解锁 UI

**解决方案**
1. 在 `GameFrame.tsx` 中检查 `newlyUnlocked.length > 0`
2. 弹出 CelebrationModal（全屏动画 + 音效）
3. 集成 `ShareCardModal` 用于分享成就图片

**涉及文件**
- `components/GameFrame.tsx`
- `components/CelebrationModal.tsx` (已有)
- `components/ShareCardModal.tsx` (已有)

**验收标准**
- 成就解锁时全屏庆祝动画 + 音效
- 可分享成就图片到本地

---

### P0-3: 新用户引导流程

**问题描述**
新用户进入 app 后不知道该做什么，没有引导。

**现状分析**
- 首页有签到入口、游戏卡片、排行榜
- 但没有首次欢迎流程

**解决方案**
新用户首次进入时（localStorage 中无 stats）弹出欢迎流程：
1. 介绍签到系统（每日签到 + EXP）
2. 介绍游戏入口
3. 介绍成就系统
4. 引导完成首次签到

**涉及文件**
- `app/page.tsx` 或 `app/layout.tsx`
- 新增 `components/OnboardingModal.tsx`

**验收标准**
- 新用户首次打开 app 看到引导流程
- 引导完成后不再显示

---

## P1 - 重要功能

### P1-1: 好友互动增强

**现状**
只能加好友、看不排名，没有互动。

**待实现功能**
- [ ] 好友排行榜筛选（已有 UI，未集成）
- [ ] 被好友超越时通知
- [ ] 好友最近游戏动态

**涉及文件**
- `components/FriendsModal.tsx`
- `hooks/useFriends.ts`
- `components/LeaderboardPanel.tsx`

---

### P1-2: 签到激励优化

**现状**
签到 7 天才有奖励，后续太稀疏。

**待实现功能**
- [ ] 补签卡（streak freeze）实际可用（已有数据字段）
- [ ] 周末双倍 EXP UI 提示
- [ ] 签到中断后给"重新开始 X 天"阶段性目标
- [ ] 里程碑奖励补发（14/21/60/90 天）

**涉及文件**
- `hooks/useCheckIn.ts`
- `app/checkin/page.tsx`

---

### P1-3: 等级系统赋予意义

**现状**
等级只是数字，没有实际作用。

**待实现功能**
- [ ] 等级解锁不同"称号"（展示在头像旁）
- [ ] 等级解锁新游戏功能/皮肤
- [ ] 等级排行榜

**涉及文件**
- `components/NavBar.tsx`
- `app/user/page.tsx`
- `lib/db.ts` (等级字段)

---

### P1-4: 数据可视化

**现状**
StatsSummary 是纯文字，gameSessions 存了但没用。

**待实现功能**
- [ ] 安装 recharts
- [ ] `components/charts/GameComparisonChart.tsx` - 柱状图
- [ ] `components/charts/PlayHistoryChart.tsx` - 折线图
- [ ] `components/charts/WinRateChart.tsx` - 饼图
- [ ] `components/charts/WeeklyComparisonChart.tsx` - 分组柱状图
- [ ] `components/charts/SkillRadarChart.tsx` - 雷达图
- [ ] StatsSummary 图表模式切换

**涉及文件**
- `components/StatsSummary.tsx`
- `components/charts/` (新建目录)

**依赖**
```bash
npm install recharts
```

---

## P2 - 体验优化

### P2-1: 成就展示页优化

**待实现功能**
- [ ] 锁定成就显示"解锁条件"
- [ ] 按稀有度分类（普通/稀有/史诗/传说）
- [ ] 成就总进度展示

**涉及文件**
- `app/user/page.tsx`
- `components/AchievementBadge.tsx`

---

### P2-2: 游戏预热/说明

**待实现功能**
- [ ] 每个游戏加"游戏说明"入口
- [ ] 难度选择
- [ ] 玩法预告视频（可选）

**涉及文件**
- `components/GameCard.tsx`
- `app/games/[slug]/page.tsx`

---

## P3 - 长期差异化

### P3-1: 数据持久化

**待实现功能**
- [ ] 邮箱/密码登录
- [ ] Google OAuth 登录
- [ ] 云端数据同步（换设备不丢失）

**涉及文件**
- `lib/db.ts`
- `app/api/user/register/route.ts`
- `app/api/user/login/route.ts`
- `app/api/user/sync/route.ts`

---

### P3-2: 社区氛围

**待实现功能**
- [ ] 玩家之间留言/点赞
- [ ] 每周"最受欢迎游戏"投票
- [ ] 玩家创作展示（成就墙/精彩瞬间）

---

## 实施顺序建议

```
第一阶段（P0）:
1. P0-1 修复成就触发链路
2. P0-2 成就解锁仪式感
3. P0-3 新用户引导

第二阶段（P1）:
4. P1-4 数据可视化
5. P1-2 签到激励优化
6. P1-1 好友互动增强

第三阶段（P2）:
7. P2-1 成就展示页优化
8. P2-2 游戏预热说明

第四阶段（P3）:
9. P3-1 数据持久化
10. P3-2 社区氛围
```

---

## 验证清单

- [ ] 成就链路修复后，通过控制台发送 postMessage 能解锁成就
- [ ] 成就解锁时弹出庆祝动画
- [ ] 新用户首次进入看到引导流程
- [ ] StatsSummary 切换图表模式正常渲染
- [ ] 签到 7 天获得补签卡奖励
- [ ] 周末签到显示双倍 EXP 提示
