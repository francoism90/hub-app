<template>
  <app-navigation />

  <div
    v-if="state?.id?.length"
    :key="state.id"
  >
    <video-player />
    <video-details />
    <video-similar />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { useVideo } from '@/composables/video'
import { asyncComponent } from '@/utils'
import type { VideoModel } from '@/interfaces'

const props = defineProps<{
  id: string
  slug?: string
}>()

const AppNavigation = asyncComponent('AppNavigation')
const VideoDetails = asyncComponent('VideoDetails')
const VideoPlayer = asyncComponent('VideoPlayer')
const VideoSimilar = asyncComponent('VideoSimilar')

const { initialize, unsubscribe, state } = useVideo()

onMounted(() => initialize(props as VideoModel))
onBeforeRouteUpdate((to) => initialize({ id: to.params.id } as VideoModel))
onBeforeRouteLeave(() => unsubscribe())
</script>
