<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Hello this is it</p>
    <button @click="login">
      Login
    </button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      logged: false
    }
  },
  props: {
    msg: String
  },
  methods: {
    login () {
      this.$emit('login')
      this.logged = true
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
