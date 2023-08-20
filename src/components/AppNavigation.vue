<template>
  <header class="sticky top-0 z-[1]">
    <nav class="navbar">
      <router-link
        class="navbar-logo"
        to="/"
      >
        Hub
      </router-link>

      <form
        class="join h-full w-full px-4"
        @submit.prevent="reset(state.query, true)"
      >
        <button
          for="search-input"
          class="join-item"
          aria-label="Search"
          type="submit"
        >
          <search class="h-6 w-6 fill-white" />
        </button>

        <input
          id="search-input"
          v-model.lazy.trim="query"
          type="search"
          placeholder="Search"
          class="join-item w-full flex-1 bg-transparent px-3 text-white placeholder:text-gray-300 focus:outline-none focus:placeholder:text-gray-100"
          @click="toggle()"
        >

        <button
          v-if="active"
          class="join-item"
          @click.prevent="reset(undefined, true)"
        >
          <clear class="h-6 w-6 fill-white" />
        </button>
      </form>

      <div class="join items-center space-x-3">
        <router-link
          :to="{ hash: '#' }"
          data-tip="Notifications"
          aria-label="Notifications"
          class="join-item tooltip tooltip-bottom"
          active-class="!text-white"
        >
          <notifications class="h-6 w-6 fill-white" />
        </router-link>

        <router-link
          :to="{ name: 'logout' }"
          data-tip="Account"
          aria-label="Account"
          class="join-item tooltip tooltip-bottom"
          active-class="!text-white"
        >
          <account class="h-6 w-6 fill-white" />
        </router-link>
      </div>
    </nav>

    <Transition name="fade">
      <app-filters v-if="visible" />
    </Transition>
  </header>

  <app-modal />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToggle } from '@vueuse/core'
import { useVideos } from '@/composables'
import { asyncComponent, stringify } from '@/utils'
import { Account, Clear, Notifications, Search } from '@/assets'

const AppFilters = asyncComponent('AppFilters')
const AppModal = asyncComponent('AppModal')

const [visible, toggle] = useToggle()
const { push } = useRouter()
const { reset, state } = useVideos()

const query = computed({
  get: () => state.query?.filter?.query || '',
  set: (value) => reset({ ...state.query, ...{ filter: { query: value } } })
})

const active = computed(() => Object.keys(stringify(state.query)).length)

const submit = async () => {
  await push({ name: 'home' })
  setTimeout(() => (visible.value = false), 200)
}

watch(visible, (value) => (document.body.style.overflow = value ? 'hidden' : 'unset'))
watch(() => state.query, submit, { deep: true })
</script>
