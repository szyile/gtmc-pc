<template>
  <el-container v-show="isone ==1 && isadmin ==1" id="shade" class="shade" ref="shade">
    <img @click="next" v-show="index==1" src="../../static/images/dianew/step_01.jpg" alt="">
    <img @click="next" v-show="index==2" src="../../static/images/dianew/step_02.jpg" alt="">
    <img @click="next" v-show="index==3" src="../../static/images/dianew/step_03.jpg" alt="">
    <img @click="next" v-show="index==4" src="../../static/images/dianew/step_04.jpg" alt="">
    <img @click="next" v-show="index==5" src="../../static/images/dianew/step_05.jpg" alt="">
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      index: 1,
      screenWidth: "0",
      screenHeight: "0",
      isone: 0,  //后台返回，判断该用户是否为首次登录,不等于1
      isadmin: 1 //判断是否为管理员，为1管理员
    }
  },
  mounted() {
    //获取当前屏幕的宽高
    this.screenWidth = document.getElementById('app').clientWidth;
    this.screenHeight = document.getElementById('app').clientHeight;
    for (var i = 0; i < 4; i++) {
      this.$refs['shade'].$el.children[i].style.width = this.screenWidth - 4 + 'px'
      this.$refs['shade'].$el.children[i].style.height = this.screenHeight - 4 + 'px'
    }
    this.isone = localStorage.getItem('isFirst')
    this.isadmin = localStorage.getItem('isAdmin')
  },
  methods: {
    next() {
      this.index++
      if (this.index == 6) {
        //完成引导，跳转
        // this.isone = 1
        //防止首次登录页面刷新后再次出现引导
        window.localStorage.setItem('isFirst', 0)
        // 门店直接跳转storeview路由
        this.$router.push({ path: "/storeview" })
      }
    }
  },
}
</script>


<style lang="less" scope>
.shade {
  z-index: 999;
  position: absolute;
  // background-color: black;
  opacity: 1;
  img {
    cursor: pointer;
  }
}
</style>