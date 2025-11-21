

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
]

function Navbar() {
  const pathname = usePathname()

  const renderLinks = (className?: string) =>
    navItems.map((item) => {
      const isActive = pathname === item.href

      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            isActive && "text-foreground",
            className,
          )}
        >
          {item.label}
        </Link>
      )
    })

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
        >
          attend75
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{renderLinks()}</nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>attend75</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4 px-4 pb-6">
                {renderLinks("text-base")}
                <div className="pt-2 md:hidden">
                  <ModeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar