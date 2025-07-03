// import type { Request } from "express"
// import type { User } from "./user.types"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

// export interface RequestWithUser extends Request {
//   user?: User
// }
