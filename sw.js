// 基礎 Service Worker 配置
self.addEventListener('install', (event) => {
  console.log('Service Worker 已安裝');
});

self.addEventListener('fetch', (event) => {
  // 保持空邏輯，僅為了符合 PWA 安裝條件
});
