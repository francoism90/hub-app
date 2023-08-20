import { reactive, readonly } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoMeta } from '@vueuse/head'
import { useEcho, useVideos } from '@/composables'
import { api } from '@/utils'
import type { VideoModel } from '@/interfaces'

const state = reactive(<VideoModel>{})

export function useVideo() {
  const { echo } = useEcho()
  const { replace } = useRouter()
  const { sync, slice } = useVideos()

  const initialize = async (obj: VideoModel) => {
    await api
      .get<VideoModel>(`v1/videos/${obj.id}`)
      .then((response) => set(response.data))
      .catch((error) =>
        error.response && error.response?.status === 404
          ? destroy(obj)
          : replace(`/${error.response?.status || 500}`)
      )

    useSeoMeta({
      title: state?.name || '500',
      description: state?.summary || '',
      ogTitle: state?.name || '500',
      ogDescription: state?.summary || '',
      ogType: 'video.episode'
    })
  }

  const set = async (obj: VideoModel) => {
    // Prevent overlapping sockets
    await unsubscribe()

    // Reset on id change
    if (state && state.id !== obj.id) {
      reset()
    }

    // Fill state
    Object.assign(state, obj)

    // Sync state
    sync(obj)

    // Init WebSockets
    await subscribe()
  }

  const destroy = async (obj: VideoModel) => {
    await api
      .delete(`v1/videos/${obj.id}`)
      .then(() => slice(obj))
      .catch(() => slice(obj))

    await reset()
    await replace('/404')
  }

  const favorite = async (obj: VideoModel) =>
    api.post(`v1/videos/${obj.id}/favorite`, obj).then(() => initialize(obj))

  const follow = async (obj: VideoModel) =>
    api.post(`v1/videos/${obj.id}/follow`, obj).then(() => initialize(obj))

  const subscribe = async () =>
    echo.value
      ?.private(`video.${state.id}`)
      ?.listen('.video.deleted', () => initialize(state))
      ?.listen('.video.saved', () => initialize(state))

  const unsubscribe = () => echo.value?.leave(`video.${state?.id}`)

  const reset = async () => {
    // Leave channel
    await unsubscribe()

    // Reset state
    Object.assign(state, undefined)
  }

  return {
    initialize,
    reset,
    destroy,
    unsubscribe,
    favorite,
    follow,
    state: readonly(state)
  }
}
