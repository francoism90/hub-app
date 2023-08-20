import { defineAsyncComponent } from 'vue'

export const asyncComponent = (name: string) =>
  defineAsyncComponent({
    loader: () => import(`@/components/${name}.vue`),
    loadingComponent: import('@/components/LoadingComponent.vue'),
    errorComponent: import('@/components/ErrorComponent.vue')
  })
