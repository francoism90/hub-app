export interface ModalState {
  component: string
  data: any
}

export type ModalRevealResult<C> =
  | {
      obj?: C
      isCanceled: false
    }
  | {
      obj?: C
      isCanceled: true
    }
