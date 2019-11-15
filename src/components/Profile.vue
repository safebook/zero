<template>
  <div>
    {{encodedPubkey}}</div>
</template>

<script>
import base58 from 'bs58'

export default {
  name: 'Profile',
  props: ['pubkey'],
  computed: {
    encodedPubkey () {
      if (this.pubkey) {
        return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(this.pubkey)))
      } else {
        return '(null)'
      }
    }
  }
}
</script>

<style scoped>
</style>
