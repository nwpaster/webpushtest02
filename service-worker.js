
// installイベント
self.addEventListener('install', () => {
  console.log('[ServiceWorker]', 'インストールされましたー');
});

// pushイベント
self.addEventListener('push', ev => {
  console.log('[ServiceWorker]', 'プッシュされましたー!!', ev.data.json());
  const {title, msg, icon} = ev.data.json();
  self.registration.showNotification(title, {
    body: msg,
    icon: icon,
  });
});
