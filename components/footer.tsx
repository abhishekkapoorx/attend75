import { Github, Heart } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Links Section */}
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/abhishekkapoorx/attend75"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Contribute</span>
            </Link>
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2025 IllumeWork. All rights reserved.
            </p>
            <p className="flex items-center text-xs text-muted-foreground">
              Built with <Heart className="h-3 w-3 mx-1 text-red-500" /> for students who want to optimize their attendance strategy
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}


