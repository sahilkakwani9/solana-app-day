'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, UnlockIcon, WalletIcon, SendIcon } from "lucide-react"
import useVaultBalance from '@/hooks/useVaultBalance'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const { vaultBalance, isLoading } = useVaultBalance()
  const [pubKey, setPubKey] = useState('')
  const [amount, setAmount] = useState('')
  const router = useRouter()

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
        setIsAuthenticated(true)
      } else {
        alert('Invalid password')
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Distributing ${amount} SOL to ${pubKey}`)
  }

  if (!isAuthenticated) {
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

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[#4ADE80] text-2xl font-bold">Vault Dashboard</h1>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-[#4ADE80] text-[#4ADE80] hover:bg-[#4ADE80] hover:text-black"
          >
            <UnlockIcon className="w-4 h-4 mr-2" />
            Lock Vault
          </Button>
        </div>
        <Card className="border-[#4ADE80] bg-black text-[#4ADE80]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5" />
              Current Balance :
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{vaultBalance ?? 0} ETH</p>
          </CardContent>
        </Card>

        <Card className="border-[#4ADE80] bg-black text-[#4ADE80]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SendIcon className="w-5 h-5" />
              Distribute Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDistribute} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Recipient Public Key"
                  value={pubKey}
                  onChange={(e) => setPubKey(e.target.value)}
                  className="border-[#4ADE80] bg-black text-[#4ADE80] placeholder:text-[#4ADE80]/50"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="Amount (SOL)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-[#4ADE80] bg-black text-[#4ADE80] placeholder:text-[#4ADE80]/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90"
              >
                Send Funds
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
