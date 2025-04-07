import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cheez Vault</h1>
          <p className="mt-2 text-slate-600">Share sensitive information that self-destructs after being viewed.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create a secure note</CardTitle>
            <CardDescription>Your note will be encrypted and will expire after being viewed once or after the time expires.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create" className="w-full">
              <Button size="lg" className="w-full">
                Create New Note
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t p-0">
            <div className="grid w-full grid-cols-1 gap-4 px-6 py-4">
              <div className="flex items-start">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-center text-sm font-medium text-primary">1</div>
                <div className="ml-2 flex-1">
                  <h3 className="text-sm font-medium">Write your secret note</h3>
                  <p className="text-xs text-slate-500">Enter passwords, private keys, or any sensitive information.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-center text-sm font-medium text-primary">2</div>
                <div className="ml-2 flex-1">
                  <h3 className="text-sm font-medium">Share the secure link</h3>
                  <p className="text-xs text-slate-500">Send the generated link to your recipient through any messenger.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-center text-sm font-medium text-primary">3</div>
                <div className="ml-2 flex-1">
                  <h3 className="text-sm font-medium">Auto-destruction</h3>
                  <p className="text-xs text-slate-500">Once viewed, the note is permanently deleted from our servers.</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
  }
  

