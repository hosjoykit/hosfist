self.importScripts('/cachelist.js')
// eslint-disable-next-line no-undef
const version = versionTime
const addResourcesToCache = async resources => {
  const cache = await caches.open(version)
  await cache.addAll(resources)
  // console.log(self)
  // if ((await caches.keys()).some(item => item !== version)) {
  //   self.serviceWorker.postMessage('updated')
  // }
}

// const putInCache = async (request, response) => {
//   const cache = await caches.open(version)
//   await cache.put(request, response)
// }

// const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
//   // console.log(request);
//   // console.log(request.url);
//   // console.log(preloadResponsePromise);
//   // First try to get the resource from the cache
//   const responseFromCache = await caches.match(request)
//   if (responseFromCache) {
//     return responseFromCache
//   }
//   console.log('No match found request' + request.url)
//   // Next try to use the preloaded response, if it's there
//   const preloadResponse = await preloadResponsePromise
//   if (preloadResponse) {
//     console.info('using preload response', preloadResponse)
//     putInCache(request, preloadResponse.clone())
//     return preloadResponse
//   }

//   // Next try to get the resource from the network
//   try {
//     const responseFromNetwork = await fetch(request)

//     console.log(responseFromNetwork)
//     // response may be used only once
//     // we need to save clone to put one copy in cache
//     // and serve second one
//     putInCache(request, responseFromNetwork.clone())
//     return responseFromNetwork
//   } catch (error) {
//     const fallbackResponse = await caches.match(fallbackUrl)
//     if (fallbackResponse) {
//       return fallbackResponse
//     }
//     // when even the fallback response is not available,
//     // there is nothing we can do, but we must always
//     // return a Response object
//     return new Response('Network error happened', {
//       status: 408,
//       headers: { 'Content-Type': 'text/plain' }
//     })
//   }
// }

const respondWithHanlder = async ({ request, preloadResponsePromise }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }
  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    // putInCache(request, preloadResponse.clone())
    return preloadResponse
  }
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request)
    // console.log(responseFromNetwork)
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    return responseFromNetwork
  } catch (error) {
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// const enableNavigationPreload = async () => {
//   if (self.registration.navigationPreload) {
//     // Enable navigation preloads!
//     await self.registration.navigationPreload.enable()
//   }
// }

// self.addEventListener('activate', (event) => {

//   console.log('activate');
//   event.waitUntil(enableNavigationPreload());
// });

self.addEventListener('activate', event => {
  console.log('activate')
  const cacheWhitelist = [version]
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener('install', event => {
  console.log('install')
  event.waitUntil(
    // eslint-disable-next-line no-undef
    addResourcesToCache(cachelist)
  )
})
self.addEventListener('fetch', event => {
  // console.log('fetch');
  event.respondWith(
    respondWithHanlder({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  )
})
// self.addEventListener('fetch', (event) => {
//   // console.log('fetch');
//   event.respondWith(
//     cacheFirst({
//       request: event.request,
//       preloadResponsePromise: event.preloadResponse,
//       fallbackUrl: '/sw-test/gallery/myLittleVader.jpg'
//     })
//   )
// })
