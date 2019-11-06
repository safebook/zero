<template>
  <div id="app">
    <div id="logo">
      〇
    </div>
    <div v-if="!logged">
      <Login @login="login" />
    </div>
    <div v-if="logged">
      <Menu :tab="tab" @changeTab="changeTab" />
      <a href @click.prevent="refresh">Refresh</a>
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
      contacts: [],
      messages: [],
      tab: 'messages'
    }
  },
  methods: {
    login () {
      const curve = sjcl.ecc.curves.c384

      this.seckey = sjcl.bn.random(curve.r, 10)
      this.pubkey = curve.G.mult(this.seckey).toBits()

      this.addContact('user1', 'p9gKJG5QM2ZVzLeo1E4DHuzpAxy43Bqh8oYQBGsC2xTSCouM1PTFrURrfi31PVo4kJbuf5S4MriF8tJ5JwrvmPSnbCjNTHUSkiBxfwD5qyYqGyXLaMvv41LS6HeTxkZqRHN')
      this.addContact('user2', 'tvNtEpgkTbSz6RWMyeQpSB4MbtCb6eVhEXrdRiXeWnFz5J2JHJuBqEz6CXchsGn8h87LzYMw2rFzPMJEsKa2JtronxMuUWu3fQ9B1yPM9qtrnxySV7N8BTJwM5cmzTRmdrJ')

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

      fetch('/messages', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: b58msg
        })
      })
    },
    encodedPubkey () {
      if (this.pubkey) {
        return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(this.pubkey)))
      } else {
        return '(null)'
      }
    },
    addContact (alias, pubkey) {
      const bitArrayPubkey = sjcl.codec.bytes.toBits(base58.decode(pubkey))
      const point = sjcl.ecc.curves.c384.fromBits(bitArrayPubkey)
      const sharedPoint = point.mult(this.seckey)
      const sharedKey = sjcl.hash.sha256.hash(sharedPoint.toBits())
      this.contacts.push({
        alias: alias,
        pubkey: pubkey,
        sharedKey: sharedKey
      })
    },
    changeTab (tab) {
      this.tab = tab
    },
    refresh () {
      fetch('/messages').then(response => {
        response.json().then(data => {
          this.messages = data.messages
          this.decryptMessages()
        })
      })
    },
    decryptMessages () {
      for (let i = 0; i < this.messages.length; i++) {
        const message = this.messages[i].data
        const data = sjcl.codec.bytes.toBits(base58.decode(message))
        const iv = sjcl.bitArray.bitSlice(data, 0, 128)
        const hiddenData = sjcl.bitArray.bitSlice(data, 128)
        for (let j = 0; j < this.contacts.length; j++) {
          const cipher = new sjcl.cipher.aes(this.contacts[j].sharedKey)
          try {
            const bitArrayPlaintext = sjcl.mode.ccm.decrypt(cipher, hiddenData, iv)
            this.messages[i].plaintext = sjcl.codec.utf8String.fromBits(bitArrayPlaintext)
          } catch (e) {
            console.log('Unmatched for ', this.contacts[j].alias)
          }
        }
      }
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
#logo {
  font-size: 6em;
}
</style>
