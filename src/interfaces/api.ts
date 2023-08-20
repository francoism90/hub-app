export interface Model {}

export interface Links {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface Query {
  filter?: Record<string, any>
  sort?: string
  page?: {
    number?: number
    size?: number
  }
}

export interface Models {
  data: Model[]
  links: Links
}

export interface ModelsState {
  data: Model[] | undefined
  links: Links | undefined
  query?: Query | undefined
  error?: Error | boolean | undefined
  selected?: Model[] | undefined
}
