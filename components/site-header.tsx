"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, UserCircle, X, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useDebounce } from "@/hooks/use-debounce"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { navigationItems } from "@/constants"

interface SearchResult {
  id: number;
  name: string;
  overview: string;
  price: number;
  category: string;
  diseasesSupported: { name: string }[];
}

export function SiteHeader() {
  const [navIsOpened, setNavIsOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearch.trim().length < 2) {
        setResults([])
        return
      }

      try {
        const response = await fetch(`/api/services/search?q=${encodeURIComponent(debouncedSearch)}`)
        if (!response.ok) throw new Error('Search failed')
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
    }

    fetchResults()
  }, [debouncedSearch])

  const handleSearchClick = (id: number) => {
    setShowResults(false)
    setSearchQuery("")
    router.push(`/services/${id}`)
  }

  const closeNavbar = () => setNavIsOpened(false)
  const toggleNavbar = () => setNavIsOpened((prev) => !prev)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

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
                src="/nav_logo.png" 
                alt="Logo" 
                className="h-16"
              />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-auto hidden sm:block relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services or diseases..."
                  className="w-full pl-8 bg-purple-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setResults([])
                    }}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSearchClick(result.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{result.name}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{result.overview}</p>
                        </div>
                      </div>
                      {result.diseasesSupported.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {result.diseasesSupported.slice(0, 3).map((disease, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {disease.name}
                            </span>
                          ))}
                          {result.diseasesSupported.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{result.diseasesSupported.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Login/Profile Button */}
            <div className="hidden sm:flex gap-2">
              <Button 
                variant="ghost" 
                className="gap-2 bg-purple-100 hover:bg-purple-200"
                onClick={() => window.open('/Brochure.pdf', '_blank')}
              >
                <Download className="h-5 w-5" />
                Brochure
              </Button>
              
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  className="gap-2 bg-purple-100 hover:bg-purple-200"
                  onClick={handleLogout}
                >
                  <UserCircle className="h-5 w-5" />
                  Logout
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="gap-2 bg-purple-100 hover:bg-purple-200"
                  onClick={() => router.push('/login')}
                >
                  <UserCircle className="h-5 w-5" />
                  Login
                </Button>
              )}
            </div>

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
              <Button 
                className="w-full"
                onClick={() => window.open('/Brochure.pdf', '_blank')}
              >
                <Download className="h-5 w-5 mr-2" />
                Brochure
              </Button>
              <Button className="w-full mt-4">
                <UserCircle className="h-5 w-5 mr-2" />
                Login
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
                        <Link href={item.href}>
                          <NavigationMenuTrigger className="text-base font-normal bg-purple-50 hover:bg-purple-100 focus:bg-purple-100">
                            {item.name}
                          </NavigationMenuTrigger>
                        </Link>
                        
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