<template>
  <component :is="layout" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'

const { currentRoute } = useRouter()

const layout = computed(() => currentRoute.value.meta?.layout)

useHead({
  titleTemplate: (title) => (title ? `${title} | Hub` : 'Hub'),
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [
    {
      rel: 'preconnect',
      crossorigin: 'use-credentials',
      fetchpriority: 'high',
      href: import.meta.env.VITE_API_URL
    },
    {
      rel: 'preconnect',
      crossorigin: 'use-credentials',
      fetchpriority: 'high',
      href: import.meta.env.VITE_WS_HOST
    }
  ]
})
</script>

<style>
@import '@/assets/css/base.css';
@import '@/assets/css/styles.css';
</style>
