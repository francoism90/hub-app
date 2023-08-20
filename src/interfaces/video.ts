import type { Model, TagModel } from '@/interfaces'

export interface VideoModel extends Model {
  id: string
  slug?: string
  name?: string
  season?: string
  episode?: string
  captions?: boolean
  duration?: number
  content?: string
  snapshot?: number | string
  summary?: string
  views?: number
  favorite?: boolean
  following?: boolean
  viewed?: boolean
  tags?: readonly TagModel[]
  preview?: string
  stream?: string
  placeholder?: string
  thumbnail?: string
  released_at?: string | null
  created_at?: string
  updated_at?: string
}

export type VideoState = VideoModel
