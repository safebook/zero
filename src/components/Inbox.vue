<template>
<div class="inbox">
  <div>
    <div
      v-for="msg in messages.slice().reverse()"
      v-bind:key="msg.id">
      {{msg}}
    </div>
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
