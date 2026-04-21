# PWA 离线能力实现计划

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完全离线可用，离线时游戏卡片显示橙色"离线"badge

**Architecture:**
- Service Worker 拦截所有请求，Cache-First 策略
- 离线时游戏卡片显示橙色 badge，点击进入后显示弹窗
- SW 安装失败静默降级

**Tech Stack:** Next.js App Router, Service Worker API, localStorage

---

## Task 1: 更新 Service Worker 缓存策略

**Files:**
- Modify: `public/sw.js`

- [ ] **Step 1: 读取当前 sw.js**

```bash
cat public/sw.js
```

- [ ] **Step 2: 替换 sw.js 为 Cache-First 策略**

```javascript
const CACHE_NAME = 'ginko-v1';

const PRECACHE_URLS = [
  '/',
  '/offline.html',
];

// Install: 预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-First，失败则回退到缓存或首页
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            throw new Error('Network and cache both failed');
          });
      })
  );
});
```

- [ ] **Step 3: 验证构建**

```bash
npm run build
```
Expected: PASS

- [ ] **Step 4: 提交**

```bash
git add public/sw.js
git commit -m "feat(pwa): update service worker cache-first strategy"
```

---

## Task 2: 创建离线游戏弹窗

**Files:**
- Create: `components/OfflineGameModal.tsx`

- [ ] **Step 1: 创建 OfflineGameModal 组件**

```typescript
'use client'

export default function OfflineGameModal() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="网络不可用">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-sm" />
      <div className="relative p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl text-center max-w-sm">
        <div className="text-4xl mb-4" aria-hidden="true">📡</div>
        <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-serif), serif' }}>
          网络不可用
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          请检查网络连接后重试
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 rounded-lg bg-[var(--accent-copper)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 验证构建**

```bash
npm run build
```
Expected: PASS

- [ ] **Step 3: 提交**

```bash
git add components/OfflineGameModal.tsx
git commit -m "feat(ui): add offline game modal component"
```

---

## Task 3: GameCard 添加离线 Badge

**Files:**
- Modify: `components/GameCard.tsx`

- [ ] **Step 1: 读取 GameCard.tsx**

```bash
cat components/GameCard.tsx
```

- [ ] **Step 2: 添加离线状态检测**

在 GameCard 组件内添加 useState 和 useEffect：

```typescript
const [isOnline, setIsOnline] = useState(true)

useEffect(() => {
  setIsOnline(navigator.onLine)
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])
```

- [ ] **Step 3: 修改状态显示逻辑**

在现有的状态判断中，找到：
```typescript
{isLoading ? (...) : game.playable && isReachable ? (...) : game.playable ? (...) : (...)}
```

在 `game.playable ? (...)` 分支中，添加离线判断：

当 `isOnline === false && game.playable` 时，显示橙色"离线"badge：

```typescript
{!isOnline && game.playable ? (
  <span
    className="text-[9px] px-1.5 py-0.5 rounded"
    style={{ backgroundColor: 'rgba(212,132,90,0.2)', color: 'var(--accent-orange)' }}
  >
    离线
  </span>
) : isLoading ? (...) : game.playable && isReachable ? (...) : game.playable ? (...) : (...)}
```

- [ ] **Step 4: 验证构建**

```bash
npm run build
```
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add components/GameCard.tsx
git commit -m "feat(ui): add offline badge to game card"
```

---

## Task 4: GamePage 添加离线检测和弹窗

**Files:**
- Modify: `app/games/[slug]/page.tsx`

- [ ] **Step 1: 读取 GamePage.tsx**

```bash
cat app/games/[slug]/page.tsx
```

- [ ] **Step 2: 导入 OfflineGameModal**

在文件顶部 import 区域添加：
```typescript
import OfflineGameModal from '@/components/OfflineGameModal'
```

- [ ] **Step 3: 添加客户端离线状态**

GamePage 是 server component，需要改为 client component（或拆分逻辑）。最简单的方式：在 GamePage 组件末尾添加：

```typescript
'use client'

// ... existing imports

export default function GamePage({ params }: GamePageProps) {
  // ... existing code
}
```

在文件开头 `'use client'` 声明。

- [ ] **Step 4: 添加离线检测 hooks**

在 GamePage 组件内，在 `const game = getGameBySlug(params.slug)` 之后添加：

```typescript
const [isOnline, setIsOnline] = useState(true)

useEffect(() => {
  setIsOnline(navigator.onLine)
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])
```

- [ ] **Step 5: 在游戏区域前添加离线弹窗**

在 `{/* Game iframe or maintenance state */}` 注释之后，`{!game.playable ? (...) : (` 之前，添加：

```typescript
{isOnline === false && game.playable && <OfflineGameModal />}
```

- [ ] **Step 6: 验证构建**

```bash
npm run build
```
Expected: PASS

- [ ] **Step 7: 提交**

```bash
git add app/games/[slug]/page.tsx
git commit -m "feat(game-page): add offline detection and modal"
```

---

## 验证

完成后验证：

1. Chrome DevTools → Network → Offline
2. 首页应正常加载（所有资源来自缓存）
3. 游戏卡片显示橙色"离线" badge
4. 点击游戏卡片进入，显示"网络不可用"弹窗
5. 恢复网络，badge 消失
