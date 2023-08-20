<template>
  <div>
    <!-- no content here -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoMeta } from '@vueuse/head'
import { api } from '@/utils'

const { replace } = useRouter()

const logout = async () =>
  api
    .post('v1/logout')
    .catch(() => replace({ name: 'login' }))
    .then(() => replace({ name: 'login' }))

useSeoMeta({
  title: '',
  robots: 'noindex, nofollow',
  ogTitle: 'Log Out'
})

onBeforeMount(() => logout())
</script>
