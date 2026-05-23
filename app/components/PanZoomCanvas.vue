<template>
  <div
    ref="el"
    class="pan-zoom-outer"
    @wheel.prevent="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <div class="pan-zoom-inner" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const MIN_SCALE = 0.2
const MAX_SCALE = 8

const el = ref<HTMLElement>()
const tx = ref(0)
const ty = ref(0)
const scale = ref(1)

const innerStyle = computed(() => ({
  transform: `translate3d(${tx.value}px, ${ty.value}px, 0) scale(${scale.value})`,
}))

const MARGIN_X = 100

function clampTranslate() {
  const cw = el.value!.offsetWidth
  const ch = el.value!.offsetHeight
  const scaledW = cw * scale.value
  const scaledH = ch * scale.value

  // X: loose — at least MARGIN_X px of content must remain visible on each side.
  tx.value = Math.max(MARGIN_X - scaledW, Math.min(cw - MARGIN_X, tx.value))

  // Y: strict — center when zoomed out, fill edge-to-edge when zoomed in.
  ty.value =
    scaledH <= ch
      ? (ch - scaledH) / 2
      : Math.max(ch - scaledH, Math.min(0, ty.value))
}

function applyZoom(newScale: number, pivotX: number, pivotY: number) {
  const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))
  const ratio = clamped / scale.value
  tx.value = pivotX - (pivotX - tx.value) * ratio
  ty.value = pivotY - (pivotY - ty.value) * ratio
  scale.value = clamped
  clampTranslate()
}

function onWheel(e: WheelEvent) {
  const rect = el.value!.getBoundingClientRect()
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
  applyZoom(scale.value * factor, e.clientX - rect.left, e.clientY - rect.top)
}

const pointers = new Map<number, PointerEvent>()
let lastPinchDist = 0
let lastPinchMidX = 0
let lastPinchMidY = 0

function onPointerDown(e: PointerEvent) {
  pointers.set(e.pointerId, e)

  if (e.pointerType === 'touch' || e.button === 2) {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    if (a && b) {
      lastPinchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      lastPinchMidX = (a.clientX + b.clientX) / 2
      lastPinchMidY = (a.clientY + b.clientY) / 2
    }
  }
}

function onPointerMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  const prev = pointers.get(e.pointerId)!
  pointers.set(e.pointerId, e)

  if (pointers.size === 1) {
    if (e.pointerType === 'touch' || e.buttons === 2) {
      tx.value += e.clientX - prev.clientX
      ty.value += e.clientY - prev.clientY
      clampTranslate()
    }
    return
  }

  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    if (a && b) {
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      const midX = (a.clientX + b.clientX) / 2
      const midY = (a.clientY + b.clientY) / 2

      const rect = el.value!.getBoundingClientRect()
      const localMidX = midX - rect.left
      const localMidY = midY - rect.top

      applyZoom(scale.value * (dist / lastPinchDist), localMidX, localMidY)

      tx.value += midX - lastPinchMidX
      ty.value += midY - lastPinchMidY
      clampTranslate()

      lastPinchDist = dist
      lastPinchMidX = midX
      lastPinchMidY = midY
    }
  }
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  if (pointers.size < 2) {
    lastPinchDist = 0
  }
}
</script>

<style scoped>
.pan-zoom-outer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}

.pan-zoom-inner {
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
  will-change: transform;
}
</style>
