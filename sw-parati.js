// sw-parati.js — Service Worker para "Para Ti, Mi Amor"
// Coloca este archivo en la raíz de tu servidor (misma carpeta que el HTML)

const CACHE = 'parati-v1';
const ASSETS = []; // Agrega aquí rutas a cachear si sirves desde servidor propio

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Push event — recibe notificaciones cuando la app está cerrada
self.addEventListener('push', e => {
  let data = { title: '♥ Para Ti, Mi Amor', body: 'Tu pareja compartió algo especial' };
  try { data = e.data?.json() || data; } catch(_) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',   // Opcional: agrega un ícono de tu app
      badge: '/icon-72.png',   // Opcional
      tag: 'parati',
      renotify: true,
      data: { url: data.url || '/' }
    })
  );
});

// Notification click — abre la app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for(const c of list){
        if(c.url.includes(self.location.origin) && 'focus' in c) return c.focus();
      }
      return clients.openWindow(e.notification.data?.url || '/');
    })
  );
});

// Fetch — network first para Supabase, cache first para assets estáticos
self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase.co')) return; // No cachear Supabase
  // Pass-through por defecto
});