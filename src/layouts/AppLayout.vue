<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component" />

        <template #fallback>
          <loading-component class="h-screen" />
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { polyfill } from 'shaka-player'
import { useEcho } from '@/composables'
import { asyncComponent } from '@/utils'

const LoadingComponent = asyncComponent('LoadingComponent')

const { initialize: echo, reset } = useEcho()

const register = () => {
  // Polyfills
  polyfill.installAll()

  // Services
  echo()
}

onBeforeMount(() => register())
onBeforeUnmount(() => reset())
</script>
