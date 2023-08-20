import { reactive, readonly } from 'vue'
import { api } from '@/utils'
import type { SessionState, UserModel } from '@/interfaces'

const initialState = () => <SessionState>undefined

const state = reactive({ ...initialState() })

export function useSession() {
  const initialize = async () =>
    api
      .get<UserModel>('v1/user')
      .then((response) => set(response.data))
      .catch(() => reset())

  const set = (obj: UserModel) => Object.assign(state, obj)

  const reset = () => Object.assign(state, initialState())

  return {
    initialize,
    set,
    reset,
    state: readonly(state)
  }
}
