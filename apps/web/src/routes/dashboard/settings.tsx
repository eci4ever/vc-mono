import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authApi, sessionQuery } from '@/lib/auth'

function SettingsProfile() {
  const { data: user } = useQuery(sessionQuery)
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(false)

  const updateName = useMutation({
    mutationFn: (name: string) => authApi.updateName(name),
    onSuccess: (updated) => {
      queryClient.setQueryData(sessionQuery.queryKey, updated)
      setSaved(true)
    },
  })

  if (!user) return null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    const form = new FormData(e.currentTarget)
    updateName.mutate(String(form.get('name') ?? '').trim())
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your name is shown in the sidebar and across the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="profile-form"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {updateName.isError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't save your profile</AlertTitle>
                <AlertDescription>
                  {updateName.error instanceof Error
                    ? updateName.error.message
                    : 'Something went wrong.'}
                </AlertDescription>
              </Alert>
            )}
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Name
              <Input
                name="name"
                required
                maxLength={100}
                defaultValue={user.name}
                className="h-10 rounded-xl px-3"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Email
              <Input
                type="email"
                value={user.email}
                disabled
                className="h-10 rounded-xl px-3"
              />
            </label>
          </form>
        </CardContent>
        <CardFooter className="flex items-center gap-3">
          <Button
            type="submit"
            form="profile-form"
            disabled={updateName.isPending}
          >
            {updateName.isPending ? 'Saving…' : 'Save changes'}
          </Button>
          {saved && !updateName.isPending && (
            <span className="text-sm text-success" role="status">
              Saved.
            </span>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsProfile,
})
