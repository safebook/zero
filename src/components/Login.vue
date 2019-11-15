<template>
  <div class="hello">
    <div id="join-now">
      <a href @click.prevent="login">
        Join now
      </a>
    </div>
    <div id="join-from-private-key">
      <a href @click.prevent="showSeckeyInput = true">
        Login with existing private key
      </a>
    </div>
    <div v-if="showSeckeyInput">
      <input type="text" v-model="encodedSeckey" />
      <button @click="loginFromSeckey">
        Login
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      encodedSeckey: '',
      showSeckeyInput: false
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
#join-now {
  font-size: 2.6rem;
  margin: 30px;
}
#join-from-private-key {
  margin: 20px;
  font-size: 0.9rem;
}
</style>
