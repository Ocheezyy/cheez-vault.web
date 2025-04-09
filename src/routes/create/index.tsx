import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { FormEvent, useState } from 'react'
import {useCreateNote} from "@/hooks/useCreateNote.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export const Route = createFileRoute('/create/')({
  component: CreateNote,
});

function CreateNote() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expirationTime, setExpirationTime] = useState("24");
    const [hasExpiration, setHasExpiration] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate({ from: "/create" });
    const { mutate: createNote } = useCreateNote(navigate);
  
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setIsSubmitting(true);
  
      const formData = new FormData(event.currentTarget);
      const contentForm = formData.get("content") as string;
      const passwordForm = formData.get("password") as string;
      const expirationTimeForm = formData.get("expirationTime") as string;

      let expirationTime: number | null = null;
      let messagePassword: string | null = passwordForm;
      try {
        if (hasExpiration && expirationTimeForm.replace(" ", "") !== "")
          expirationTime = Number(expirationTimeForm) * 3600;

        if (!passwordForm || passwordForm.replace(" ", "") === "")
          messagePassword = null;

        createNote({ content: contentForm, password: messagePassword, ttl: expirationTime });
      } catch (error) {
        console.error("Failed to create note:", error);
        setIsSubmitting(false);
      }
    }

    const onCheckChange = (checkedState: boolean) => {
      setHasExpiration(checkedState);
    }
  
    return (
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Create a secure note</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Your note will be encrypted and will expire when opened or when the time runs out.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} autoComplete="off">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-900 dark:text-slate-200">Your secret note</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Type your sensitive information here..."
                    className="min-h-[150px] bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This content will be encrypted and will disappear after being viewed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-900 dark:text-slate-200">Password (optional)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Add an extra layer of security"
                      className="bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground dark:text-slate-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    If set, the recipient will need this password to view the note.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900 dark:text-slate-200">Expiration settings</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hasExpiration" onCheckedChange={onCheckChange} />
                    <label htmlFor="hasExpiration" className="text-slate-500 dark:text-slate-400">
                      Expire after time period?
                    </label>
                  </div>

                  {hasExpiration && (
                    <div className="mt-2 space-y-2">
                      <Label htmlFor="expirationTime" className="text-slate-900 dark:text-slate-200">
                        Expiration time (hours)
                      </Label>
                      <Input
                        id="expirationTime"
                        name="expirationTime"
                        type="number"
                        min="1"
                        max="168"
                        value={expirationTime}
                        onChange={(e) => setExpirationTime(e.target.value)}
                        className="bg-white dark:bg-slate-800 dark:text-white"
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
    )
  }
  
