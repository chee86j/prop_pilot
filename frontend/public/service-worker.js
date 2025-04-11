/*
This file helps incorporate web performance optimization by:
1. Caching static assets
2. Caching dynamic assets
3. Handling API requests with specific strategies
4. Handling push notifications
5. Handling notification clicks
*/

const CACHE_NAME = "prop-pilot-cache-v1";
const DYNAMIC_CACHE = "prop-pilot-dynamic-v1";

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
};

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/assets/icons/logo.svg",
  "/assets/icons/google.svg",
  "/assets/icons/facebook.svg",
  "/assets/icons/github.svg",
  "/assets/icons/plane.svg",
];

// API Routes
/*
   1. Implements specific caching strategies for different API routes
   2. Uses timeouts to prevent hanging requests
   3. Includes cache duration controls
*/
const API_ROUTES = [
  {
    route: "/api/properties",
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    timeout: 3000,
  },
  {
    route: "/api/user/profile",
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    timeout: 2000,
  },
  {
    route: "/api/phases",
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    timeout: 3000,
  },
];

// ROUTE STRATEGIES
/*
   1. Sets specific cache durations for different types of content
   2. Uses longer cache times for static assets like images
   3. Implements shorter cache times for dynamic data
*/
const ROUTE_STRATEGIES = [
  {
    pattern: /\/api\/properties\/\d+$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    timeout: 3000,
    cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
  },
  {
    pattern: /\/api\/properties$/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    timeout: 3000,
    cacheDuration: 60 * 60 * 1000, // 1 hour
  },
  {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  {
    pattern: /\.(js|css|woff2|woff|ttf)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
  },
];

// Install event - cache static assets with error handling
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log("📦 Caching static assets");

        // Cache assets one by one to handle failures gracefully
        await Promise.all(
          STATIC_ASSETS.map(async (url) => {
            try {
              await cache.add(url);
            } catch (error) {
              console.warn(`⚠️ Failed to cache: ${url}`, error);
            }
          })
        );

        await self.skipWaiting();
      } catch (error) {
        console.error("❌ Service worker installation failed:", error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map((name) => {
              console.log(`🗑️ Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Enhanced networkFirstWithTimeout with cache duration
async function networkFirstWithTimeout(
  request,
  timeout = 3000,
  cacheDuration = null
) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network request timed out")), timeout)
    );

    const networkPromise = fetch(request)
      .then(async (response) => {
        if (!response || !response.ok) {
          return response;
        }

        try {
          const responseClone = response.clone();
          const cache = await caches.open(DYNAMIC_CACHE);

          if (cacheDuration) {
            const headers = new Headers(responseClone.headers);
            headers.append("sw-cache-timestamp", Date.now());
            headers.append("sw-cache-duration", cacheDuration);

            const responseToCache = new Response(await responseClone.blob(), {
              status: responseClone.status,
              statusText: responseClone.statusText,
              headers: headers,
            });

            await cache.put(request, responseToCache);
          } else {
            await cache.put(request, responseClone);
          }
        } catch (cacheError) {
          console.error("Error caching response:", cacheError);
        }

        return response;
      })
      .catch((error) => {
        console.error("Fetch error in networkFirstWithTimeout:", error);
        throw error;
      });

    return await Promise.race([networkPromise, timeoutPromise]);
  } catch (error) {
    console.error("networkFirstWithTimeout error:", error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      // Check if cache is still valid
      const timestamp = cachedResponse.headers.get("sw-cache-timestamp");
      const duration = cachedResponse.headers.get("sw-cache-duration");

      if (timestamp && duration) {
        const age = Date.now() - parseInt(timestamp);
        if (age < parseInt(duration)) {
          return cachedResponse;
        }
      } else {
        return cachedResponse;
      }
    }

    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const response = await fetch(request);
  if (response.ok) {
    const responseClone = response.clone();
    await caches
      .open(DYNAMIC_CACHE)
      .then((cache) => cache.put(request, responseClone));
  }
  return response;
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  try {
    const cachedResponse = await caches.match(request);

    const fetchPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch((error) => {
        console.error("Fetch failed in staleWhileRevalidate:", error);
        throw error;
      });

    return cachedResponse || fetchPromise;
  } catch (error) {
    console.error("Error in staleWhileRevalidate:", error);
    throw error;
  }
}

// Enhanced fetch event handler
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Find matching API route
  const apiRoute = API_ROUTES.find((route) =>
    url.pathname.startsWith(route.route)
  );
  if (apiRoute) {
    event.respondWith(networkFirstWithTimeout(event.request, apiRoute.timeout));
    return;
  }

  // Find matching route strategy
  const routeStrategy = ROUTE_STRATEGIES.find((route) =>
    route.pattern.test(event.request.url)
  );
  if (routeStrategy) {
    event.respondWith(
      (async () => {
        try {
          switch (routeStrategy.strategy) {
            case CACHE_STRATEGIES.NETWORK_FIRST:
              return await networkFirstWithTimeout(
                event.request,
                routeStrategy.timeout,
                routeStrategy.cacheDuration
              );
            case CACHE_STRATEGIES.CACHE_FIRST:
              return await cacheFirst(event.request);
            case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
              return await staleWhileRevalidate(event.request);
            default:
              return await fetch(event.request);
          }
        } catch (error) {
          console.error("Service worker fetch error:", error);
          if (event.request.mode === "navigate") {
            const cache = await caches.open(CACHE_NAME);
            return cache.match("/offline.html");
          }
          throw error;
        }
      })()
    );
    return;
  }

  // Default behavior for non-matched routes
  event.respondWith(fetch(event.request));
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/assets/images/logo.png",
    badge: "/assets/images/badge.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("PropPilot Update", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
