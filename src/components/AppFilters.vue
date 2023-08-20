<template>
  <div
    ref="container"
    class="navbar-overlay"
  >
    <h1 class="text-xs font-medium uppercase text-base-300">
      Type
    </h1>

    <div class="py-4 flex flex-row flex-wrap gap-3">
      <label
        v-for="(item, index) in lists"
        :key="index"
        tabindex="0"
        class="btn btn-ghost btn-sm border-white/5 font-normal capitalize text-white"
        :class="{ 'bg-primary/25 !font-medium': item.value === list }"
      >
        <input
          :id="`list-${index}`"
          v-model="list"
          type="radio"
          :value="item.value"
          class="hidden"
        >

        {{ item.label }}
      </label>
    </div>

    <div class="h-4" />

    <h1 class="text-xs font-medium uppercase text-base-300">
      Sort
    </h1>

    <div class="py-4 flex flex-row flex-wrap gap-3">
      <label
        v-for="(item, index) in sorts"
        :key="index"
        tabindex="0"
        class="btn btn-ghost btn-sm border-white/5 font-normal capitalize text-white"
        :class="{ 'bg-primary/25 !font-medium': item.value === sort }"
      >
        <input
          :id="`sort-${index}`"
          v-model="sort"
          type="radio"
          :value="item.value"
          class="hidden"
        >

        {{ item.label }}
      </label>
    </div>

    <div class="h-4" />

    <h1 class="text-xs font-medium uppercase text-base-300">
      Tags
    </h1>

    <div class="py-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <label
        v-for="(item, index) in tags.data"
        :key="index"
        tabindex="0"
        class="card card-compact border border-white/5 bg-base-300/10 text-sm capitalize text-white"
        :class="{ 'bg-primary/25 !font-medium': tag.includes(item.id) }"
      >
        <div class="card-body cursor-pointer">
          <input
            :id="`tag-${index}`"
            v-model="tag"
            :value="item.id"
            type="checkbox"
            class="hidden"
          >

          <div class="join items-center gap-x-2.5">
            <component
              :is="icon(item.type)?.icon || Tag"
              class="join-item h-5 w-5 fill-white"
            />

            <div class="join-item">{{ item.name }}</div>
          </div>
        </div>
      </label>
    </div>

    <loading-component v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useTags, useVideos } from '@/composables'
import { asyncComponent } from '@/utils'
import type { Query } from '@/interfaces'
import { Language, Movie, Person, Tag } from '@/assets'

const container = ref<HTMLElement | null>(null)

const LoadingComponent = asyncComponent('LoadingComponent')

const { fetch, state: tags } = useTags()
const { reset, state: videos } = useVideos()
const { isLoading } = useInfiniteScroll(container, () =>
  fetch({ sort: 'name', page: { size: 24 } })
)

const icons = [
  { label: 'Studio', value: 'studio', icon: Movie },
  { label: 'Genre', value: 'genre', icon: Tag },
  { label: 'Language', value: 'language', icon: Language },
  { label: 'Person', value: 'person', icon: Person }
]

const sorts = [
  { label: 'Most Relevant', value: '' },
  { label: 'Recently Added', value: '-created_at' },
  { label: 'Alphabetical', value: 'name' },
  { label: 'Longest', value: '-duration' },
  { label: 'Shortest', value: 'duration' }
]

const lists = [
  { label: 'Suggestions', value: '' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Watchlist', value: 'watchlist' },
  { label: 'History', value: 'history' }
]

const list = computed({
  get: () => videos.query?.filter?.list || '',
  set: (value) => submit({ filter: { list: value } })
})

const sort = computed({
  get: () => videos.query?.sort || '',
  set: (value) => submit({ sort: value })
})

const tag = computed({
  get: () => videos.query?.filter?.tag || [],
  set: (value) => submit({ filter: { tag: value } })
})

const icon = (value: string) => icons.find((o) => o.value === value)

const submit = async (query: Query) => reset({ ...videos.query, ...query }, true)
</script>
