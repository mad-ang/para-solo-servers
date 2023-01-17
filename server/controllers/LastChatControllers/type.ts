import { Schema } from "mongoose"
export type Token = string

export interface ILastChat {
  myInfo: UserResponseDto
  friendInfo: UserResponseDto
  message: string
  status: IChatRoomStatus
  roomId?: string
  unreadCount?: number
  updatedAt: Date | null
}

export interface UserResponseDto {
  userId: string
  username: string
  profileImgUrl: string
}

export enum IChatRoomStatus {
  FRIEND_REQUEST,
  SOCKET_ON,
  SOCKET_OFF,
  REJECTED
}
