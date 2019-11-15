<template>
<div class="inbox">
  <div>
    <div>
      <a href @click.prevent="$emit('refresh')">Refresh</a>
    </div>
    <div v-for="(msg, index) in stacked_messages" :key="index">
      <p v-if="msg.plaintext">{{msg.plaintext}}</p>
      <p v-if="msg.hidden_stack" class="ciphertext">{{msg.hidden_stack}} hidden messages</p>
    </div>
    <!--
    <p
      v-for="msg in messages.slice().reverse()"
      v-bind:key="msg.id">
      <span class="plaintext" v-if="msg.plaintext">{{msg.plaintext}}</span>
      <span class="ciphertext" v-if="!msg.plaintext">{{msg.data}}</span>
    </p>
    -->
  </div>
</div>
</template>

<script>
export default {
  name: 'Inbox',
  props: ['contacts', 'messages'],
  data () {
    return {
      currentMessage: ''
    }
  },
  methods: {
    submitMessage () {
      this.$emit('submitMessage', this.currentMessage)
      this.currentMessage = ''
    },
    autogrow () {
      setTimeout(() => {
        const el = document.querySelector('textarea')
        el.style.cssText = 'height:auto; padding:0'
        let height = el.scrollHeight
        el.style.height = height + 'px'
      }, 0)
    }
  },
  computed: {
    readable_messages () {
      return this.messages.filter((m) => {
        return (m.plaintext === undefined)
      })
    },
    stacked_messages () {
      return this.messages.reduce((acc, val) => {
        if (val.plaintext) {
          return (acc.concat([val]))
        } else {
          if (acc.length >= 1 && acc[acc.length - 1].hidden_stack) {
            acc[acc.length - 1] = { hidden_stack: acc[acc.length - 1].hidden_stack + 1 }
            return acc
          } else {
            return acc.concat([{ hidden_stack: 1 }])
          }
        }
      }, [])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.ciphertext {
  color: #6c757d;
}
</style>
