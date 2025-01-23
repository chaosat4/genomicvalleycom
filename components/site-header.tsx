"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, UserCircle } from 'lucide-react'
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
import { navigationItems } from "@/constants"

export function SiteHeader() {
  const [navIsOpened, setNavIsOpened] = useState(false)

  const closeNavbar = () => setNavIsOpened(false)
  const toggleNavbar = () => setNavIsOpened((prev) => !prev)

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={true}
        onClick={closeNavbar}
        className={`fixed bg-gray-800/40 inset-0 z-30 ${navIsOpened ? "sm:hidden" : "hidden"}`}
      />

      <header className="w-full border-b bg-purple-50 z-40">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
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
                  className="w-full pl-8 bg-purple-50"
                />
              </div>
            </div>

            {/* Desktop Login Button */}
            <Button variant="ghost" className="gap-2 hidden sm:flex bg-purple-100 hover:bg-purple-200">
              <UserCircle className="h-5 w-5" />
              Login to Patient Account
            </Button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleNavbar} 
              aria-label="toggle navbar" 
              className="outline-none relative py-3 sm:hidden"
            >
              <span
                aria-hidden={true}
                className={`flex h-0.5 w-6 rounded bg-foreground transition duration-300 ${
                  navIsOpened ? "rotate-45 translate-y-[.324rem]" : ""
                }`}
              />
              <span
                aria-hidden={true}
                className={`mt-2 flex h-0.5 w-6 rounded bg-foreground transition duration-300 ${
                  navIsOpened ? "-rotate-45 -translate-y-[.324rem]" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`absolute left-0 bg-background border-b w-full px-4 py-6 sm:hidden transition-all duration-300 ease-linear ${
              navIsOpened
                ? "translate-y-0 opacity-100 visible"
                : "translate-y-10 opacity-0 invisible"
            }`}
          >
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {!item.features ? (
                    <Link
                      href={item.href}
                      className="text-lg py-2 hover:text-primary transition-colors block"
                      onClick={closeNavbar}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={item.href}
                        className="text-lg py-2 hover:text-primary transition-colors block"
                        onClick={closeNavbar}
                      >
                        {item.name}
                      </Link>
                      <div className="pl-4 space-y-2">
                        {item.features.map((feature) => (
                          <Link
                            key={feature.title}
                            href={`${item.href}${feature.href}`}
                            className="text-sm py-1 hover:text-primary transition-colors block"
                            onClick={closeNavbar}
                          >
                            {feature.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
              <Button className="w-full mt-4">
                <UserCircle className="h-5 w-5 mr-2" />
                Login to Patient Account
              </Button>
            </nav>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:block border-t">
            <NavigationMenu className="mx-auto py-2">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {!item.features ? (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-purple-50 px-4 py-2 text-base font-normal transition-colors hover:bg-purple-100 hover:text-accent-foreground focus:bg-purple-100 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    ) : (
                      <>
                        <NavigationMenuTrigger className="text-base font-normal bg-purple-50 hover:bg-purple-100 focus:bg-purple-100">
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
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
                                    <div className="text-sm font-medium leading-none">
                                      {feature.title}
                                    </div>
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
    </>
  )
}