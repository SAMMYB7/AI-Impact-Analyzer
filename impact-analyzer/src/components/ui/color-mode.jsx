'use client'

import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'

import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme

  const toggleColorMode = React.useCallback((e) => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    // Fallback for browsers without View Transitions API
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(newTheme)
      return
    }

    // Get click coordinates from the toggle button
    let x, y
    if (e && e.clientX && e.clientY) {
      x = e.clientX
      y = e.clientY
    } else if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    } else {
      x = window.innerWidth / 2
      y = 0
    }

    // Calculate the max radius to cover the full viewport from the click point
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Start the view transition — the callback must make synchronous DOM changes
    const transition = document.startViewTransition(() => {
      // Synchronously flip the class so the transition captures both states
      const root = document.documentElement
      root.classList.remove(resolvedTheme)
      root.classList.add(newTheme)
      root.style.colorScheme = newTheme

      // Also tell next-themes so it stays in sync
      setTheme(newTheme)
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        document.documentElement.animate(
          {
            clipPath: resolvedTheme === 'dark' ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement:
              resolvedTheme === 'dark'
                ? '::view-transition-new(root)'
                : '::view-transition-old(root)',
          }
        )
      })
      .catch(() => {
        // Fallback if something goes wrong with the animation
      })
  }, [resolvedTheme, setTheme])

  return {
    colorMode: colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize='9' />}>
        <IconButton
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    )
  },
)

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme light'
      colorPalette='gray'
      colorScheme='light'
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme dark'
      colorPalette='gray'
      colorScheme='dark'
      ref={ref}
      {...props}
    />
  )
})
