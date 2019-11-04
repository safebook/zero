<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Menu v-if="logged" :tab="tab" @changeTab="changeTab" />
    <div v-if="!logged">
      <Login @login="login" />
    </div>
    <div v-if="logged">
      <p class="pubkey" v-if="tab == 'profile'">{{encodedPubkey()}}</p>
      <Outbox v-if="tab == 'messages'" :contacts="contacts" @submitMessage="submitMessage" />
      <Inbox v-if="tab == 'messages'" :messages="messages" />
      <Contacts v-if="tab == 'contacts'" :contacts="contacts" @addContact="addContact" />
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu.vue'
import Login from './components/Login.vue'
import Inbox from './components/Inbox.vue'
import Outbox from './components/Outbox.vue'
import Contacts from './components/Contacts.vue'
import base58 from 'bs58'

export default {
  name: 'app',
  data () {
    return {
      logged: false,
      pubkey: null,
      seckey: null,
      contacts: [
        { alias: 'user1', pubkey: 'p9gKJG5QM2ZVzLeo1E4DHuzpAxy43Bqh8oYQBGsC2xTSCouM1PTFrURrfi31PVo4kJbuf5S4MriF8tJ5JwrvmPSnbCjNTHUSkiBxfwD5qyYqGyXLaMvv41LS6HeTxkZqRHN' },
        { alias: 'user2', pubkey: 'tvNtEpgkTbSz6RWMyeQpSB4MbtCb6eVhEXrdRiXeWnFz5J2JHJuBqEz6CXchsGn8h87LzYMw2rFzPMJEsKa2JtronxMuUWu3fQ9B1yPM9qtrnxySV7N8BTJwM5cmzTRmdrJ' }],
      messages: [],
      tab: 'messages'
    }
  },
  methods: {
    login () {
      const curve = sjcl.ecc.curves.c384

      this.seckey = sjcl.bn.random(curve.r, 10)
      this.pubkey = curve.G.mult(this.seckey).toBits()

      this.logged = true
    },
    submitMessage (data, pubkey) {
      let id = 1
      if (this.messages.length >= 1) {
        id = this.messages[this.messages.length - 1].id + 1
      }
      this.messages.push({ id: id, data: data, pubkey: pubkey })

      const curve = sjcl.ecc.curves.c384
      const point = curve.fromBits(sjcl.codec.bytes.toBits(base58.decode(pubkey)))
      const shared = point.mult(this.seckey)
      const key = sjcl.hash.sha256.hash(shared.toBits())

      console.log(key)

      const iv = sjcl.random.randomWords(4)
      const cipher = new sjcl.cipher.aes(key)
      const binaryData = sjcl.codec.utf8String.toBits(data)
      const ciphertext = sjcl.mode.ccm.encrypt(cipher, binaryData, iv)

      const msg = sjcl.bitArray.concat(iv, ciphertext)
      console.log(msg)
      const b58msg = base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(msg)))
      console.log(b58msg)
    },
    encodedPubkey () {
      if (this.pubkey) {
        return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(this.pubkey)))
      } else {
        return '(null)'
      }
    },
    addContact (alias, pubkey) {
      console.log(alias, pubkey)
      this.contacts.push({
        alias: alias,
        pubkey: pubkey
      })
    },
    changeTab (tab) {
      this.tab = tab
    }
  },
  created () {
    fetch('/messages').then(response => {
      response.json().then(data => { this.messages = data.messages })
    })
  },
  components: {
    Login,
    Menu,
    Inbox,
    Outbox,
    Contacts
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
 .pubkey {
   margin-left: 33%;
   width: 33%;
   word-break: break-all;
 }
 #header {
   display: grid;
   grid-template-columns: 30% 30% 30%;
   margin-left: 10%;
 }
</style>
