<template>
  <app-navigation />
  <video-overview />
</template>

<script setup lang="ts">
import { useSeoMeta } from '@vueuse/head'
import { asyncComponent } from '@/utils'

const AppNavigation = asyncComponent('AppNavigation')
const VideoOverview = asyncComponent('VideoOverview')

useSeoMeta({
  title: '',
  description: 'Library',
  ogTitle: 'Library',
  ogDescription: 'Library'
})
</script>
