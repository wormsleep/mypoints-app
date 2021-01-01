<template>
  <div class="home">
    <router-view name="home"/>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item
          v-for="(item, index) in homeTabbarList" :key="index"
          :icon="item.icon">
        {{item.title}}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  // @ is an alias to /src
  import {Tabbar, TabbarItem} from 'vant';

  export default {
    name: 'Home',
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
    },
    data(){
      return {
        active: 0,
        homeTabbarList: [
          {icon: 'home-o', title: '展示区', name: 'home-gallery'},
          {icon: 'search', title: '赢积分', name: 'home-working', params: {refresh: true}},
          {icon: 'friends-o', title: '兑积分', name: 'home-points'},
          {icon: 'setting-o', title: '我', name: 'home-owner'},
        ]
      }
    },
    methods: {
      onChange(index) {
        let h = this.homeTabbarList[index]
        if (h) {
          this.$router.push({name: h.name, params: h.params})
        }
      }
    }
  }
</script>
