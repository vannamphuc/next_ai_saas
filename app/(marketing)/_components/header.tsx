'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import React from 'react'
import { cn } from '@/lib/utils'
import Logo from '@/public/logo.webp'
import Image from 'next/image'
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import useHydrated from '@/components/reactbits/useHydrated'

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { getUser, isLoading } = useKindeBrowserClient()
  const authReady = useHydrated() && isLoading === false
  const user = authReady ? getUser() : null

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setMenuState(false)

    if (!href.startsWith('#')) return

    const target = document.getElementById(href.slice(1))
    if (!target) return

    event.preventDefault()
    if (window.location.hash !== href) {
      window.history.pushState(null, '', href)
    }

    window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5',
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src={Logo}
                  alt="TailFlow logo"
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="text-2xl font-bold">TailFlow</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="lg:hidden">
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 rounded-full border border-border/60 bg-background/85 px-6 py-3 text-sm shadow-sm shadow-black/5 backdrop-blur-md">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={(event) => handleMenuItemClick(event, item.href)}
                      className="block font-medium text-foreground/90 duration-150 hover:text-primary"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={(event) =>
                          handleMenuItemClick(event, item.href)
                        }
                        className="block font-medium text-foreground/90 duration-150 hover:text-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full items-center justify-end gap-2 md:w-fit">
                <div className="hidden lg:block">
                  <ThemeToggle />
                </div>
                {!authReady ? (
                  <div
                    role="status"
                    aria-label="Loading account status"
                    className="flex gap-2"
                  >
                    <Skeleton className="h-9 w-20 motion-reduce:animate-none" />
                    <Skeleton className="h-9 w-20 motion-reduce:animate-none" />
                  </div>
                ) : (
                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                    {user ? (
                      <>
                        <Link
                          href="/workspace"
                          prefetch={false}
                          className={buttonVariants({ size: 'sm' })}
                        >
                          Dashboard
                        </Link>

                        <LogoutLink
                          className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          })}
                        >
                          Logout
                        </LogoutLink>
                      </>
                    ) : (
                      <>
                        <LoginLink
                          className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                            className: cn(isScrolled && 'lg:hidden!'),
                          })}
                        >
                          Login
                        </LoginLink>

                        <RegisterLink
                          className={buttonVariants({
                            size: 'sm',
                            className: cn(isScrolled && 'lg:hidden!'),
                          })}
                          authUrlParams={{
                            is_create_org: 'true',
                            org_name: 'My Workspace',
                            pricing_table_key: 'organization_plans',
                          }}
                        >
                          Sign Up
                        </RegisterLink>

                        <RegisterLink
                          className={buttonVariants({
                            size: 'sm',
                            className: cn(
                              isScrolled ? 'lg:inline-flex!' : 'hidden!',
                            ),
                          })}
                          authUrlParams={{
                            is_create_org: 'true',
                            org_name: 'My Workspace',
                            pricing_table_key: 'organization_plans',
                          }}
                        >
                          Get Started
                        </RegisterLink>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
