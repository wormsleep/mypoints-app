<template>
  <div>
    <van-nav-bar
        :title="$route.meta.title"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    <van-cell-group>
      <van-cell
          v-for="(item, index) in workingList" :key="index"
          :title="item.jflxMc"
          :value="item.jfz"
          :label="item.scsj"/>
    </van-cell-group>
  </div>
</template>

<script>
  import {
    Cell,
    CellGroup,
    NavBar,
  } from 'vant';

  export default {
    name: '',
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [NavBar.name]: NavBar,
    },
    data(){
      return {
        workingList: [
          {
            jflxMc: '学校语文作业', // 积分类型
            jfbzz: 50,  // 积分标准值
            jfjlz: 10,  // 积分奖励值
            jfkjz: 0, // 积分扣减值
            jfz: 60, // 积分值
            lrrq: '2020-12-21', // 录入日期
            scsj: '2020-12-21 19:18', // 生成时间
            xgsj: '2020-12-21 22:20', // 修改时间
          },
          {
            jflxMc: '学校数学作业',
            jfbzz: 50,
            jfjlz: 0,
            jfkjz: 5,
            jfz: 45,
            lrrq: '2020-12-21',
            scsj: '2020-12-21 19:18',
            xgsj: '2020-12-21 22:20'
          },
          {
            jflxMc: '学校英语作业',
            jfbzz: 50,
            jfjlz: 5,
            jfkjz: 0,
            jfz: 55,
            lrrq: '2020-12-21',
            scsj: '2020-12-21 19:18',
            xgsj: '2020-12-21 22:20'
          },
        ]
      }
    },
    methods: {
      onClickLeft(){
        this.$router.go(-1)
      },
      onClickRight(){
      }
    },
    mounted() {
    },
    created() {

    },
  }

</script>