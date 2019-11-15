<template>
  <div class="hello">
    <div>
      <button @click="login">
        Login
      </button>
    </div>
    <div>
      <input type="text" v-model="encodedSeckey" />
      <button @click="loginFromSeckey">
        Login from private key
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      encodedSeckey: ''
    }
  },
  props: ['msg'],
  methods: {
    login () {
      this.$emit('login')
    },
    loginFromSeckey () {
      this.$emit('loginFromSeckey', this.encodedSeckey)
    }
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
</style>
