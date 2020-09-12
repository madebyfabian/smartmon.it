<template>
  <div class="home">
    <div v-if="data">
      <div class="row">
        <PrimaryDatagroup type="GPU" :data="data.gpu" />
        <PrimaryDatagroup type="CPU" :data="data.cpu" />
      </div>

      <div class="row">
        <SecondaryDatagroup type="SSD" :data="data.ssd" />
        <SecondaryDatagroup type="RAM" :data="data.ram" />
      </div>
    </div>   
    <div class="loading" v-else>
      Loading...  
    </div> 
  </div>
</template>

<script>
  import { store } from '@/store'
  import PrimaryDatagroup from '@/components/PrimaryDatagroup.vue'
  import SecondaryDatagroup from '@/components/SecondaryDatagroup.vue'

  export default {
    components: { PrimaryDatagroup, SecondaryDatagroup },
    computed: {
      data: () => store.data
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    padding: 8px 16px 16px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .loading {
    color: var(--color-text-secondary);
    text-align: center;
    padding-top: 80px;
  }
</style>
