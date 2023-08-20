<template>
  <div
    ref="container"
    class="h-[20rem] min-h-[20rem] cursor-pointer"
  >
    <router-link :to="{ name: 'video', params: { id: item.id, slug: item.slug } }">
      <div
        v-if="visible"
        class="card select-none rounded-none"
      >
        <figure
          v-element-hover="onHover"
          class="block h-52 w-full"
          @touchstart.passive="onHover(true)"
          @touchend.passive="onHover(false)"
          @touchcancel.passive="onHover(false)"
        >
          <UseImage
            :alt="item.name"
            :src="item.thumbnail || ''"
            :srcset="item.placeholder || ''"
            sizes="(min-width: 1200px) 50vw, 100vw"
            class="relative h-52 w-full rounded-xl text-transparent"
            crossorigin="use-credentials"
          >
            <template #loading>
              <div class="relative h-full w-full animate-pulse rounded-xl bg-gray-600/20" />
            </template>

            <template #error>
              <div class="relative h-full w-full animate-pulse rounded-xl bg-gray-600/20" />
            </template>
          </UseImage>

          <video
            v-show="preview"
            ref="element"
            class="absolute inset-0 h-52 w-full rounded-xl object-fill"
            muted
            loop
          />
        </figure>

        <div class="card-body gap-0.5 p-3">
          <h2 class="card-title line-clamp-2 text-sm capitalize text-white">
            {{ item.name }}
          </h2>

          <ul class="separator bullet h-5 text-xs font-normal text-gray-300">
            <li>
              {{ duration }}
            </li>

            <li v-if="item.season || item.episode">
              {{ item.season }}{{ item.episode }}
            </li>

            <li>
              {{ created }}
            </li>

            <li v-if="item.captions">
              <captions class="h-4 w-4 fill-white" />
            </li>
          </ul>

          <ul
            v-if="item.tags?.length"
            class="separator line-clamp-2 break-words text-xs font-medium text-gray-300"
          >
            <li
              v-for="tag in item.tags"
              :key="tag.id"
            >
              {{ tag.name }}
            </li>
          </ul>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { vElementHover, UseImage } from '@vueuse/components'
import { useShaka } from '@/composables'
import { date, time } from '@/utils'
import { Captions } from '@/assets'
import type { VideoModel } from '@/interfaces'

const props = defineProps<{
  item: VideoModel
}>()

const container = ref<HTMLElement | null>(null)
const element = ref<HTMLMediaElement | null>(null)
const preview = ref<boolean>(false)

const { initialize } = useShaka()
const visible = useElementVisibility(container)

const created = computed(() => date(props.item.released_at || props.item.created_at))
const duration = computed(() => time(props.item.duration || 0))

const onHover = async (state: boolean) => {
  await initialize(container.value, element.value, props.item.preview)

  try {
    state === true && element.value?.paused
      ? await element.value?.play()
      : await element.value?.pause()
  } catch {
    //
  }

  preview.value = state
}

onBeforeUnmount(() => element.value?.pause())
</script>
