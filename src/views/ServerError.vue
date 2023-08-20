<template>
  <div class="card m-5 w-96 rounded-sm bg-white">
    <div class="card-body">
      <h2 class="card-title">
        Oops!
      </h2>

      <p class="py-2">
        Looks like something went wrong.
      </p>

      <button
        class="btn btn-primary"
        @click="to"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@vueuse/head'
import { useRouter } from 'vue-router'

const router = useRouter()
const to = () => (router.getRoutes().length ? router.go(-1) : router.push('/'))

useSeoMeta({
  title: 'Server Error',
  robots: 'noindex, nofollow'
})
</script>
