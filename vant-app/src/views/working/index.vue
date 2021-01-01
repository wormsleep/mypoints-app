<template>
  <div>
    <van-button type="primary" @click="$router.push({name: 'working-list-view'})">主要按钮</van-button>
  </div>
</template>

<script>
  import {Button} from 'vant';

  export default {
    components: {
      [Button.name]: Button,
    },
    data(){
      return {}
    },
    methods: {},
    mounted() {
      console.log('working')
      console.log(this.$route, this.$router)
    }
  }

</script>