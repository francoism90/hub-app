<template>
  <section class="bg-black/25">
    <div class="container mx-auto p-5 overflow-hidden">
      <div class="flex flex-row flex-wrap justify-between gap-1 md:gap-x-3">
        <div class="text-base-300">
          <h1 class="line-clamp-2 font-medium capitalize">
            {{ state.name }}
          </h1>

          <ul class="separator bullet h-6 text-sm">
            <li>
              {{ created }}
            </li>

            <li v-if="state.season || state.episode">
              {{ state.season }}{{ state.episode }}
            </li>

            <li>{{ views }} views</li>
          </ul>
        </div>

        <div class="inline-flex gap-x-3">
          <a
            class="tooltip tooltip-bottom cursor-pointer"
            data-tip="Edit Model"
            @click="edit"
          >
            <edit-note class="h-6 w-6 fill-white" />
          </a>

          <a
            class="tooltip tooltip-bottom cursor-pointer"
            data-tip="Favorite"
            @click="toggleFavorite"
          >
            <component
              :is="favorited"
              class="h-6 w-6 fill-white"
            />
          </a>

          <a
            class="tooltip tooltip-bottom cursor-pointer"
            data-tip="Watch Later"
            @click="toggleFollow"
          >
            <component
              :is="following"
              class="h-6 w-6 fill-white"
            />
          </a>
        </div>
      </div>

      <div
        v-if="state.tags?.length"
        class="flex flex-wrap items-center gap-2 pt-3"
      >
        <a
          v-for="tag in state.tags"
          :key="tag.id"
          class="badge badge-neutral cursor-pointer rounded-md p-2.5"
          @click="query(tag.id)"
        >
          {{ tag.name }}
        </a>
      </div>

      <p
        v-if="state.content?.length"
        class="prose pt-3 text-neutral"
      >
        {{ state.content }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModal, useVideo, useVideos } from '@/composables'
import { average, date } from '@/utils'
import { Favorite, FavoriteFill, BookmarkFill, Bookmark, EditNote } from '@/assets'

const { favorite, follow, state } = useVideo()
const { reset } = useVideos()
const { reveal } = useModal()
const { push } = useRouter()

const favorited = computed(() => (state.favorite ? FavoriteFill : Favorite))
const following = computed(() => (state.following ? BookmarkFill : Bookmark))
const created = computed(() => date(state.released_at || state.created_at))
const views = computed(() => average(state.views || 0))

const edit = () => reveal({ component: 'VideoEdit', data: state })
const toggleFavorite = () => favorite(state)
const toggleFollow = () => follow(state)

const query = async (tag: string) => {
  await reset({ filter: { tag } })
  await push({ name: 'home' })
}
</script>
