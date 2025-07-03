"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSites } from "@/store/hooks/sites.hook"

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const { selectedSite } = useSites()
  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/v1/users/get/by-site`, {
      method: "POST",
      body: JSON.stringify({ siteId: selectedSite?.id }),
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }, [selectedSite])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between border-none shadow-none !text-sm"
        >
          {selectedUser
            ? selectedUser.first_name + " " + selectedUser.family_name
            : "Kullanıcı Seç..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Kullanıcılarda Ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>Kullanıcı bulunamadı.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id.toString()}
                  onSelect={(e) => {
                    console.log(e)
                    setSelectedUser(users.find((user: any) => user.id == e))
                    setOpen(false)
                  }}
                >
                  {user.first_name} {user.family_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedUser?.id == user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
