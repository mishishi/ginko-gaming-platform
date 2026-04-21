# PWA 离线能力设计

**目标：** 完全离线可用，离线时游戏卡片显示"离线"badge

**架构：**
- Service Worker 拦截所有请求，优先从缓存返回
- 离线时游戏卡片显示橙色"离线"badge
- 点击离线游戏进入后弹出网络不可用提示
- SW 安装失败静默降级

---

## 组件设计

### ServiceWorkerRegistration.tsx

现有 SW 注册逻辑不变。

**新增 sw.js 生成：**
- Next.js 可通过 `output: 'export'` 或自定义 SW 实现
- 本项目使用自定义 SW，放在 `public/sw.js`

**SW 策略：**
```javascript
// 预缓存 (install 事件)
CACHE_NAME = 'ginko-v1'
// 缓存: 所有 HTML、JS、CSS、图片

// Fetch (fetch 事件)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match('/')) // 离线 fallback 到首页
  )
})

// Activate: 清理旧版本缓存
```

### OfflineIndicator.tsx

复用现有组件。离线时显示 amber 横幅。

### GameCard.tsx

**修改：**
- 当 `navigator.onLine === false` 且游戏状态未知时，显示橙色"离线"badge
- 游戏不可玩时（playable=false）仍显示"维护中"，不变

**Badge 显示逻辑：**
```typescript
// GameCard.tsx - 状态判断
const isOffline = !navigator.onLine && game.playable
// 显示: <span className="..." style={{ backgroundColor: 'rgba(212,132,90,0.2)', color: 'var(--accent-orange)' }}>离线</span>
```

### OfflineGameModal.tsx

**新建组件**

离线用户点击游戏卡片进入时显示弹窗：

```typescript
export default function OfflineGameModal() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--bg-primary)]/90 backdrop-blur-sm" />
      <div className="relative p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center max-w-sm">
        <div className="text-4xl mb-4">📡</div>
        <h3 className="text-xl text-[var(--text-primary)] mb-2">网络不可用</h3>
        <p className="text-[var(--text-secondary)] text-sm">请检查网络连接后重试</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 px-6 py-2 rounded-lg bg-[var(--accent-copper)] text-[var(--bg-primary)]"
        >
          返回首页
        </button>
      </div>
    </div>
  )
}
```

### GamePage.tsx

**修改：**
- 添加离线检测，当游戏可玩但网络离线时，显示 `<OfflineGameModal />`
- 位置：在游戏 iframe 或维护状态之前

```typescript
// app/games/[slug]/page.tsx
const [isOffline, setIsOffline] = useState(false)

useEffect(() => {
  setIsOffline(!navigator.onLine)
  const handleOnline = () => setIsOffline(false)
  const handleOffline = () => setIsOffline(true)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
}, [])

// 在游戏区域之前
{isOffline && game.playable && <OfflineGameModal />}
```

---

## 数据流

```
User 离线
  ↓
navigator.onLine = false
  ↓
GameCard 检测到 isOffline && game.playable
  ↓
显示橙色"离线" badge
  ↓
用户点击进入
  ↓
GamePage 检测到 isOffline && game.playable
  ↓
渲染 <OfflineGameModal />，阻止游戏 iframe 加载
```

---

## 文件清单

- Create: `public/sw.js` — Service Worker
- Modify: `components/ServiceWorkerRegistration.tsx` — 注册 SW
- Modify: `components/GameCard.tsx` — 添加离线 badge
- Create: `components/OfflineGameModal.tsx` — 离线弹窗
- Modify: `app/games/[slug]/page.tsx` — 添加离线检测和弹窗

---

## 验证

1. Chrome DevTools → Network → Offline
2. 首页应正常加载
3. 游戏卡片显示橙色"离线" badge
4. 点击游戏卡片进入，显示"网络不可用"弹窗
5. 恢复网络，badge 消失
