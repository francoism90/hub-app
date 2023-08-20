<template>
  <dialog
    id="video_delete"
    :key="item.id"
    ref="modal"
    class="modal"
  >
    <div class="modal-box w-96">
      <h3 class="text-lg font-bold">
        {{ item.name }}
      </h3>

      <p>Are you sure you want to remove this video?</p>

      <div class="modal-action">
        <button
          class="btn btn-neutral"
          @click="modal?.close()"
        >
          Cancel
        </button>
        <button
          class="btn btn-secondary"
          @click="submit"
        >
          Confirm
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVideo } from '@/composables'
import type { VideoModel } from '@/interfaces'

const props = defineProps<{
  item: VideoModel
}>()

const modal = ref<HTMLDialogElement>()

const { destroy } = useVideo()

const submit = () => destroy(props.item)
</script>
