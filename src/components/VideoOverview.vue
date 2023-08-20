<template>
  <div class="container mx-auto px-5 py-10">
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
import { useScroll } from '@vueuse/core'
import { useVideos } from '@/composables'
import { asyncComponent } from '@/utils'
import { onMounted, watch } from 'vue'

const VideoItem = asyncComponent('VideoItem')

const { arrivedState } = useScroll(document, { behavior: 'smooth' })
const { fetch, state } = useVideos()

onMounted(() => fetch())
watch(arrivedState, (state) => (state.bottom ? fetch() : null))
</script>
