importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
  console.log(`Workbox loaded successfully`);

  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: './nav.html', revision: '1' },
    { url: './index.html', revision: '1' },
    { url: './team.html', revision: '1' },
    { url: './manifest.json', revision: '1' },
    { url: './assets/css/materialize.min.css', revision: '1' },
    { url: './assets/js/materialize.min.js', revision: '1' },
    { url: './assets/js/nav.js', revision: '1' },
    { url: './assets/js/api.js', revision: '1' },
    { url: './assets/js/db.js', revision: '1' },
    { url: './assets/js/idb.js', revision: '1' },
    { url: './assets/js/register-service-worker.js', revision: '1' },
    { url: './assets/img/icon.png', revision: '1' },
  ], {
    ignoreUrlParametersMatching: [/.*/]
  });

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 7* 24 * 60 * 60, // 7 days
          maxEntries: 500,
          //purgeOnQuotaError: true, // safe to automatically delete if exceeding the available storage
        }),
      ]
    })
  );

  // API
  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/'),
    workbox.strategies.staleWhileRevalidate()
  );

  // Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  // Resources JS n CSS
  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Pages
  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
    })
  );

}else{
  console.log(`Workbox failed to load`);
}

//fitur application command
//Test push message from DevTools.
self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
      body = event.data.text();
  } else {
      body = 'Push message no payload';
  }
  const options = {
      body: body,
      icon: 'assets/img/icon.png',
      vibrate: [100, 50, 100],
      data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
      }
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options)
  );
});

