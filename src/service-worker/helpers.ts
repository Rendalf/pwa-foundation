const SW: ServiceWorkerGlobalScope = self as any

export function isSucceedResponse (response: Response): boolean {
  return response.status >= 200 && response.status < 300
}

export function isClientFocused (): Promise<boolean> {
  return SW.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })
  .then((windowClients) => windowClients.some((windowClient) => (windowClient as any).focused))
}
