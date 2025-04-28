import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  HomeIcon,
  UsersIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function AppSidebar() {
  const { pathname } = useLocation()

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
        </nav>
      </SidebarInset>
    </SidebarProvider>
  )
}
