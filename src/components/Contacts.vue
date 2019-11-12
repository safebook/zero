<template>
  <div>
    <div id="addContactRow">
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
    <div>
      <p v-for="contact in contacts"
        v-bind:key="contact.alias">
        <span>{{contact.alias}} : </span>
        <span>{{contact.pubkey}}</span>
      </p>
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
#addContactRow {
  display: grid;
  grid-template-columns: 20% 60% 20%;
}
</style>
