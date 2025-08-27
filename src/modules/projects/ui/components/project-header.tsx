"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, ChevronLeftIcon, SunIcon, MoonIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface ProjectHeaderProps {
  projectId: string
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const { theme, setTheme } = useTheme()
  const trpc = useTRPC()

  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    }),
  )

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4 border-b border-border/50">
          <div className="animate-pulse flex items-center gap-4">
            <div className="h-8 w-8 bg-muted rounded-md"></div>
            <div className="h-8 w-24 bg-muted rounded-md"></div>
            <div className="h-8 w-32 bg-muted rounded-md ml-auto"></div>
          </div>
        </div>
      }
    >
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="group transition-all duration-200 hover:bg-accent/80 hover:scale-105 active:scale-95"
          >
            <Link href="/">
              <ChevronLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          </Button>

          <div className="transition-transform duration-200 hover:scale-105">
            <Image
              src="/logo1.svg"
              alt="Logo"
              width={100}
              height={32}
              className="transition-opacity duration-200 hover:opacity-90"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    size="sm"
    className="group relative overflow-hidden transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-lg active:scale-95 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20 dark:border-white/10"
  >
    <h1 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text transition-all duration-200 group-hover:from-accent-foreground group-hover:to-accent-foreground/80">
      {project?.name}
    </h1>
    <ChevronDownIcon className="h-4 w-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
  </Button>
</DropdownMenuTrigger>

            <DropdownMenuContent
              className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg"
              sideOffset={8}
            >
              <DropdownMenuItem className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80 cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80 cursor-pointer">
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80">
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="animate-in fade-in-0 zoom-in-95 bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg">
                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                      <DropdownMenuRadioItem
                        value="light"
                        className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80 cursor-pointer"
                      >
                        <SunIcon className="h-4 w-4 mr-2 transition-transform duration-200 hover:rotate-12" />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="dark"
                        className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80 cursor-pointer"
                      >
                        <MoonIcon className="h-4 w-4 mr-2 transition-transform duration-200 hover:-rotate-12" />
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="system"
                        className="transition-colors duration-150 hover:bg-accent/80 focus:bg-accent/80 cursor-pointer"
                      >
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-border/50" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </Suspense>
  )
}
