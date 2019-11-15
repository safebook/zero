<template>
  <div>
  <h3>Public Key</h3>
  <div>
    {{encodedPubkey}}</div>
  <h3>Private Key</h3>
  <div>
    {{encodedPrivkey}}</div>
  </div>
</template>

<script>
import base58 from 'bs58'

export default {
  name: 'Profile',
  props: ['pubkey', 'seckey'],
  computed: {
    encodedPubkey () {
      if (this.pubkey) {
        return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(this.pubkey)))
      } else {
        return '(null)'
      }
    },
    encodedPrivkey () {
      if (this.seckey) {
        return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(this.seckey.toBits())))
      } else {
        return '(null)'
      }
    }
  }
}
</script>

<style scoped>
</style>
