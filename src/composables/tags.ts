import { reactive, readonly } from 'vue'
import { useStorage } from '@vueuse/core'
import { api } from '@/utils'
import type { Models, ModelsState, Query, TagModel } from '@/interfaces'

type State = Omit<ModelsState, 'data'> & { data: TagModel[] }
type Response = Omit<Models, 'data'> & { data: TagModel[] }

const initialState = () =>
  <State>{
    data: new Array(),
    links: undefined,
    query: useStorage('tags', <Query>{})
  }

const state = reactive({ ...initialState() })

export function useTags() {
  const fetch = async (query?: Query) => {
    if (state.error) {
      return Promise
    }

    if (!state.links?.first?.length) {
      return initialize(query)
    }

    if (state.links?.next?.length) {
      return next()
    }
  }

  const initialize = async (query?: Query) => {
    if (query) state.query = { ...state.query, ...query }

    return api
      .get<Response>('v1/tags', { params: state.query })
      .then((response) => fill(response.data))
      .catch((error) => (state.error = error || true))
  }

  const next = async () =>
    api
      .get<Response>(state.links?.next || '')
      .then((response) => fill(response.data))
      .catch((error) => (state.error = error || true))

  const fill = (obj: Response) => {
    state.data = state.data.concat(obj.data)
    state.links = obj.links
  }

  const reset = async (query?: Query, reload?: boolean) => {
    Object.assign(state, { ...initialState(), ...{ query } })

    if (reload) fetch()
  }

  const sync = (obj: TagModel) => {
    const index = state.data?.findIndex((o) => o.id == obj.id)

    if (state.data.length && index && index > -1) {
      state.data[index] = obj
    }
  }

  const slice = (obj: TagModel) => (state.data = state.data.filter((o) => o.id != obj.id))

  return {
    fetch,
    reset,
    sync,
    slice,
    state: readonly(state)
  }
}
