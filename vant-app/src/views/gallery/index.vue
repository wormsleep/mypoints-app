<template>
  <div>
    <van-cell-group title="积分概况">
      <van-cell title="总积分" value="18034" size="large" @click="toJfqk"/>
      <van-cell title="日积分" value="100"  />
      <van-cell title="周积分" value="700"  />
      <van-cell title="月积分" value="2800"  />
    </van-cell-group>
  </div>
</template>

<script>
  import {Cell, CellGroup} from 'vant';

  export default {
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
    },
    data(){
      return {}
    },
    methods: {
      // 查看积分情况
      toJfqk() {
        this.$router.push({name: 'working-list-view'})
      }
    },
    mounted() {
      console.log('gallery')
    }
  }

</script>