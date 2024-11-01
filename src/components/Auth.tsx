import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon } from "lucide-react"

export default function Auth({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        onAuthenticate()
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-[#4ADE80] border-2 bg-black text-[#4ADE80]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon className="w-5 h-5" />
            Vault Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#4ADE80] bg-black text-[#4ADE80] placeholder:text-[#4ADE80]/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90"
            >
              Unlock Vault
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
