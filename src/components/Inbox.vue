<template>
  <div class="inbox">
    <div id="outbox">
      <div>
        <textarea
          v-model="currentMessage"
          @keydown="autogrow">
        </textarea>
      </div>
      <div>
        <p>To: Contact 1</p>
      </div>
      <div style="position: relative;">
        <button @click="submitMessage">Submit</button>
      </div>
    </div>
    <p>This is inbox</p>
    <div>
    </div>
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
  props: {
    messages: Array
  },
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
#outbox {
    width: 80%;
    margin-left: 10%;
    border: 1px solid black;
    display: grid;
    grid-template-columns: 60% 20% 20%;
    position: relative;
}
textarea {
    width: 100%;
    resize: none;
    overflow: hidden;
}
button {
    margin-top: 2px;
    margin-bottom: 2px;
    position: absolute;
    bottom: 0;
}
</style>
