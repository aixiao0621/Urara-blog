<script lang="ts">
  import type { LayoutData } from './$types'
  import { onMount } from 'svelte'
  import { browser, dev } from '$app/environment'
  import { genTags } from '$lib/utils/posts'
  import { posts, tags } from '$lib/stores/posts'
  
  import Head from '$lib/components/head_static.svelte'
  import Header from '$lib/components/header.svelte'
  import Transition from '$lib/components/transition.svelte'
  import '../app.pcss'
  import '../app.uno.css'

  export let data: LayoutData

  let { res, path } = data

  $: if (data) path = data.path

  posts.set(res)
  tags.set(genTags(res))
  onMount(() => {
    if (dev || !browser) return
    ;(async () => {
      try {
        const mod = await import('virtual:pwa-register').catch(() => null)
        if (mod?.registerSW) {
          mod.registerSW({
            immediate: true,
            onRegistered: r => r && setInterval(async () => await r.update(), 198964),
            onRegisterError: error => console.error(error)
          })
        } else if ('serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.register('/service-worker.js')
            setInterval(() => reg.update(), 198964)
          } catch (err) {
            console.error('service worker register failed', err)
          }
        }
      } catch (err) {
        console.error(err)
      }
    })()
  })
</script>

<Head />

<Header {path} ></Header>

<Transition {path}>
  <slot />
</Transition>
