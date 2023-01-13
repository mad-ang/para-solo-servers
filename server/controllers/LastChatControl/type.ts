export type Token = string

export interface ILastChat {
  readerId: string
  targetId: string
  username: string
  lastMessage?: string
  unreadCount?: number
  updatedAt: Date | null
}
