<template>
  <teleport to="body">
    <dialog
      ref="dialog"
      class="modal"
    >
      <template v-if="isRevealed && state.component">
        <component
          :is="component"
          :data="state.data"
        />
      </template>
    </dialog>
  </teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '@/composables/modal'
import { asyncComponent } from '@/utils'
import type { ModalState } from '@/interfaces'

const state = reactive<ModalState>({ component: '', data: undefined })
const dialog = ref<HTMLDialogElement>()

const route = useRoute()
const { isRevealed, cancel, onReveal, onCancel } = useModal()

const component = computed(() => asyncComponent(state.component))

onReveal((obj) => {
  Object.assign(state, obj)
  dialog.value?.showModal()
})

onCancel(() => {
  dialog.value?.close()
  Object.assign(state, undefined)
})

watch(
  () => route,
  () => cancel(),
  { deep: true, immediate: true }
)
</script>
