import { isSucceedResponse } from 'service-worker/helpers'

export function cacheFirstStrategy (event: FetchEvent, cache: Cache): Promise<Response> {
  return cache.match(event.request)
    .then((cacheResponse) => {
      // cached - return
      if (cacheResponse) {
        return cacheResponse
      }

      // not in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (isSucceedResponse(networkResponse)) {
            // do I need it?
            cache.put(event.request, networkResponse.clone())
          }

          return networkResponse
        })
    })
}
