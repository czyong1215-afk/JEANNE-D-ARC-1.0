
// 暂时简化 Service Worker，只负责基本安装，不拦截 fetch 以免造成加载死锁
const CACHE_NAME = 'jalter-ai-v5';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(key => caches.delete(key))
    ))
  );
});

// 不进行 fetch 拦截，确保实时性
