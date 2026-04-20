# 新手引导 Tour 设计方案

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为首次访问用户创建中式卷轴风格的新手引导，提升首次留存

**Architecture:** 纯前端组件，使用 localStorage 标记已完成状态，4 步骤引导流程

**Tech Stack:** React, CSS animations, localStorage

---

## 1. Concept & Vision

首次访问银古客栈时，以卷轴展开的动画形式展示客栈理念和游戏入口。引导页采用中式古典美学——卷轴、灯笼、墨迹——强化「旅人游戏驿站」的品牌印象。引导可随时跳过，完成后会标记 `hasSeenTour`。

---

## 2. Design Language

### 风格
- 中式古典卷轴风格
- 深色背景配金色/铜色点缀
- 灯笼光晕效果

### 色彩
- 主色：`--accent-copper` (#b8945f)
- 辅助：`--accent-silver` (#c9c5c0)
- 背景：`--bg-primary` (#0f0f0f)
- 文字：`--text-primary` (#e8e4dc)

### 字体
- 标题：`var(--font-serif)`, Noto Serif SC
- 正文：系统默认

### 动效
- 卷轴展开：scale + opacity 渐入
- 灯笼浮动：subtle float animation
- 步骤切换：fade transition

---

## 3. Layout & Structure

### 4 步骤流程

| 步骤 | 内容 | 焦点元素 |
|------|------|----------|
| 1/4 | 欢迎页 | 品牌 logo + 标语 |
| 2/4 | 游戏介绍 | 三个游戏卡片预览 |
| 3/4 | 快捷操作 | 键盘快捷键提示 |
| 4/4 | 完成 | 引导完成徽章 |

### 布局
```
┌─────────────────────────────────────┐
│ [× 跳过]                    (1/4)  │
│                                     │
│         🏮 银古客栈 🏮              │
│         ═══════════════            │
│                                     │
│      「旅人的游戏驿站」              │
│                                     │
│     ┌────┐  ┌────┐  ┌────┐        │
│     │🎴  │  │🧠  │  │🔮  │        │
│     └────┘  └────┘  └────┘        │
│                                     │
│         [踏入客栈 →]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Features & Interactions

### 核心功能
- **自动触发**：localStorage 无 `hasSeenTour` 标记时显示
- **手动跳过**：右上角 × 按钮，立即关闭并标记
- **步骤导航**：下一步按钮 + 底部进度指示器
- **键盘支持**：ESC 关闭，← → 切换步骤

### 交互细节
| 交互 | 行为 |
|------|------|
| 点击「踏入客栈」 | 关闭引导，标记已完成 |
| 点击「跳过」 | 立即关闭，标记已完成 |
| 按 ESC | 立即关闭，标记已完成 |
| 点击任意其他地方 | 无响应（防止误触） |

### 状态存储
```typescript
localStorage.setItem('hasSeenTour', 'true')
```

---

## 5. Component Inventory

### TourGuide (主组件)
- 全屏 overlay，背景模糊
- 4 个步骤子面板
- 进度指示器 (●○○○)

### TourStepWelcome (步骤 1)
- 品牌 logo + 灯笼装饰
- 主标语展示

### TourStepGames (步骤 2)
- 三个游戏缩略介绍
- 游戏图标 + 名称 + 一句话描述

### TourStepShortcuts (步骤 3)
- 快捷键提示卡片
- G/1/2/3 导航，ESC 退出等

### TourStepComplete (步骤 4)
- 引导完成徽章动画
- 「欢迎回来」文案

### LanternDecoration (装饰)
- 浮动灯笼 SVG
- 轻微发光动画

---

## 6. Technical Approach

### 文件结构
```
components/
  TourGuide.tsx       # 主组件
  TourStep*.tsx       # 各步骤组件
hooks/
  useTour.ts          # Tour 状态管理
```

### 实现步骤
1. 创建 `useTour` hook 检测是否需要显示
2. 创建 `TourGuide` 主组件
3. 创建 4 个步骤子组件
4. 集成到 `app/layout.tsx`
5. 添加动画样式

### 检测逻辑
```typescript
const shouldShowTour = useMemo(() => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('hasSeenTour') !== 'true'
}, [])
```

---

## 7. Non-Goals (不做)

- 不做成就系统（后续独立项目）
- 不做多语言
- 不做用户账户系统
