<script setup lang="ts">
const props = defineProps<{
  page: any
}>()

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

let onResize: (() => void) | null = null
let onScroll: (() => void) | null = null

const linkEls = ref<HTMLElement[]>([])
const activeTocIds = ref<Set<string>>(new Set())

const tocLinks = computed<TocLink[]>(() => {
  const page = props.page
  const rawLinks = page?.body?.toc?.links || page?.toc?.links
  if (!Array.isArray(rawLinks)) return []
  return flattenLinks(rawLinks)
})

const activeIndices = computed(() => {
  if (!activeTocIds.value.size) return [0]
  return tocLinks.value
    .map((l, i) => (activeTocIds.value.has(String(l.id)) ? i : -1))
    .filter((i): i is number => i >= 0)
})

const indicatorStyle = computed(() => {
  const els = linkEls.value
  const indices = activeIndices.value
  if (!els.length || !indices.length) return { top: "0px", height: "0px" }

  const firstIdx = indices[0] ?? 0
  const lastIdx = indices[indices.length - 1] ?? 0
  const first = els[firstIdx]
  const last = els[lastIdx]
  if (!first) return { top: "0px", height: "0px" }

  const top = first.offsetTop
  const bottom = last ? last.offsetTop + last.offsetHeight : top + first.offsetHeight
  return {
    top: `${top}px`,
    height: `${bottom - top}px`
  }
})

const flattenLinks = (links: TocLink[], depth = 0): TocLink[] => {
  const result: TocLink[] = []
  for (const link of links) {
    result.push({ ...link, depth })
    if (link.children?.length) {
      result.push(...flattenLinks(link.children, depth + 1))
    }
  }
  return result
}
const depthPadding = (depth: number) => `${depth * 12}px`

const setLinkRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && el instanceof HTMLElement) {
    linkEls.value[index] = el
  }
}

const getLinkClasses = (link: TocLink) => {
  return [
    activeTocIds.value.has(String(link.id)) ? "text-white" : "",
    link.depth > 0 ? "text-xs opacity-75" : ""
  ]
}

const updateActiveIds = (els: HTMLElement[], ids: string[]) => {
  const vh = window.innerHeight
  const next = new Set<string>()

  for (let i = 0; i < els.length; i++) {
    const el = els[i]!
    const nextEl = els[i + 1]
    const sectionTop = el.getBoundingClientRect().top
    const sectionBottom = nextEl ? nextEl.getBoundingClientRect().top : document.body.scrollHeight

    if (sectionTop < vh && sectionBottom > 0) next.add(ids[i]!)
  }

  if (!next.size) {
    let fallback: string | null = null
    for (let i = 0; i < els.length; i++) {
      if (els[i]!.getBoundingClientRect().top <= 0) fallback = ids[i]!
      else break
    }
    if (fallback) next.add(fallback)
    else if (ids[0]) next.add(ids[0])
  }

  activeTocIds.value = next
}

const setupTocObserver = async () => {
  if (!import.meta.client) return

  await nextTick()

  if (onScroll) {
    window.removeEventListener("scroll", onScroll, true)
    onScroll = null
  }

  if (!tocLinks.value.length) {
    activeTocIds.value = new Set()
    return
  }

  const ids = tocLinks.value.map((l) => String(l.id))
  const els = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (!els.length) {
    activeTocIds.value = new Set()
    return
  }

  updateActiveIds(els, ids)

  onScroll = () => updateActiveIds(els, ids)
  window.addEventListener("scroll", onScroll, { passive: true, capture: true })

  onResize = () => updateActiveIds(els, ids)
  window.addEventListener("resize", onResize)
}

watch(
  () => tocLinks.value.map((l) => String(l.id)).join(","),
  () => setupTocObserver(),
  { immediate: true, flush: "post" }
)

onMounted(() => {
  if (!import.meta.client) return
  setupTocObserver()
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  if (onScroll) {
    window.removeEventListener("scroll", onScroll, true)
    onScroll = null
  }
  if (onResize) {
    window.removeEventListener("resize", onResize)
    onResize = null
  }
})
</script>

<template>
  <div class="rounded-xl border border-white/5 bg-white/3 p-4">
    <div class="text-muted text-xs font-semibold tracking-wider uppercase">
      {{ $t("layout.projectPage.onThisPage") }}
    </div>

    <nav
      v-if="tocLinks.length"
      class="relative mt-3 pl-4"
      ref="tocNavEl"
    >
      <div class="absolute inset-y-0 left-1 w-px bg-white/10" />
      <div
        class="bg-primary-400 absolute left-1 w-px transition-[top,height] duration-200"
        :style="indicatorStyle"
      />

      <a
        v-for="(link, i) in tocLinks"
        class="text-muted block rounded-md px-2 py-1 text-sm transition-colors hover:bg-white/5 hover:text-white"
        :class="getLinkClasses(link)"
        :style="{ paddingLeft: `calc(0.5rem + ${depthPadding(link.depth)})` }"
        :href="`#${link.id}`"
        :key="link.id"
        :ref="(el) => setLinkRef(el, i)"
      >
        {{ link.text }}
      </a>
    </nav>

    <div
      v-else
      class="text-muted mt-3 text-sm"
    >
      —
    </div>
  </div>
</template>
