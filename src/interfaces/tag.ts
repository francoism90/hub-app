import type { Model } from '@/interfaces'

export interface TagModel extends Model {
  id: string
  name: string
  type: string
  created_at: string
  updated_at: string
}

export type TagState = TagModel
