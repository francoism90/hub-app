import type { Model } from '@/interfaces'

export interface UserModel extends Model {
  id: string
  avatar?: string
  email?: string
  permissions?: string[]
  roles?: string[]
  settings?: UserPreferences
}

export interface UserPreferences {
  autoplay: boolean
  muteVideos: boolean
}
