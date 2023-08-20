<template>
  <div
    :key="data.id"
    class="modal-box"
  >
    <button
      class="absolute right-2 top-2"
      @click="cancel()"
    >
      <close class="h-6 w-6" />
    </button>

    <h3 class="line-clamp-2 font-medium">
      {{ data.name }}
    </h3>

    <form
      class="grid gap-y-3"
      @submit.prevent="submit"
    >
      <div class="form-control">
        <label class="label">
          <span class="label-text">Name</span>
        </label>

        <div class="join">
          <input
            v-model.trim="form.name"
            type="text"
            placeholder="Name"
            class="input join-item w-full"
            @change="form.validate('name')"
          >

          <label
            class="btn join-item"
            @click.prevent="capitalize()"
          >
            <format class="h-6 w-6" />
          </label>
        </div>

        <label
          v-if="form.invalid('name')"
          class="label"
        >
          <span class="label-text-alt">
            {{ form.errors.name }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Tags</span>
        </label>

        <tag-input
          v-model.lazy="form.tags"
          @change="form.validate('tags')"
        />

        <label
          v-if="form.invalid('tags')"
          class="label"
        >
          <span class="label-text-alt">
            {{ form.errors.tags }}
          </span>
        </label>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Season</span>
          </label>

          <input
            v-model.trim="form.season"
            type="text"
            placeholder="Season"
            class="input w-full"
            @change="form.validate('season')"
          >

          <label
            v-if="form.invalid('season')"
            class="label"
          >
            <span class="label-text-alt">
              {{ form.errors.season }}
            </span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Episode</span>
          </label>

          <input
            v-model.trim="form.episode"
            type="text"
            placeholder="Episode"
            class="input"
            @change="form.validate('episode')"
          >

          <label
            v-if="form.invalid('episode')"
            class="label"
          >
            <span class="label-text-alt">
              {{ form.errors.episode }}
            </span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Released At</span>
          </label>

          <input
            v-model.lazy.trim="releasedAt"
            type="text"
            placeholder="YYYY-MM-DD"
            class="input"
            @change="form.validate('released_at')"
          >

          <label
            v-if="form.invalid('released_at')"
            class="label"
          >
            <span class="label-text-alt">
              {{ form.errors.released_at }}
            </span>
          </label>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Snapshot</span>
        </label>

        <div class="join">
          <input
            v-model.number.trim="form.snapshot"
            type="number"
            step="0.01"
            placeholder="Snapshot"
            class="input join-item w-full"
            @change="form.validate('snapshot')"
          >

          <label
            class="btn join-item"
            @click.prevent="snapshot()"
          >
            <camera class="h-6 w-6" />
          </label>
        </div>

        <label
          v-if="form.invalid('snapshot')"
          class="label"
        >
          <span class="label-text-alt">
            {{ form.errors.snapshot }}
          </span>
        </label>
      </div>

      <div class="modal-action">
        <button
          type="button"
          class="btn btn-secondary"
          onclick="video_delete.showModal()"
        >
          Delete
        </button>

        <button
          type="submit"
          class="btn btn-primary"
        >
          Save
        </button>
      </div>
    </form>
  </div>

  <video-delete :item="data" />
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { reactivePick } from '@vueuse/core'
import { useModal, usePlayer } from '@/composables'
import { asyncComponent, date, titleCase, useForm } from '@/utils'
import { Camera, Close, Format } from '@/assets'
import type { VideoModel } from '@/interfaces'

const props = defineProps<{
  data: VideoModel & { time: number }
}>()

const { data } = toRefs(props)

const TagInput = asyncComponent('TagInput')
const VideoDelete = asyncComponent('VideoDelete')

const { cancel } = useModal()
const { player } = usePlayer()

const form = useForm(
  'patch',
  `v1/videos/${data.value.id}`,
  reactivePick(data.value, 'id', 'name', 'season', 'episode', 'tags', 'snapshot', 'released_at')
)

const releasedAt = computed({
  get: () => date(form.released_at, 'YYYY-MM-DD'),
  set: (value) => (form.released_at = date(value, 'YYYY-MM-DD'))
})

const capitalize = () => (form.name = titleCase(form.name || ''))

const snapshot = () =>
  (form.snapshot = player.value?.getMediaElement()?.currentTime?.toFixed(2) || 0.0)

const submit = () => form.submit()
</script>
