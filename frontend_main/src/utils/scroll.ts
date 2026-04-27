import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export const setLenisInstance = (instance: Lenis | null) => {
  lenisInstance = instance
}

export const getLenisInstance = () => lenisInstance

export const isInternalHashLink = (href: string) => href.startsWith('#') && href.length > 1

export const scrollToTarget = (
  target: string | Element,
  {
    offset = -24,
    immediate = false,
  }: {
    offset?: number
    immediate?: boolean
  } = {}
) => {
  if (typeof window === 'undefined') return

  const resolvedTarget =
    typeof target === 'string'
      ? document.querySelector(target)
      : target

  if (!resolvedTarget) return

  if (resolvedTarget instanceof HTMLElement) {
    if (lenisInstance) {
      lenisInstance.scrollTo(resolvedTarget, {
        offset,
        immediate,
        duration: immediate ? 0 : 1.15,
      })
      return
    }

    const top = resolvedTarget.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  }
}
