self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('swasthai-cache-v1').then(function(cache) {
        return cache.addAll([
          'index.html',
          'manifest.json',
          'icon-192.png',
          'icon-512.png',
          'bmi.html',
          'calendar.html',
          'clinics.html',
          'feeling-lucky.html',
          'health-checklist.html',
          'HealthTips.html',
          'language.html',
          'referral.html',
          'voice.html'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
