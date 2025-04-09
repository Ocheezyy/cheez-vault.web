import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'
import {ArrowLeft, ShieldAlert, AlertCircle, Check, Copy, EyeOff, Eye, Lock} from 'lucide-react'
import {Dispatch, FormEvent, SetStateAction, useEffect, useState} from 'react'
import { useCheckNote } from "@/hooks/useCheckNote";
import { useGetNote } from "@/hooks/useGetNote";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const { data: checkNoteData, isLoading: checkNoteLoading, isError: checkNoteError } = useCheckNote(noteId);
  const { mutateAsync: getNote, isError: getNoteError } = useGetNote();


  useEffect(() => {
    if (checkNoteError) {
      console.error("Failed to get note");
      setError("This note has expired or doesn't exist");
      setIsLoading(false);
    }
  }, [checkNoteError]);

  useEffect(() => {
    if (getNoteError && needsPassword) {
      console.error("Failed to get note");
      setError("Invalid password");
    }
  }, [getNoteError, needsPassword]);

  useEffect(() => {
    if (checkNoteError) setError("This note has expired or doesn't exist");
  }, [checkNoteError]);

  useEffect(() => {
    async function loadNote() {
      if (checkNoteLoading || !checkNoteData || checkNoteError) return;

      try {
        setIsLoading(true);

        if (checkNoteData && checkNoteData.requires_password) {
          setNeedsPassword(true);
        } else {
          const result = await getNote({ noteId, password: null });
          setNoteContent(result.note_content);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load the note");
      } finally {
        setIsLoading(false);
      }
    }

    loadNote()
  }, [checkNoteData, checkNoteError, checkNoteLoading, getNote, noteId])

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCheckingPassword(true);

    try {
      const result = await getNote({noteId, password});
      setNoteContent(result.note_content);
    } catch (err) {
      console.error(err);
      setError("Failed to load the note");
    } finally {
      setIsCheckingPassword(false);
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
            <CardTitle>
              {error ? "Note Unavailable" : needsPassword ? "Password Protected Note" : "Secure Note"}
            </CardTitle>
            <CardDescription>
              {error
                ? "This note may have expired or been viewed already"
                : needsPassword
                  ? "This note requires a password to view"
                  : "This note will be destroyed after viewing"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <NoteCard
              isLoading={isLoading}
              noteContent={noteContent}
              error={error}
              copyToClipboard={copyToClipboard}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isCheckingPassword={isCheckingPassword}
              password={password}
              copied={copied}
              needsPassword={needsPassword}
              handlePasswordSubmit={handlePasswordSubmit}
              setPassword={setPassword}
            />
          </CardContent>

          {!isLoading && !needsPassword && !error && (
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

type NoteCardProps = {
  isLoading: boolean;
  error: string | null;
  needsPassword: boolean;
  handlePasswordSubmit: (e: FormEvent) => void;
  showPassword: boolean;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  isCheckingPassword: boolean;
  noteContent: string | null;
  copyToClipboard: () => void;
  copied: boolean;
}

function NoteCard({ isLoading, error, needsPassword, handlePasswordSubmit, showPassword, password, setPassword, setShowPassword, isCheckingPassword, noteContent, copied, copyToClipboard }: NoteCardProps) {
  if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-slate-500">Checking note status...</p>
      </div>
  );

  if (error) return (
    <div className="flex flex-col items-center py-6 text-center">
      <ShieldAlert className="mb-2 h-12 w-12 text-red-500" />
      <p className="text-slate-700">{error}</p>
    </div>
  );

  if (needsPassword && !noteContent) return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="flex flex-col items-center py-4 text-center">
        <Lock className="mb-2 h-12 w-12 text-amber-500" />
        <p className="text-slate-700">This note is protected with a password</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Enter password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter the note password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          <p>{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isCheckingPassword}>
        {isCheckingPassword ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Unlocking...
          </>
        ) : (
          "Unlock Note"
        )}
      </Button>
    </form>
  )

  if (noteContent) return (
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
  )
}