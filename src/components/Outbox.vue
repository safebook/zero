<template>
  <div id="outbox">
    <div>
      <textarea rows=1
        v-model="currentMessage"
        @keydown="autogrow">
      </textarea>
    </div>
    <div>
      <select v-model="contactIndex">
        <option disabled value="">Select a contact</option>
        <option
          v-for="(contact, index) in contacts"
          :key="index"
          :value="index">
          {{contact.alias}}
        </option>
      </select>
    </div>
    <div>
      <button disabled title="Select contact" v-if="contactIndex === ''">Submit</button>
      <button @click="submitMessage" v-if="contactIndex !== ''">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Outbox',
  props: ['contacts'],
  data () {
    return {
      contactIndex: '',
      currentMessage: ''
    }
  },
  methods: {
    submitMessage () {
      const contact = this.contacts[this.contactIndex]
      this.$emit('submitMessage', this.currentMessage, contact.alias, contact.pubkey)
      this.currentMessage = ''
      this.autogrow()
    },
    autogrow () {
      setTimeout(() => {
        const el = document.querySelector('textarea')
        el.style.cssText = 'height:auto;'
        let height = el.scrollHeight
        el.style.height = height + 'px'
      }, 0)
    }
  },
  created () {
    this.autogrow()
  }
}
</script>

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
#outbox {
  width: 80%;
  margin-left: 10%;
  display: grid;
  grid-template-columns: 60% 20% 20%;
}
textarea {
  width: 100%;
  resize: none;
  overflow: hidden;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid lightgrey;
}
#outbox select {
  width: 90%;
  padding: 2px;
}
#outbox button {
  width: 100%;
  padding: 2px;
}
</style>
