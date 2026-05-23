<template>
  <div ref="gridEl" class="hex-grid" :style="hexGridStyle">
    <div v-for="(rows, i) in hexGrid" :key="i" class="column">
      <div v-for="(hex, j) in rows" :key="j" class="hexagon">
        <div class="hex-content">
          <div class="hex-content-inner">
            <div class="r debug-coords">{{ hex.r }}</div>
            <div class="q debug-coords">{{ hex.q }}</div>
            <div class="s debug-coords">{{ hex.s }}</div>
            <div
              v-if="playerOnHex(hex)"
              class="player-token"
              :style="{ backgroundColor: playerOnHex(hex)!.color }"
            />
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
import type { WsPlayerInfo, StartPosition } from '~/composables/useApi'

const props = defineProps<{
  radius: number
  players: WsPlayerInfo[]
  startPositions: StartPosition[]
}>()

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

const hexGridStyle = computed(() => ({
  '--hex-height': `${hexHeightPx.value}px`,
}))

function playerOnHex(hex: Hex) {
  const pos = props.startPositions.find(
    (p) => p.q === hex.q && p.r === hex.r && p.s === hex.s,
  )
  if (!pos) return undefined
  return props.players.find((pl) => pl.user_id === pos.user_id)
}

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

$hex-fill-light:       #3a3835;
$hex-fill-dark:        #2a2926;
$hex-border:           #5a4a38;
$hex-border-hover:     #7a5a3a;
$hex-fill-hover-light: #4a4440;
$hex-fill-hover-dark:  #35322f;

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
        display: inline-flex;
        position: absolute;
        top: 0;
        left: calc(var(--hex-radius) / -2);
        height: var(--hex-height);
        width: var(--hex-width);
        background-color: $hex-border;
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        transition: background-color 120ms ease;

        &:hover {
          background-color: $hex-border-hover;

          .hex-content-inner {
            background: radial-gradient(
              ellipse 70% 60% at 38% 35%,
              $hex-fill-hover-light 0%,
              $hex-fill-hover-dark 100%
            );
          }
        }

        .hex-content-inner {
          margin: auto;
          position: relative;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          background: radial-gradient(
            ellipse 70% 60% at 38% 35%,
            $hex-fill-light 0%,
            $hex-fill-dark 100%
          );
          transition: background 120ms ease;

          &::after {
            content: '';
            position: absolute;
            inset: 0;
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            background: radial-gradient(
              ellipse 90% 85% at 50% 50%,
              transparent 55%,
              rgba(0, 0, 0, 0.28) 100%
            );
            pointer-events: none;
            z-index: 1;
          }

          $text-size: calc(var(--hex-height) / 5);

          .debug-coords {
            display: none;
          }

          .player-token {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(var(--hex-height) * 0.35);
            height: calc(var(--hex-height) * 0.35);
            border-radius: 50%;
            border: solid 3px rgba(255, 255, 255, 0.7);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
            background-image: radial-gradient(
              circle at 38% 35%,
              rgba(255, 255, 255, 0.22) 0%,
              transparent 65%
            );
            z-index: 2;
          }

          .r {
            position: absolute;
            right: 23%;
            bottom: 28%;
            color: #0099e6;
            font-size: $text-size;
            z-index: 2;
          }

          .q {
            position: absolute;
            top: 10%;
            left: 50%;
            color: #59b300;
            transform: translateX(-50%);
            font-size: $text-size;
            z-index: 2;
          }

          .s {
            position: absolute;
            left: 23%;
            bottom: 28%;
            color: #e619e6;
            font-size: $text-size;
            z-index: 2;
          }
        }
      }
    }
  }
}
</style>
