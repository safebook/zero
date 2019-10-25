<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld v-if="!logged" @login="login" />
    <Inbox v-if="logged" />
    <!-- can maybe see inbox even if unlogged -->
  </div>
</template>

<script>
/* global sjcl */
import HelloWorld from './components/HelloWorld.vue'
import Inbox from './components/Inbox.vue'

export default {
  name: 'app',
  data () {
    return {
      logged: false,
      pubkey: null,
      seckey: null,
      contacts: [],
      messages: []
    }
  },
  methods: {
    login () {
      const curve = sjcl.ecc.curves.c384

      this.seckey = sjcl.bn.random(curve.r, 10)
      this.pubkey = curve.G.mult(this.seckey).toBits()

      this.logged = true
    }
  },
  components: {
    HelloWorld,
    Inbox
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
