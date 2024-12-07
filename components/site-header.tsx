"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, UserCircle, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navigationItems } from "@/constants"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/placeholder.svg?height=40&width=150" 
              alt="Logo" 
              className="h-10"
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                className="w-full pl-8 bg-white"
              />
            </div>
          </div>

          {/* Login Button */}
          <Button variant="ghost" className="gap-2 hidden sm:flex">
            <UserCircle className="h-5 w-5" />
            Login in to Patient Account
          </Button>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-2 py-1 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:block border-t z-10">
          <NavigationMenu className="mx-auto py-2">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {!item.features ? (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base text-black transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="text-base text-black font-normal">{item.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none text-black flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href={item.href}
                              >
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  {item.name}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Learn more about our {item.name.toLowerCase()} and how we can help you.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {item.features?.map((feature) => (
                            <li key={feature.title}>
                              <NavigationMenuLink asChild>
                                <a
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  href={`${item.href}${feature.href}`}
                                >
                                  <div className="text-sm font-medium leading-none">{feature.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  )
}