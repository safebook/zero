<template>
  <div class="inbox">
    <p>This is inbox</p>
    <div>
      <div
        v-for="msg in messages"
        v-bind:key="msg.id">
        {{msg}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inbox',
  props: {
    messages: Array
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
</style>
