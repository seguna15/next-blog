'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

function Header(){
    const router = useRouter();
    const navItems = [
        {label: "Home", href: "/"},
        {label: "Create Post", href: "/post/create"},
        
    ]
    return <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between ">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-extrabold">Next.js 15 Blog</Link>
                <nav className="hidden md:flex items-center gap-6">
                    {
                        navItems.map(navItem => {
                            return <Link key={navItem.href} href={navItem.href} className={cn('text-sm font-medium transition-colors hover:text-primary')}>{navItem.label}</Link>
                        })
                    }
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:block">
                    {/** Placeholder for search */}
                </div>
                {/** theme toggle */}
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.push('/auth')} className='cursor-pointer'>
                        Login
                    </Button>
                </div>
            </div>
        </div>
    </header>
}

export default Header