<template>
  <div class="login-ct">
    <van-cell-group>
      <div class="login-title">我的积分</div>
      <div class="login-subtitle">聚沙成塔 | 积少成多</div>
      <van-field v-model="dlhz" placeholder="请输入用户名" :clearable="true"/>
      <van-field v-model="dlmm" type="password" placeholder="请输入密码"/>
      <div class="login-button">
        <van-button type="warning" round block @click="handleLogin">登&nbsp;录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
  import {Cell, CellGroup, Field, Button} from 'vant';


  export default {
    name: '',
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Button.name]: Button,
    },
    data(){
      return {
        dlhz: '',
        dlmm: '',
      }
    },
    methods: {
      handleLogin() {
        this.$http({
          url: '/getEncryptor',
          method: 'post',
        })
          .then((resp) => {

            let publicKey = resp.data.publicKey
            let rzid = resp.data.rzid

            this.$http({
              url: '/verify',
              method: 'post',
              data: {
                dlzhmm: this.$util.crypto.rsa.encrypt(
                  publicKey,
                  JSON.stringify({
                    dlzh: 'superadmin',
                    dlmm: 'zhaoyifan'
                  })
                ),
                rzid: rzid
              }
            })
              .then((resp2) => {
                debugger
              })
          })
      }
    },
    mounted() {

    },
    created() {

    },
  }

</script>

<style lang="less" scoped>
  .login-ct {
    height: 100%;
  }

  .login-title {
    font-size: 30px;
    line-height: 60px;
    text-align: center;
    color: grey;
  }

  .login-subtitle {
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    color: grey;
    margin-bottom: 20px;
  }

  .login-button {
    padding: 16px;
  }
</style>