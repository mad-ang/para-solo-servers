export interface IChat {
  senderId: string
  receiverId: string
  content?: string
  createdAt: Date | null
}
