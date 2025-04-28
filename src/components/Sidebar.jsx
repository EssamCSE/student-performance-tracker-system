import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  HomeIcon,
  UsersIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  LogOutIcon
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function AppSidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/auth')
  }

  return (
    <SidebarProvider>
      {/* Mobile “hamburger” trigger */}
      <div className="md:hidden p-2">
        <SidebarTrigger />
      </div>

      {/* Static sidebar on md+ */}
      <SidebarInset className="hidden md:flex md:flex-col w-64 h-screen border-r bg-background fixed left-0 top-0">
        <div className="px-4 py-6 text-2xl font-bold">My Dashboard</div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard link */}
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-muted/50 ${
                pathname === '/dashboard' ? 'bg-muted hover:bg-muted text-primary font-medium' : ''
              }`}
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Separator className="my-4" />

          {/* Students group */}
          <p className="px-3 mb-1 text-xs font-medium uppercase text-muted-foreground">
            Students
          </p>
          <Link to="/students/list">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-muted/50 ${
                pathname === '/students/list' ? 'bg-muted hover:bg-muted text-primary font-medium' : ''
              }`}
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              List
            </Button>
          </Link>
          <Link to="/students/attendance">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-muted/50 ${
                pathname === '/students/attendance'
                  ? 'bg-muted hover:bg-muted text-primary font-medium'
                  : ''
              }`}
            >
              <CalendarCheckIcon className="mr-2 h-4 w-4" />
              Attendance
            </Button>
          </Link>
          <Link to="/students/marks">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start hover:bg-muted/50 ${
                pathname === '/students/marks' ? 'bg-muted hover:bg-muted text-primary font-medium' : ''
              }`}
            >
              <ClipboardListIcon className="mr-2 h-4 w-4" />
              Marks
            </Button>
          </Link>

          <div className="fixed bottom-0 left-0 w-64 p-4 border-t bg-background">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-muted/50 text-red-600"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </nav>
      </SidebarInset>
    </SidebarProvider>
  )
}
