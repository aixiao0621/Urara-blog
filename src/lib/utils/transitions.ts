import { cubicOut } from 'svelte/easing'

export const DEFAULT_FLY = {
  x: 25,
  duration: 330,
  easing: cubicOut
}

export const LONG_FLY = {
  x: 50,
  duration: 420,
  easing: cubicOut
}

export const STAGGER = (index: number, baseDelay = 120) => ({
  delay: baseDelay * index
})
