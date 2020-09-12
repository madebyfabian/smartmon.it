<template>
  <div class="secondaryDatagroup">
    <IconTitle :type="type" />

    <HorizontalDataEntry 
      v-if="type === 'RAM'" 
      :curr="data.used.curr" 
      :max="data.available" 
      name="Usage" />

    <HorizontalDataEntry 
      v-if="type === 'SSD'" 
      :curr="data.temperature.curr"
      :hasGradient="true"
      unit="°C"
      name="Temperature" />
  </div>
</template>

<script>
  import IconTitle from '@/components/IconTitle.vue'
  import HorizontalDataEntry from '@/components/HorizontalDataEntry'

  export default {
    components: { IconTitle, HorizontalDataEntry },

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
    }
  }
</script>

<style lang="scss" scoped>
  .secondaryDatagroup {
    width: 128px;
    text-align: left;
    user-select: none;

    .iconTitle {
      margin-bottom: 12px;
    }
  }
</style>