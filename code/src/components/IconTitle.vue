<template>
  <div class="iconTitle">
    <div class="icon">
      <GPUIcon v-if="type === 'GPU'" />
      <CPUIcon v-if="type === 'CPU'" />
      <RAMIcon v-if="type === 'RAM'" />
      <SSDIcon v-if="type === 'SSD'" />
    </div>
    {{ type }}
  </div>
</template>

<script>
  import GPUIcon from '@/icons/icon--gpu.svg?inline'
  import CPUIcon from '@/icons/icon--cpu.svg?inline'
  import RAMIcon from '@/icons/icon--ram.svg?inline'
  import SSDIcon from '@/icons/icon--ssd.svg?inline'

  export default {
    components: { GPUIcon, CPUIcon, RAMIcon, SSDIcon },

    props: {
      type: {
        required: true,
        type: String
      }
    }
  }
</script>

<style lang="scss" scoped>
  .iconTitle {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    color: var(--color-text-secondary);
    user-select: none;

    .icon {
      height: 24px;
      width: 24px;
      margin-right: 4px;

      & >>> svg {
        fill: var(--color-text-secondary)!important;
      }
    }
  }
</style>