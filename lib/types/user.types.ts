export interface User {
  id: string
  email: string
  name: string
  role_id: number
  role_name: string
  site_count: number
  is_active: number
  last_login?: Date
  created_at?: Date
  updated_at?: Date
}

export interface Site {
  id: string
  name: string
  domain: string
  owner_id: string
  language_id?: string
  created_at?: Date
}

export interface Language {
  id: string
  name: string
  code: string
}

export interface LoginResponse {
  result_message: {
    code: string
    message: string
    status: "success" | "error"
  }
  data?: Omit<User, "password">
  token?: string
  refreshToken?: string
}

export interface UserSession {
  id: string
  email: string
  name: string
  role_id: number
  role_name: string
  sites: Site[]
  selectedSiteId: string
  selectedSiteLanguage: Language
}
