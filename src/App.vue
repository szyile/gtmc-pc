<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f2f2f2;
}
/*定义滚动条轨道 背景颜色+圆角*/
::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #f2f2f2;
}
/*定义滑块 背景颜色+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #b4bbc5;
}

body {
  margin: 0px;
  padding: 0px;
  background: #ffffff;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  color: #666;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

p {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
