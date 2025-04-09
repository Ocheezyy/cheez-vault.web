import {Outlet, createRootRoute, Link, useLocation} from '@tanstack/react-router'
import "../index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ArrowLeft, Moon, Sun} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient()

function RootComponent() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  console.log(pathname);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  if (pathname === '/') return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
            <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  )
}
