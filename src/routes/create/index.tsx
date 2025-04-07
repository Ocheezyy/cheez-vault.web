import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import {FormEvent, useState} from 'react'
import {useCreateNote} from "@/hooks/useCreateNote.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export const Route = createFileRoute('/create/')({
  component: CreateNote,
});

function CreateNote() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expirationTime, setExpirationTime] = useState("24");
    const [hasExpiration, setHasExpiration] = useState(false);
    const navigate = useNavigate({ from: "/create" })
    const { mutate: createNote } = useCreateNote(navigate);


  
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsSubmitting(true)
  
      const formData = new FormData(event.currentTarget);
      const content = formData.get("content") as string;
      const password = formData.get("password") as string;
      const expirationTime = formData.get("expirationTime") as string;

      let expirationVal: number | null = null;
      let passwordVal: string | null = password;
      try {
        if (hasExpiration && expirationTime.replace(" ", "") !== "")
          expirationVal = Number(expirationTime) * 3600;

        if (!password || password.replace(" ", "") === "")
          passwordVal = null;

        createNote({content, password: passwordVal, ttl: expirationVal });
      } catch (error) {
        console.error("Failed to create note:", error);
        setIsSubmitting(false);
      }
    }

    const onCheckChange = (checkedState: boolean) => {
      setHasExpiration(checkedState);
    }
  
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-4 flex items-center text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to home
          </Link>
  
          <Card>
            <CardHeader>
              <CardTitle>Create a secure note</CardTitle>
              <CardDescription>Your note will be encrypted and will expire when opened or when the time runs out.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Your secret note</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Type your sensitive information here..."
                    className="min-h-[150px]"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    This content will be encrypted and will disappear after being viewed.
                  </p>
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input id="password" name="password" type="password" placeholder="Add an extra layer of security" />
                  <p className="text-xs text-slate-500">
                    If set, the recipient will need this password to view the note.
                  </p>
                </div>
  
                <div className="space-y-2">
                  <Label>Expiration settings</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hasExpiration" onCheckedChange={onCheckChange} />
                    <label htmlFor="hasExpiration" className="text-slate-500">Expire after time period?</label>
                  </div>

                  {hasExpiration && (
                    <div className="mt-2 space-y-2">
                      <Label htmlFor="expirationTime">Expiration time (hours)</Label>
                      <Input
                        id="expirationTime"
                        type="number"
                        min="1"
                        max="168"
                        value={expirationTime}
                        onChange={(e) => setExpirationTime(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Secure Note"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }
  
