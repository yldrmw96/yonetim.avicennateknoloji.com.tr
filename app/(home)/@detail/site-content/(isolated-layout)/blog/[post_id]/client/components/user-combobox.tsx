"use client"

import * as React from "react"
import { GenericCombobox, type ComboboxOption } from "./generic-combobox"
import { useSites } from "@/store/hooks/sites.hook"

interface User {
  id: number
  first_name: string
  family_name: string
  email?: string
}

interface UserComboboxProps {
  onUserSelect?: (user: User) => void
  selectedUserId?: number
  className?: string
}

export function UserCombobox({ onUserSelect, selectedUserId, className }: UserComboboxProps) {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { selectedSite } = useSites()

  React.useEffect(() => {
    if (!selectedSite?.id) return

    setLoading(true)
    setError(null)

    fetch(`/api/v1/users/get/by-site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteId: selectedSite.id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kullanıcılar yüklenemedi")
        }
        return response.json()
      })
      .then((data) => setUsers(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [selectedSite])

  // Users'ı ComboboxOption formatına dönüştür
  const userOptions: ComboboxOption<User>[] = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.family_name}`,
    data: user,
  }))

  const handleUserChange = (value: string | number, option: ComboboxOption<User>) => {
    if (onUserSelect) {
      onUserSelect(option.data)
    }
  }

  return (
    <GenericCombobox<User>
      options={userOptions}
      value={selectedUserId}
      onValueChange={handleUserChange}
      placeholder="Kullanıcı Seç..."
      searchPlaceholder="Kullanıcılarda Ara..."
      emptyMessage="Kullanıcı bulunamadı."
      loading={loading}
      error={error}
      className={className}
    />
  )
}
