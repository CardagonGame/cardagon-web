<template>
  <div ref="gridEl" class="hex-grid" :style="hexGridStyle">
    <div v-for="(rows, i) in hexGrid" :key="i" class="column">
      <div
        v-for="(hex, j) in rows"
        :key="j"
        class="hexagon"
      >
        <div class="hex-content">
          <div class="hex-content-inner">
            <div class="r debug-coords">{{ hex.r }}</div>
            <div class="q debug-coords">{{ hex.q }}</div>
            <div class="s debug-coords">{{ hex.s }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHexGrid } from '~/utils/hexlib/getHexGrid'
import { getHeightFromRadius } from '~/utils/hexlib/getHeightFromRadius'
import { hexEquals } from '~/utils/hexlib/hexEquals'
import type { Hex } from '~/utils/hexlib/interfaces/Hex'

const props = defineProps<{ radius: number }>()

const gridEl = ref<HTMLElement>()
const { width, height } = useElementSize(gridEl)

const hoveredHex = ref<Hex | undefined>()

const hexGrid = computed(() => getHexGrid(props.radius))
const hexHeight = computed(() => getHeightFromRadius(props.radius))

const hexHeightPx = computed(() => {
  if (!width.value || !height.value) return 0
  const fromHeight = height.value / hexHeight.value
  const widthFactor = (2 * Math.sqrt(3)) / (3 * hexHeight.value - 1)
  const fromWidth = width.value * widthFactor
  return Math.min(fromHeight, fromWidth)
})

const hexGridStyle = computed(() => ({ '--hex-height': `${hexHeightPx.value}px` }))

function isHoveredHex(hex: Hex) {
  return hexEquals(hex, hoveredHex.value)
}

function isAxialHex(hex: Hex) {
  if (hexEquals(hex, hoveredHex.value)) return false
  return (
    hex.q === hoveredHex.value?.q ||
    hex.r === hoveredHex.value?.r ||
    hex.s === hoveredHex.value?.s
  )
}
</script>

<style lang="scss" scoped>
@use 'sass:math';

$height-to-width-ratio: math.div(2, math.sqrt(3));
$hex-gap: 0px;

.hex-grid {
  --hex-width: calc(var(--hex-height) * #{$height-to-width-ratio});
  --hex-radius: calc(var(--hex-width) / 2);

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: calc(var(--hex-radius) / 2 + #{$hex-gap});

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $hex-gap;

    .hexagon {
      position: relative;
      height: var(--hex-height);
      width: var(--hex-radius);

      .hex-content {
        display: inline-block;
        position: absolute;
        top: 0;
        left: calc(var(--hex-radius) / -2);
        height: var(--hex-height);
        background-color: white;
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        width: var(--hex-width);
        display: flex;

        .hex-content-inner {
          margin: auto;
          position: relative;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          background-color: black;

          $text-size: calc(var(--hex-height) / 5);

          .debug-coords {
            display: none;
          }

          .r {
            position: absolute;
            right: 23%;
            bottom: 28%;
            color: #0099e6;
            font-size: $text-size;
          }

          .q {
            position: absolute;
            top: 10%;
            left: 50%;
            color: #59b300;
            transform: translateX(-50%);
            font-size: $text-size;
          }

          .s {
            position: absolute;
            left: 23%;
            bottom: 28%;
            color: #e619e6;
            font-size: $text-size;
          }
        }
      }
    }
  }
}
</style>
