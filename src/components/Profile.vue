<template>
  <div>
    <h3>Public Key</h3>
    <div>
      {{encodedPubkey}}</div>
    <h3>Private Key</h3>
    <div v-if="!showPrivKey">
      <p><a href @click.prevent="showPrivKey = true">Show</a></p>
    </div>
    <div v-if="showPrivKey">
      <p>{{encodedPrivkey}}</p>
      <p><a href @click.prevent="showPrivKey = false">Hide</a></p>
    </div>
  </div>
</template>

<script>
import naclUtil from 'tweetnacl-util'

export default {
  name: 'Profile',
  props: ['pubkey', 'seckey'],
  data () {
    return {
      showPrivKey: false
    }
  },
  computed: {
    encodedPubkey () {
      if (this.pubkey) {
        return naclUtil.encodeBase64(this.pubkey)
      } else {
        return '(null)'
      }
    },
    encodedPrivkey () {
      if (this.seckey) {
        return naclUtil.encodeBase64(this.seckey)
      } else {
        return '(null)'
      }
    }
  }
}
</script>

<style scoped>
 h3 {
   font-size: 1.2rem;
 }
 div {
   font-size: 0.9rem;
 }
</style>
