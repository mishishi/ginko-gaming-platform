# 银古客栈 · 游戏平台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建银古客栈游戏平台（MVP），包含首页 + 三个游戏页面

**Architecture:** Next.js App Router + Tailwind CSS，iframe 嵌入各游戏，藏品卡片设计语言

**Tech Stack:** Next.js 14, Tailwind CSS, TypeScript

---

## 文件结构

```
ginko-gaming-platform/
├── app/
│   ├── layout.tsx              # 根布局：NavBar + 全局样式
│   ├── page.tsx                # 首页：游戏大厅
│   ├── globals.css             # 全局样式：CSS 变量 + 字体
│   └── games/
│       └── [slug]/
│           └── page.tsx        # 游戏页面（动态路由）
├── components/
│   ├── NavBar.tsx              # 导航栏
│   ├── GameCard.tsx            # 藏品卡片组件
│   └── GameFrame.tsx           # iframe 包装组件
├── lib/
│   └── games.ts                # 游戏配置数据
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-04-20-gaming-platform-design.md
│       └── plans/
│           └── 2026-04-20-gaming-platform-implementation.md
└── package.json
```

---

## 设计规范

### 配色（CSS 变量）

```css
:root {
  --bg-primary: #0a0d0f;        /* 深墨背景 */
  --bg-secondary: #12161a;      /* 卡片背景 */
  --bg-card: #1a1f24;           /* 藏品卡片底色 */
  --accent-amber: #d4a574;      /* 琥珀灯笼光 */
  --accent-green: #4a5c4f;      /* 幽绿自然 */
  --text-primary: #e8e4df;      /* 暖白文字 */
  --text-secondary: #8a8680;    /* 次要文字 */
  --glow-idol: #ff9ecf;         /* idol 粉色光 */
  --glow-quiz: #00f5ff;         /* quiz 青色光 */
  --glow-fate: #b8945f;         /* fate 古铜光 */
}
```

### 字体

- 标题：Noto Serif SC（古典衬线）
- 正文：Noto Sans SC（简洁无衬线）

### 藏品卡片设计

每张卡片像博物馆展品：
- 深色底板 `#1a1f24`，圆角 `16px`
- 顶部游戏代表色渐入（20% 透明度）作为"主光"
- 卡片悬浮时：`translateY(-8px)` + 边缘光晕加强
- 卡片内：游戏名（衬线）+ 一句话描述 + 代表色 accent

### 动画

- 页面加载：卡片 staggered 淡入（delay 0ms, 100ms, 200ms）
- 悬浮：smooth 300ms ease-out
- 背景：微弱雾气动效（CSS blur + 动画）

---

## Task 1: 初始化 Next.js 项目

- [ ] 创建 package.json
- [ ] 创建 next.config.js
- [ ] 创建 tsconfig.json
- [ ] 创建 tailwind.config.ts
- [ ] 创建 postcss.config.js
- [ ] 安装依赖

**package.json:**
```json
{
  "name": "ginko-gaming-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## Task 2: 创建全局样式和布局

- [ ] 创建 app/globals.css（含 CSS 变量 + 字体 + 背景动效）
- [ ] 创建 app/layout.tsx（含 NavBar）

**app/globals.css 关键样式:**
- CSS 变量定义（配色）
- Google Fonts 引入（Noto Serif SC + Noto Sans SC）
- 背景雾气动效（.fog-bg）
- 滚动条样式

**app/layout.tsx:**
- 根布局包裹 NavBar
- metadata 设置（title: 银古客栈）

---

## Task 3: 创建导航栏组件

- [ ] 创建 components/NavBar.tsx

**设计:**
- 固定顶部，半透明深色背景 `rgba(10,13,15,0.85)` + backdrop-blur
- 左：Logo "银古客栈"（Noto Serif SC，琥珀色）
- 右：三个游戏图标链接
- 悬浮时游戏图标微微发光

---

## Task 4: 创建游戏配置数据

- [ ] 创建 lib/games.ts

```typescript
export interface Game {
  slug: string
  title: string
  subtitle: string
  description: string
  color: string
  glowColor: string
  devUrl: string
  prodUrl: string
}

export const games: Game[] = [
  {
    slug: 'idol',
    title: '偶像收藏',
    subtitle: '收集你的偶像，组成最强阵容',
    description: '偶像收集类卡牌游戏',
    color: '#ff9ecf',
    glowColor: 'rgba(255,158,207,0.4)',
    devUrl: 'http://localhost:3002',
    prodUrl: 'https://idol.yourdomain.com',
  },
  {
    slug: 'quiz',
    title: '知识竞技',
    subtitle: '知识对战，先得 10 分获胜',
    description: '小学初中知识答题竞技',
    color: '#00f5ff',
    glowColor: 'rgba(0,245,255,0.4)',
    devUrl: 'http://localhost:3003',
    prodUrl: 'https://quiz.yourdomain.com',
  },
  {
    slug: 'fate',
    title: '命运占卜',
    subtitle: '探索你的命运轨迹',
    description: 'AI算命占卜类游戏',
    color: '#b8945f',
    glowColor: 'rgba(184,148,95,0.4)',
    devUrl: 'http://localhost:3004',
    prodUrl: 'https://fate.yourdomain.com',
  },
]
```

---

## Task 5: 创建首页

- [ ] 创建 app/page.tsx

**布局:**
1. Hero 区域：标题 "银古客栈" + 副标题 "旅人的游戏驿站"
2. 游戏展品区：三列卡片网格（桌面）/ 单列（移动）
3. Footer

**页面加载动画:**
- Hero 文字淡入
- 卡片 staggered 出现（animation-delay）

---

## Task 6: 创建藏品卡片组件

- [ ] 创建 components/GameCard.tsx

**Props:**
```typescript
interface GameCardProps {
  game: Game
  index: number
}
```

**设计:**
- 深色卡片底板 + 顶部渐变色条（游戏代表色）
- 游戏名（Noto Serif SC，24px）
- 副标题描述（Noto Sans SC，14px，text-secondary）
- 底部代表色装饰线
- Hover：`translateY(-8px)` + box-shadow 光晕
- 点击进入 /games/[slug]

---

## Task 7: 创建游戏页面

- [ ] 创建 app/games/[slug]/page.tsx

**布局:**
- 顶部 mini 导航栏（返回首页 + 游戏名）
- 全屏 iframe 嵌入游戏
- iframe 高度 100vh - 导航栏高度

**逻辑:**
- 根据 params.slug 查找游戏配置
- 找不到则 404
- iframe src 使用 devUrl（开发环境）

---

## Task 8: 创建 iframe 包装组件

- [ ] 创建 components/GameFrame.tsx

**功能:**
- 全屏 iframe
- 处理 iframe postMessage 通信（预留）
- 加载状态显示（可选）

---

## Task 9: 初始化 Git 并提交

- [ ] git init
- [ ] 创建 .gitignore
- [ ] 提交所有文件

---

## 验证清单

- [ ] `npm run dev` 能启动
- [ ] 首页显示三个游戏卡片
- [ ] 点击卡片跳转 /games/[slug]
- [ ] 游戏页面 iframe 嵌入（开发服务器需分别启动）
- [ ] 响应式布局正常（桌面/平板/手机）
- [ ] 动画效果正常（加载 + 悬浮）