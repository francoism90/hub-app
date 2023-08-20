<template>
  <div
    ref="container"
    class="relative h-64 max-h-64 bg-black lg:h-[32rem] lg:max-h-[32rem]"
  >
    <video
      ref="element"
      class="relative h-full w-full"
      crossorigin="use-credentials"
      autoplay
      playsinline
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePlayer, useVideo } from '@/composables'

const container = ref<HTMLElement | null>(null)
const element = ref<HTMLMediaElement | null>(null)

const { state } = useVideo()
const { initialize } = usePlayer()

onMounted(() => initialize(container.value, element.value, state.stream))
onBeforeUnmount(() => element.value?.pause())
</script>
