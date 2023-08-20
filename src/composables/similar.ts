import { reactive, readonly } from 'vue'
import { api } from '@/utils'
import type { Models, ModelsState, VideoModel } from '@/interfaces'

type State = Omit<ModelsState, 'data'> & { data: VideoModel[] }
type Response = Omit<Models, 'data'> & { data: VideoModel[] }

const initialState = () =>
  <State>{
    data: new Array(),
    links: undefined
  }

export function useSimilar() {
  const state = reactive({ ...initialState() })

  const fetch = async (model?: VideoModel) => {
    if (state.error) {
      return Promise
    }

    if (model && !state.links?.first?.length) {
      return initialize(model)
    }

    if (state.links?.next?.length) {
      return next()
    }
  }

  const initialize = async (model: VideoModel) =>
    api
      .get<Response>(`v1/videos/${model.id}/similar`)
      .then((response) => fill(response.data))
      .catch((error) => (state.error = error || true))

  const next = async () =>
    api
      .get<Response>(state.links?.next || '')
      .then((response) => fill(response.data))
      .catch((error) => (state.error = error || true))

  const fill = (obj: Response) => {
    state.data = state.data.concat(obj.data)
    state.links = obj.links
  }

  const reset = async (model?: VideoModel, reload?: boolean) => {
    Object.assign(state, initialState())

    if (model && reload) fetch(model)
  }

  return {
    fetch,
    reset,
    state: readonly(state)
  }
}
