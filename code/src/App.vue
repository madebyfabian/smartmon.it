<template>
  <div id="app">
    <div class="topBar">
      <div class="topBar-btnGroup">
        <div class="topBar-btn" @click="handleMinimizeWindow">
          <IconMinimize />
        </div>
        <div class="topBar-btn" @click="handleCloseWindow">
          <IconClose />
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import { store } from '@/store'
  import IconMinimize from '@/icons/icon--minimize.svg?inline'
  import IconClose from '@/icons/icon--close.svg?inline'

  export default {
    computed: {
      webSocket: () => store.webSocket
    },

    components: { IconMinimize, IconClose },

    methods: {
      async handleCloseWindow() {
        this.webSocket.send('CLOSE_WINDOW')
      },
      
      async handleMinimizeWindow() {
        this.webSocket.send('MINIMIZE_WINDOW')
      }
    }
  }
</script>

<style lang="scss">
  :root {
    --color-bg-primary: #10101D;
    --color-bg-secondary: #0F3460;
    --color-bg-tertiary: #325F95;
    --color-text-primary: #fff;
    --color-text-secondary: #6081A9;
    
    --color-accent-green: #60E945;
    --color-accent-yellow: #E9B245;
    --color-accent-red: #E94560;
  }

  #app {
    font-family: 'Segoe UI', system-ui, system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text-primary);
    border-radius: 16px 16px 0 0;
    background: var(--color-bg-primary);
    height: calc(100vh - 16px);
    overflow: hidden;
    box-shadow: 0 -2px 6px rgba(#000, .25);
  }

  .topBar {
    width: 100%;
    -webkit-app-region: drag;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: -8px;

    &-btnGroup {
      display: flex;
      -webkit-app-region: no-drag;
    }

    &-btn {
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 150ms ease;

      &:hover {
        opacity: .5;
      }

      * {
        fill: var(--color-text-secondary);
      }
    }
  }

  body {
    overflow: hidden;
    background: transparent;
    margin: 16px
  }

  *, *::after, *::before {
    box-sizing: border-box;
  }
</style>
