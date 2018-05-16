declare module 'serviceworker-webpack-plugin/lib/runtime' {
  export type ServiceWorkerRuntime = {
    register: () => Promise<ServiceWorkerRegistration>
  }

  const runtime: ServiceWorkerRuntime
  export default runtime
}
