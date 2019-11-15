<template>
  <div>
    <div id="add-contact-row">
      <div>
        <input
          placeholder="Alias"
          v-model="currentContactAlias"
          type="text" />
      </div>
      <div>
        <input
          placeholder="Pubkey"
          style="width:100%"
          v-model="currentContactPubkey"
          type="text" />
      </div>
      <div>
        <button @click="addContact">Add contact</button>
      </div>
    </div>
    <div id="contacts-box">
      <div v-for="contact in contacts"
        v-bind:key="contact.alias">
        <h4 class="contact-name">{{contact.alias}}</h4>
        <p class="contact-key">{{contact.pubkey}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contacts',
  props: ['contacts'],
  data () {
    return {
      currentContactAlias: '',
      currentContactPubkey: ''
    }
  },
  methods: {
    addContact () {
      this.$emit('addContact', this.currentContactAlias, this.currentContactPubkey)
      this.currentContactAlias = ''
      this.currentContactPubkey = ''
    }
  }
}
</script>

<style>
#add-contact-row {
  display: grid;
  grid-template-columns: 15% 45% 15%;
  margin-left: 20%;
}
#contacts-box {
  margin-left: 15%;
  margin-right: 15%;
}
.contact-name {
  text-align: left;
  margin-bottom: 5px;
}
.contact-key {
  font-size: 0.9rem;
  color: grey;
}
</style>
