<template>
  <div
    :key="video.id"
    class="container mx-auto px-5 py-10"
  >
    <template v-if="state.error">
      <h1 class="text-slate-300">
        Unable to fetch records
      </h1>
    </template>

    <template v-if="state.links?.first && !state.data.length">
      <h1 class="text-slate-300">
        No matching records found
      </h1>
    </template>

    <div class="grid grid-cols-1 gap-9 md:grid-cols-2 xl:grid-cols-3">
      <video-item
        v-for="item in state.data"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useScroll, watchDebounced } from '@vueuse/core'
import { useSimilar, useVideo } from '@/composables'
import { asyncComponent } from '@/utils'

const VideoItem = asyncComponent('VideoItem')

const { state: video } = useVideo()
const { fetch, reset, state } = useSimilar()
const { arrivedState } = useScroll(document, { behavior: 'smooth' })

watch(arrivedState, (state) => (state.bottom ? fetch() : null))

watchDebounced(video, () => reset(video, true), {
  immediate: true,
  deep: true,
  debounce: 100,
  maxWait: 10000
})
</script>
