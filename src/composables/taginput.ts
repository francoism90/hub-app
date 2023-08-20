import { reactive, readonly } from 'vue'
import { api } from '@/utils'
import type { Models, ModelsState, Query, TagModel } from '@/interfaces'

type State = Omit<ModelsState, 'data' | 'selected'> & {
  data: TagModel[]
  selected: TagModel[]
}
type Response = Omit<Models, 'data'> & { data: TagModel[] }

const initialState = () =>
  <State>{
    data: new Array(),
    selected: new Array(),
    links: undefined,
    query: undefined
  }

export function useTagInput() {
  const state = reactive({ ...initialState() })

  const initialize = (selected: TagModel[] | null | undefined) => {
    state.selected = selected || []
  }

  const fetch = async (params?: Query) =>
    api
      .get<Response>('v1/tags', { params })
      .then((response) => set(response.data))
      .catch()

  const set = (obj: Response) => {
    state.data = obj.data || []
    state.links = obj.links
  }

  const toggle = (obj: TagModel) => {
    state.selected = state.selected.find((item) => item.id === obj.id)
      ? state.selected.filter((item) => item.id !== obj.id)
      : state.selected.concat(obj)
  }

  return {
    initialize,
    fetch,
    toggle,
    state: readonly(state)
  }
}
