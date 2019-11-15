<template>
  <div id="header">
    <div>
      <a href
         @click.prevent="$emit('changeTab', 'messages')"
         v-bind:class="{ active: tab == 'messages' }"
         >Messages</a>
    </div>
    <div>
      <a href
         @click.prevent="$emit('changeTab', 'contacts')"
         v-bind:class="{ active: tab == 'contacts' }"
         >Contacts</a>
    </div>
    <div>
      <a href
         @click.prevent="$emit('changeTab', 'profile')"
         v-bind:class="{ active: tab == 'profile' }"
         >Profile</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['tab']
}
</script>

<style scoped>
#header {
  margin-bottom: 20px;
}
</style>
