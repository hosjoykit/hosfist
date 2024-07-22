const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const keys = await caches.keys()
    try {
      const registration = await navigator.serviceWorker.register(
        '/sw.js',
        {
          scope: '/'
        }
      )
      if (registration.installing) {
        console.log('Service worker installing')
      } else if (registration.waiting) {
        console.log('Service worker installed')
      } else if (registration.active) {
        console.log('Service worker active')
      }
      // eslint-disable-next-line no-unused-vars
      registration.addEventListener('updatefound', async (_e) => {
        if (keys.length !== 0) {
          Promise.all(keys.map(key => caches.delete(key))).then(() => {
            location.replace('/')
          })
        }
      })
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}
registerServiceWorker()
