import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router'
import { LinkIcon, Check, Copy } from 'lucide-react';
import { useState } from "react";

export const Route = createFileRoute('/share/$noteId')({
  component: ShareNote,
})

function ShareNote() {
    const { noteId } = Route.useParams();
    const [copied, setCopied] = useState(false);
  
    const shareUrl = `${window.location.origin}/view/${noteId}`;
  
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  
    return (
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">
                Note created successfully!
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Share this secure link with your recipient. The note will self-destruct after being viewed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
                <LinkIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <div className="flex-1 truncate text-sm text-slate-800 dark:text-slate-200">{shareUrl}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 px-2 text-slate-700 dark:text-slate-300"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium">Important:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>This link can only be viewed once</li>
                  <li>After viewing, the note will be permanently deleted</li>
                  <li>Store this link securely until it's shared</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/">
                <Button variant="outline" className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">
                  Create another note
                </Button>
              </Link>
              <Button onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </CardFooter>
          </Card>

    )
  }