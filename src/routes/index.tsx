import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cheez Vault</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Share sensitive information that self-destructs after being viewed.
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Create a secure note</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your note will be encrypted and will expire after being viewed once or after the time expires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create" className="w-full">
              <Button size="lg" className="w-full">
                Create New Note
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-200 dark:border-slate-700 p-0">
            <div className="grid w-full grid-cols-1 gap-4 px-6 py-4">
              {[1, 2, 3].map((step) => {
                const steps = [
                  {
                    title: "Write your secret note",
                    desc: "Enter passwords, private keys, or any sensitive information.",
                  },
                  {
                    title: "Share the secure link",
                    desc: "Send the generated link to your recipient through any messenger.",
                  },
                  {
                    title: "Auto-destruction",
                    desc: "Once viewed, the note is permanently deleted from our servers.",
                  },
                ][step - 1]

                return (
                  <div key={step} className="flex items-start">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-center text-sm font-medium text-primary">
                      {step}
                    </div>
                    <div className="ml-2 flex-1">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">{steps.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{steps.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

  )
}


