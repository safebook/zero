<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div id="header">
      <div>
        <a href
           @click.prevent="tab = 'messages'"
           v-bind:class="{ active: tab == 'messages' }"
           >Messages</a>
      </div>
      <div>
        <a href
           @click.prevent="tab = 'contacts'"
           v-bind:class="{ active: tab == 'contacts' }"
           >Contacts</a>
      </div>
      <div>
        <a href
           @click.prevent="tab = 'profile'"
           v-bind:class="{ active: tab == 'profile' }"
           >Profile</a>
      </div>
    </div>
    <Login v-if="!logged" @login="login" />
    <p class="pubkey" v-if="tab == 'profile'">
      {{encodedPubkey()}}
    </p>
    <Inbox v-if="tab == 'messages'"
        :messages="messages"
        @submitMessage="submitMessage" />
    <Contacts
      v-if="tab == 'contacts'"
      :contacts="contacts"
      @addContact="addContact" />
  </div>
</template>

<script>
/* global sjcl */
import Login from './components/Login.vue'
import Inbox from './components/Inbox.vue'
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

      this.logged = true
    },
    submitMessage (data) {
      let id = 1
      if (this.messages.length > 1) {
        id = this.messages[this.messages.length - 1].id + 1
      }
      this.messages.push({ id: id, data: data })
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
    }
  },
  created () {
    fetch('https://api.myjson.com/bins/1c4pn4').then(response => {
      response.json().then(data => { this.messages = data.messages })
    })
  },
  components: {
    Login,
    Inbox,
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
