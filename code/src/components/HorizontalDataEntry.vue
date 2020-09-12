<template>
  <div class="horizontalDataEntry">
    <div class="horizontalDataEntry-top">
      <div class="horizontalDataEntry-top-key">{{ name }}</div>
      <div class="horizontalDataEntry-top-value">{{ currPercentage + unit }}</div>
    </div>

    <svg width="100%" height="100%" viewBox="0 0 104 6" class="horizontalDataEntry-svg">
      <defs>
        <linearGradient id="colorGradientHorizontal" x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop stop-color="var(--color-accent-green)"/>
          <stop stop-color="var(--color-accent-yellow)" offset="0.75" />
          <stop stop-color="var(--color-accent-red)"    offset="1" />
        </linearGradient>
      </defs>

      <rect class="bgRect" width="104" x="0" y="0" rx="3" height="6" />
      <rect class="currRect" :class="{ 'hasGradient': hasGradient }" :width="currBarWidth" x="0" y="0" rx="3" height="6" />
    </svg>
  </div>
</template>

<script>
  export default {
    props: {
      max: { type: Number, default: 100 },
      curr: { type: Number, required: true },
      hasGradient: { type: Boolean, default: false },
      name: { type: String, required: true },
      unit: { type: String, default: '%' }
    },

    computed: {
      currBarWidth() {
        return Math.round((this.curr / this.max) * 101)
      },

      currPercentage() {
        return Math.round((this.curr / this.max) * 100)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .horizontalDataEntry {
    margin-bottom: 24px;

    &-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 16px;

      &-key {
        color: var(--color-text-secondary);
      }

      &-value {
        font-weight: bold;
        font-variant-numeric: tabular-nums;
      }
    }

    &-svg {
      rect {
        fill: var(--color-bg-secondary);
        transition: width .5s ease;

        &.currRect {
          fill: var(--color-bg-tertiary);

          &.hasGradient {
            fill: url(#colorGradientHorizontal);
          }
        }
      }
    }
  }
</style>