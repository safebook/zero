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
  display: grid;
  grid-template-columns: 30% 30% 30%;
  margin-left: 10%;
  margin-bottom: 20px;
}
.active {
  text-decoration: none;
  font-weight: bold;
}
</style>
