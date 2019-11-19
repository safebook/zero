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
    changeTab (tab) {
      this.tab = tab
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
    submitMessage (plaintext, alias, sharedKey) {
      let id = 1
      if (this.messages.length >= 1) {
        id = this.messages[this.messages.length - 1].id + 1
      }

      let encodedCiphertext = ''
      try {
        encodedCiphertext = helper.encryptMessage(plaintext, sharedKey)
      } catch (error) {
        console.error(error)
        return
      }

      this.messages.push({
        id: id,
        alias: alias,
        data: encodedCiphertext,
        plaintext: plaintext
      })

      fetch('/messages', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: encodedCiphertext
        })
      })
    },
    decryptMessages () {
      for (let i = 0; i < this.messages.length; i++) {
        const [iv, hiddenData] = helper.splitIv(helper.decode(this.messages[i].data))
        for (let j = 0; j < this.contacts.length; j++) {
          try {
            const sharedKey = this.contacts[j].sharedKey
            this.messages[i].plaintext = helper.decryptMessage(iv, hiddenData, sharedKey)
            this.messages[i].alias = this.contacts[j].alias
          } catch (e) {
            // console.log('Unmatched for ', this.contacts[j].alias)
          }
        }
      }
    },
    addContact (alias, encodedPubkey) {
      this.contacts.push({
        alias: alias,
        pubkey: encodedPubkey,
        sharedKey: helper.computeSharedKeyFromEncodedPubkey(this.seckey, encodedPubkey)
      })
      this.saveContactsToLocalStorage()
    },
    removeContact (index) {
      this.contacts.splice(index, 1)
      this.saveContactsToLocalStorage()
    },
    refresh () {
      fetch('/messages').then(response => {
        response.json().then(data => {
          this.messages = data.messages
          this.decryptMessages()
        })
      })
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
#logo {
  font-size: 4rem;
  margin-bottom: 60px;
}
</style>
