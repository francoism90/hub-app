<template>
  <div class="card m-5 w-96 rounded-sm bg-white">
    <div class="card-body">
      <h2 class="card-title">
        Login
      </h2>

      <form @submit.prevent="submit">
        <div class="form-control mb-3 w-full">
          <label class="label">
            <span class="label-text">Email</span>
          </label>

          <input
            v-model.trim="form.email"
            type="email"
            placeholder="Email"
            class="input input-bordered input-md w-full"
            autocomplete="email"
            @change="form.validate('email')"
          >

          <label
            v-if="form.invalid('email')"
            class="label"
          >
            <span class="label-text-alt">
              {{ form.errors.email }}
            </span>
          </label>
        </div>

        <div class="form-control mb-3 w-full">
          <label class="label">
            <span class="label-text">Password</span>
          </label>

          <input
            v-model.trim="form.password"
            type="password"
            placeholder="Password"
            class="input input-bordered input-md w-full"
            autocomplete="current-password"
            @change="form.validate('password')"
          >

          <label
            v-if="form.invalid('password')"
            class="label"
          >
            <span class="label-text-alt">
              {{ form.errors.password }}
            </span>
          </label>
        </div>

        <div class="card-actions justify-end pt-3">
          <button class="btn">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoMeta } from '@vueuse/head'
import { api, useForm } from '@/utils'

const { replace } = useRouter()

const form = useForm('post', 'v1/login', {
  email: '',
  password: '',
  device_name: navigator.userAgent
})

const submit = () =>
  form
    .submit()
    .then(() => replace({ path: '/' }))
    .catch(() => null)

useSeoMeta({
  title: 'Log In',
  ogTitle: 'Log In',
  description: 'My Account'
})

onMounted(() => api.get('v1/csrf-cookie'))
</script>
