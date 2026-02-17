<script setup lang="ts">
const props = defineProps<{
  page: unknown
}>()

let onResize: (() => void) | null = null

const tocNavEl = ref<HTMLElement | null>(null)
const tocNavHeight = ref(0)
const tocIndicatorHeight = 18
const activeTocId = ref<string>("")

// Рекурсивно «разворачиваем» дерево заголовков в плоский список с depth
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

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

// Плоский список всех заголовков со вложенностью
const tocLinks = computed<TocLink[]>(() => {
  const page = props.page as any
  const rawLinks = page?.body?.toc?.links || page?.toc?.links
  if (!Array.isArray(rawLinks)) return []
  return flattenLinks(rawLinks)
})

const activeTocIndex = computed(() => {
  if (!activeTocId.value) return 0
  const idx = tocLinks.value.findIndex((l) => String(l.id) === activeTocId.value)
  return idx >= 0 ? idx : 0
})

const tocIndicatorTop = computed(() => {
  const count = tocLinks.value.length
  const h = tocNavHeight.value
  if (count <= 1 || h <= 0) return 0
  const maxTop = Math.max(0, h - tocIndicatorHeight)
  const rawTop = (activeTocIndex.value / (count - 1)) * maxTop
  return Math.min(maxTop, Math.max(0, rawTop))
})

// Отступ в px на каждый уровень вложенности
const depthPadding = (depth: number) => `${depth * 12}px`

const setupTocObserver = async () => {
  if (!import.meta.client) return

  await nextTick()

  tocNavHeight.value = tocNavEl.value?.getBoundingClientRect().height || 0

  if (!tocLinks.value.length) {
    activeTocId.value = ""
    return
  }

  const ids = tocLinks.value.map((l) => String(l.id))
  const els = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (!els.length) {
    activeTocId.value = ""
    return
  }

  activeTocId.value = activeTocId.value || ids[0] || ""

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0))

      if (visible[0]?.target) activeTocId.value = (visible[0].target as HTMLElement).id
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -70% 0px"
    }
  )

  els.forEach((el) => observer.observe(el))

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

watch(
  () => tocLinks.value.map((l) => String(l.id)).join(","),
  () => setupTocObserver(),
  { immediate: true, flush: "post" }
)

onMounted(() => {
  if (!import.meta.client) return

  setupTocObserver()

  onResize = () => {
    tocNavHeight.value = tocNavEl.value?.getBoundingClientRect().height || 0
  }

  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  if (!onResize) return
  window.removeEventListener("resize", onResize)
  onResize = null
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
      <!-- Вертикальная полоска-трек -->
      <div class="absolute inset-y-0 left-1 w-px bg-white/10" />
      <!-- Активный индикатор -->
      <div
        class="bg-primary-400 absolute left-1 w-px transition-[top] duration-150"
        :style="{ top: `${tocIndicatorTop}px`, height: `${tocIndicatorHeight}px` }"
      />

      <a
        v-for="link in tocLinks"
        class="text-muted block rounded-md px-2 py-1 text-sm transition-colors hover:bg-white/5 hover:text-white"
        :class="[
          String(link.id) === activeTocId ? 'bg-white/5 text-white' : '',
          link.depth > 0 ? 'text-xs opacity-75' : ''
        ]"
        :style="{ paddingLeft: `calc(0.5rem + ${depthPadding(link.depth)})` }"
        :href="`#${link.id}`"
        :key="link.id"
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
