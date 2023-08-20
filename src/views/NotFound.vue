<template>
  <div class="card m-5 w-96 rounded-sm bg-white">
    <div class="card-body">
      <h2 class="card-title">
        Not Found
      </h2>

      <p class="py-2">
        Whoops, looks like this page doesn't exist.
      </p>

      <router-link
        to="/"
        class="btn btn-primary"
      >
        Back Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@vueuse/head'

useSeoMeta({
  title: 'Not Found',
  robots: 'noindex, nofollow'
})
</script>
