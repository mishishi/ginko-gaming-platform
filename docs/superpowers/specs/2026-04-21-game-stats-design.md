# 游戏统计与成就系统设计方案

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为银古客栈添加本地游戏统计和成就系统，提升用户留存

**Architecture:** 纯前端，使用 localStorage 存储统计数据，成就徽章本地管理

**Tech Stack:** React, localStorage, CSS animations

---

## 1. Concept & Vision

玩家在银古客栈的每次游戏都有记录。通过成就徽章展示收集进度，给玩家"积累"的成就感。统计展示简洁，徽章设计精致，与客栈古典美学一致。

---

## 2. Design Language

### 风格
- 中式古典 + 成就徽章系统
- 深色背景配金色徽章边框
- 徽章有内敛的光晕效果

### 色彩
- 主色：--accent-copper (#b8956e)
- 成就未获得：--text-muted (#6d6862)
- 成就已获得：金色渐变 + glow

### 字体
- 标题：var(--font-serif), Noto Serif SC
- 正文：系统默认

### 动效
- 徽章获得：scale + glow 爆发动画
- 徽章列表：stagger 渐入

---

## 3. Layout & Structure

### 首页展示（底部）
- 成就墙显示：已解锁/总数 + 徽章排列
- 统计摘要：游玩次数、最高分

### 成就列表
| 成就ID | 名称 | 条件 | 图标 |
|--------|------|------|------|
| first_play | 初入客栈 | 首次开始任意游戏 | 🎴 |
| idol_master | 偶像达人 | 偶像游戏达到100分 | ⭐ |
| quiz_master | 知识大师 | 竞技游戏达到100分 | 🧠 |
| fate_explorer | 命运探索者 | 命运游戏达到100分 | 🔮 |
| all_games | 全能旅人 | 三个游戏都玩过 | 🏮 |

---

## 4. Features & Interactions

### 统计数据
| 字段 | 说明 |
|------|------|
| playCount | 每个游戏游玩次数 |
| highScore | 每个游戏最高分 |
| lastPlayedAt | 最后游玩时间 |

### 交互
| 交互 | 行为 |
|------|------|
| 游戏结束 | 更新统计，检查并解锁成就 |
| 成就解锁 | 播放解锁动画（徽章发光+缩放） |
| 查看成就墙 | 首页底部直接显示徽章状态 |
| 徽章悬停 | 显示成就名称和条件 |

### 状态存储
```typescript
// localStorage key: 'yinqiu-stats'
interface GameStats {
  playCount: Record<string, number>
  highScore: Record<string, number>
  lastPlayedAt: Record<string, string>
  achievements: string[] // 已解锁的成就ID列表
}
```

---

## 5. Component Inventory

### useGameStats (hook)
- 管理游戏统计数据
- 提供 recordPlay(gameSlug, score) 方法
- 提供 achievements 列表和 unlocked 状态

### AchievementBadge
- 显示单个成就徽章
- 状态：已解锁（金色+发光）/ 未解锁（灰色+锁图标）

### AchievementWall
- 展示所有成就徽章
- 显示进度：已解锁/总数

### StatsSummary
- 首页底部统计摘要
- 显示游玩次数、最高分

---

## 6. Technical Approach

### 文件结构
hooks/
  useGameStats.ts      # 统计状态管理
components/
  AchievementBadge.tsx  # 单个徽章
  AchievementWall.tsx   # 徽章墙
  StatsSummary.tsx      # 统计摘要

### 实现步骤
1. 创建 useGameStats hook
2. 创建 AchievementBadge 组件
3. 创建 AchievementWall 组件
4. 创建 StatsSummary 组件
5. 集成到首页 page.tsx

### 数据更新时机
- 游戏结束（iframe postMessage 或页面 unload 时）

---

## 7. Non-Goals (不做)

- 不做排行榜（需要后端）
- 不做云同步
- 不做复杂成就（如连续登录天数）
- 不做成就详情弹窗（首页直接展示）
