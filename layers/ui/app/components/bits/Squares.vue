<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef } from "vue"

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

const props = withDefaults(
  defineProps<{
    direction?: "diagonal" | "up" | "right" | "down" | "left"
    speed?: number
    borderColor?: CanvasStrokeStyle
    squareSize?: number
    hoverFillColor?: CanvasStrokeStyle
  }>(),
  {
    direction: "right",
    speed: 1,
    borderColor: "#999",
    squareSize: 40,
    hoverFillColor: "#222"
  }
)

const canvasRef = useTemplateRef<HTMLCanvasElement>("canvasRef")

const requestRef = ref<number | null>(null)
const numSquaresX = ref<number>(0)
const numSquaresY = ref<number>(0)
const gridOffset = ref<GridOffset>({ x: 0, y: 0 })
const hoveredSquareRef = ref<GridOffset | null>(null)

let ctx: CanvasRenderingContext2D | null = null

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  numSquaresX.value = Math.ceil(canvas.width / props.squareSize) + 1
  numSquaresY.value = Math.ceil(canvas.height / props.squareSize) + 1
}

const drawGrid = () => {
  const canvas = canvasRef.value
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const startX = Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize
  const startY = Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize

  for (let x = startX; x < canvas.width + props.squareSize; x += props.squareSize) {
    for (let y = startY; y < canvas.height + props.squareSize; y += props.squareSize) {
      const squareX = x - (gridOffset.value.x % props.squareSize)
      const squareY = y - (gridOffset.value.y % props.squareSize)

      if (
        hoveredSquareRef.value &&
        Math.floor((x - startX) / props.squareSize) === hoveredSquareRef.value.x &&
        Math.floor((y - startY) / props.squareSize) === hoveredSquareRef.value.y
      ) {
        ctx.fillStyle = props.hoverFillColor
        ctx.fillRect(squareX, squareY, props.squareSize, props.squareSize)
      }

      ctx.strokeStyle = props.borderColor
      ctx.strokeRect(squareX, squareY, props.squareSize, props.squareSize)
    }
  }

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
  )
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
  gradient.addColorStop(1, "#0b0b0b")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const updateAnimation = () => {
  const effectiveSpeed = Math.max(props.speed, 0.1)

  switch (props.direction) {
    case "right":
      gridOffset.value.x =
        (gridOffset.value.x - effectiveSpeed + props.squareSize) % props.squareSize
      break
    case "left":
      gridOffset.value.x =
        (gridOffset.value.x + effectiveSpeed + props.squareSize) % props.squareSize
      break
    case "up":
      gridOffset.value.y =
        (gridOffset.value.y + effectiveSpeed + props.squareSize) % props.squareSize
      break
    case "down":
      gridOffset.value.y =
        (gridOffset.value.y - effectiveSpeed + props.squareSize) % props.squareSize
      break
    case "diagonal":
      gridOffset.value.x =
        (gridOffset.value.x - effectiveSpeed + props.squareSize) % props.squareSize
      gridOffset.value.y =
        (gridOffset.value.y - effectiveSpeed + props.squareSize) % props.squareSize
      break
    default:
      break
  }

  drawGrid()
  requestRef.value = requestAnimationFrame(updateAnimation)
}

const handleMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const startX = Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize
  const startY = Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize

  const hoveredSquareX = Math.floor((mouseX + gridOffset.value.x - startX) / props.squareSize)
  const hoveredSquareY = Math.floor((mouseY + gridOffset.value.y - startY) / props.squareSize)

  if (
    !hoveredSquareRef.value ||
    hoveredSquareRef.value.x !== hoveredSquareX ||
    hoveredSquareRef.value.y !== hoveredSquareY
  ) {
    hoveredSquareRef.value = { x: hoveredSquareX, y: hoveredSquareY }
  }
}

const handleMouseLeave = () => {
  hoveredSquareRef.value = null
}

const handleTouchMove = (event: TouchEvent) => {
  const canvas = canvasRef.value
  if (!canvas || event.touches.length === 0) return

  const touch = event.touches[0]!
  const rect = canvas.getBoundingClientRect()
  const touchX = touch.clientX - rect.left
  const touchY = touch.clientY - rect.top

  const startX = Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize
  const startY = Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize

  const hoveredSquareX = Math.floor((touchX + gridOffset.value.x - startX) / props.squareSize)
  const hoveredSquareY = Math.floor((touchY + gridOffset.value.y - startY) / props.squareSize)

  hoveredSquareRef.value = { x: hoveredSquareX, y: hoveredSquareY }
}

const handleTouchEnd = () => {
  hoveredSquareRef.value = null
}

const initializeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext("2d")
  resizeCanvas()

  canvas.addEventListener("mousemove", handleMouseMove)
  canvas.addEventListener("mouseleave", handleMouseLeave)
  canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
  canvas.addEventListener("touchend", handleTouchEnd)
  window.addEventListener("resize", resizeCanvas)

  requestRef.value = requestAnimationFrame(updateAnimation)
}

const cleanup = () => {
  const canvas = canvasRef.value

  if (requestRef.value) {
    cancelAnimationFrame(requestRef.value)
    requestRef.value = null
  }

  if (canvas) {
    canvas.removeEventListener("mousemove", handleMouseMove)
    canvas.removeEventListener("mouseleave", handleMouseLeave)
    canvas.removeEventListener("touchmove", handleTouchMove)
    canvas.removeEventListener("touchend", handleTouchEnd)
  }

  window.removeEventListener("resize", resizeCanvas)
}

watch(
  [
    () => props.direction,
    () => props.speed,
    () => props.borderColor,
    () => props.hoverFillColor,
    () => props.squareSize
  ],
  () => {
    cleanup()
    initializeCanvas()
  }
)

onMounted(() => {
  initializeCanvas()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <canvas
    class="block h-full w-full border-none"
    ref="canvasRef"
  />
</template>
