import Vue from 'vue'

export const store = Vue.observable({
  data: null,
  webSocket: new WebSocket("ws://localhost:4444")
})

export const mutations = {
  setData( newData ) {
    store.data = newData
  }
}

;(async () => {
  store.webSocket.onmessage = e => {
    try {
      mutations.setData(JSON.parse(e.data))
    } catch (_) {}
  }
})()

