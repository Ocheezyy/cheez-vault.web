import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ShieldAlert, AlertCircle, Check, Copy } from 'lucide-react'
import {FormEvent, useEffect, useState} from 'react'
import { useCheckNote } from "@/hooks/useCheckNote.ts";
import { useGetNote } from "@/hooks/useGetNote.ts";

export const Route = createFileRoute('/view/$noteId')({
  component: ViewNote,
})

function ViewNote() {
  const { noteId } = Route.useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: checkNoteData, isLoading: checkNoteLoading, isError: checkNoteError } = useCheckNote(noteId);
  const { mutate: getNote, isError: getNoteError } = useGetNote();

  useEffect(() => {
    if (checkNoteError) {
      console.error("Failed to get note");
      setError("This note has expired or doesn't exist");
    }
  }, [checkNoteError]);

  useEffect(() => {
    if (getNoteError) {
      console.error("Failed to get note");
      setError("Invalid password");
    }
  }, [getNoteError]);

  useEffect(() => {
    if (!checkNoteData) return;

    if (checkNoteData.requires_password) setNeedsPassword(true);
    else getNote({ noteId })
  }, [checkNoteData, getNote, noteId]);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = getNote({ noteId, password })
      setNoteContent(result.note_content)

      // if (!result) {
      //   setError("This note has expired or doesn't exist")
      // } else if (result.content === "PASSWORD_REQUIRED") {
      //   setError("Incorrect password")
      //   setIsLoading(false)
      // } else {
      //   setNeedsPassword(false)
      //   setNoteContent(result.content)
      // }
    } catch (err) {
      console.error(err);
      setError("Failed to load the note");
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    if (!noteContent) return

    try {
      await navigator.clipboard.writeText(noteContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
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
            <CardTitle>{error ? "Note Unavailable" : "Secure Note"}</CardTitle>
            <CardDescription>
              {error
                ? "This note may have expired or been viewed already"
                : "This note will be destroyed after viewing"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-6 text-center">
                <ShieldAlert className="mb-2 h-12 w-12 text-red-500" />
                <p className="text-slate-700">{error}</p>
              </div>
            ) : needsPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">This note is password protected</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password to view"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Unlock Note
                </Button>
              </form>
            ) : noteContent ? (
              <div className="space-y-4">
                <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <p>This note will be destroyed after you leave this page</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <pre className="whitespace-pre-wrap break-words text-sm">{noteContent}</pre>
                </div>

                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to clipboard
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </CardContent>

          {!isLoading && !needsPassword && (
            <CardFooter>
              <Link to="/" className="w-full">
                <Button variant="secondary" className="w-full">
                  Create a new note
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}