<template>
  <div id="app">
    <div id="logo">
      ŻERʘ</div>
    <div v-if="!logged">
      <Login @login="login" @loginFromSeckey="loginFromSeckey" />
    </div>
    <div v-if="logged">
      <Menu :tab="tab" @changeTab="changeTab" />
      <Outbox v-if="tab == 'messages'" :contacts="contacts" @submitMessage="submitMessage" />
      <Inbox v-if="tab == 'messages'" :messages="messages" @refresh="refresh" />
      <Contacts v-if="tab == 'contacts'" :contacts="contacts" @addContact="addContact" @removeContact="removeContact" />
      <Profile v-if="tab == 'profile'" :pubkey="pubkey" :seckey="seckey"  />
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu.vue'
import Login from './components/Login.vue'
import Inbox from './components/Inbox.vue'
import Outbox from './components/Outbox.vue'
import Contacts from './components/Contacts.vue'
import Profile from './components/Profile.vue'
import helper from './helper'
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
      [this.seckey, this.pubkey] = helper.createKeys()
      this.logged = true

      this.loadContactsFromLocalStorage()
    },
    loginFromSeckey (encodedSeckey) {
      [this.seckey, this.pubkey] = helper.createKeysFromEncodedSeckey(encodedSeckey)
      this.logged = true

      this.loadContactsFromLocalStorage()
      this.decryptMessages()
    },
    loadContactsFromLocalStorage () {
      try {
        const contacts = JSON.parse(localStorage.getItem('contacts'))
        contacts.forEach((o) => {
          this.addContact(o.alias, o.pubkey)
        })
      } catch (error) {
        console.error(error)
      }
    },
    saveContactsToLocalStorage () {
      localStorage.setItem('contacts', JSON.stringify(this.contacts.map((o) => {
        return { alias: o.alias, pubkey: o.pubkey }
      })))
    },
    submitMessage (plaintext, pubkey) {
      let id = 1
      if (this.messages.length >= 1) {
        id = this.messages[this.messages.length - 1].id + 1
      }

      const curve = sjcl.ecc.curves.c384
      const point = curve.fromBits(sjcl.codec.bytes.toBits(base58.decode(pubkey)))
      const shared = point.mult(this.seckey)
      const key = sjcl.hash.sha256.hash(shared.toBits())

      const iv = sjcl.random.randomWords(4)
      const cipher = new sjcl.cipher.aes(key)

      const bitArrayPlaintext = sjcl.codec.utf8String.toBits(plaintext)
      let bytesPlaintext = sjcl.codec.bytes.fromBits(bitArrayPlaintext)
      if (bytesPlaintext.length > 256) {
        console.log('should be <= 256B')
        return
      }
      while (bytesPlaintext.length < 256) {
        bytesPlaintext.push(0)
      }
      const bitArrayPaddedPlaintext = sjcl.codec.bytes.toBits(bytesPlaintext)

      const ciphertext = sjcl.mode.ccm.encrypt(cipher, bitArrayPaddedPlaintext, iv)

      const msg = sjcl.bitArray.concat(iv, ciphertext)
      const b58msg = base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(msg)))
      console.log(b58msg)

      this.messages.push({ id: id, data: b58msg, plaintext: plaintext })

      fetch('/messages', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: b58msg
        })
      })
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
      this.saveContactsToLocalStorage()
    },
    removeContact (index) {
      this.contacts.splice(index, 1)
      this.saveContactsToLocalStorage()
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
            // console.log('Unmatched for ', this.contacts[j].alias)
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
    Contacts,
    Profile
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 1.15em;
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
  font-size: 4rem;
  margin-bottom: 60px;
}
</style>
