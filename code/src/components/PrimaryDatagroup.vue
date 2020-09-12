<template>
  <div class="primaryDatagroup">
    <IconTitle :type="type" />

    <div class="graph">
      <div class="graph-content">
        <div class="graph-content-subtitle">Temp</div>
        <div class="graph-content-value">{{ Math.round(data.temperature.curr) }}°C</div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 40 40" class="graph-svg">
        <defs>
          <linearGradient id="colorGradient" x1="80%" y1="100%" x2="20%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop stop-color="var(--color-accent-green)" offset="0.15" />
            <stop stop-color="var(--color-accent-yellow)" offset="0.55" />
            <stop stop-color="var(--color-accent-yellow)" offset="0.65" />
            <stop stop-color="var(--color-accent-red)" offset=".77" />
          </linearGradient>
        </defs>
        
        <circle class="bgRing"></circle>
        <circle class="maxRing" ref="maxRing" :style="`stroke-dasharray: ${cssDashArrays.maxRing};`"></circle>
        <circle class="currRing" ref="currRing" :style="`stroke-dasharray: ${cssDashArrays.currRing};`"></circle>
      </svg>
    </div>

    <HorizontalDataEntry :curr="data.load.curr" name="Usage" />
    <HorizontalDataEntry v-if="type === 'GPU'" :curr="data.fan" name="Fans" />
  </div>
</template>

<script>
  import IconTitle from '@/components/IconTitle.vue'
  import HorizontalDataEntry from '@/components/HorizontalDataEntry'

  export default {
    components: { IconTitle, HorizontalDataEntry },

    data: () => ({
      cssDashArrays: {
        currRing: '',
        maxRing: ''
      }
    }),

    props: {
      data: {
        required: true
      },
      type: {
        required: true,
        type: String,
        validator: function( value ) {
          return [ 'CPU', 'GPU', 'RAM', 'SSD' ].includes(value)
        }
      }
    },

    methods: {
      setStrokeDasharray( name, value ) {
        let used = (value / 100) * 75,
            left = 100 - used

        this.cssDashArrays[name] = `${used}, ${left}` 
      }
    },

    watch: {
      data: {
        immediate: true,
        deep: true,
        handler( newVal ) {
          this.setStrokeDasharray('currRing', newVal.temperature.curr)
          this.setStrokeDasharray('maxRing', newVal.temperature.max)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .primaryDatagroup {
    width: 128px;
    text-align: center;
    user-select: none;

    .iconTitle {
      justify-content: center;
      margin-bottom: 8px;
    }

    .graph {
      width: 128px;
      position: relative;

      &-content {
        position: absolute;
        width: 100%;
        left: 0;
        padding-top: 40px;

        &-subtitle {
          color: var(--color-text-secondary);
          font-size: 12px;
          line-height: 16px;
          margin-bottom: 4px;
        }

        &-value {
          font-weight: bold;
          font-size: 24px;
          line-height: 24px;
          font-variant-numeric: tabular-nums;
        }
      }

      &-svg {
        width: calc(128px + 12px);
        margin-left: -6px;

        circle {
          stroke-width: 3.5;
          cx: 20;
          cy: 20;
          r: 15.91549430918954;
          fill: transparent;
          transform: rotate(135deg);
          transform-origin: center;
          stroke-dasharray: 75, 25;
          stroke-dashoffset: 0;
          stroke-linecap: round;
        }

        .bgRing {
          stroke: var(--color-bg-secondary);
        }

        .maxRing, .currRing {
          transform-origin: center;
          transition: stroke-dasharray .5s ease;
        }

        .maxRing {
          stroke: var(--color-bg-tertiary);
        }

        .currRing {
          stroke: url(#colorGradient);
          // stroke: url(#gradient);
        }
      }

      
    }
  }
</style>