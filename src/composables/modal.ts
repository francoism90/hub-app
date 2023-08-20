import { computed, ref } from 'vue'
import { createEventHook, noop, type EventHook } from '@vueuse/shared'
import type { ModalRevealResult, ModalState } from '@/interfaces'

const revealed = ref<boolean>(false)
const cancelHook: EventHook = createEventHook<ModalState>()
const revealHook: EventHook = createEventHook<ModalState>()

export function useModal() {
  let _resolve: (arg0: ModalRevealResult<ModalState>) => void = noop

  const reveal = async (obj?: ModalState) => {
    revealHook.trigger(obj)
    revealed.value = true

    return new Promise<ModalRevealResult<ModalState>>((resolve) => {
      _resolve = resolve
    })
  }

  const cancel = (obj?: ModalState) => {
    revealed.value = false
    cancelHook.trigger(obj)

    _resolve({ obj, isCanceled: true })
  }

  return {
    isRevealed: computed(() => revealed.value),
    reveal,
    cancel,
    onReveal: revealHook.on,
    onCancel: cancelHook.on
  }
}
