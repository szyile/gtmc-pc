<template>
  <el-container class="main">
    <!-- 遮罩区域 首次登录弹窗 -->
    <shade ref="shadee"></shade>
    <el-header style="height: 70px;">
      <el-col class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img src="../../static/images/home/logo.png" alt />
        <span>{{collapsed?'':sysName}}</span>
      </el-col>
      <el-col :span="4">
        <div class="menus" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col class="userinfo" :span="10">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="this.sysUserAvatar" />
            <span>{{sysUserName}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changepass">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="loginout" @click.prevent="logout">
          <i class="el-icon-switch-button"></i>
        </div>
      </el-col>
    </el-header>
    <el-container>
      <el-aside width="230px" v-show="!collapsed">
        <el-menu
          ref="menu"
          :default-active="$route.path"
          :default-openeds="menuarr"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
        >
          <div v-for="(item,index) in routeData" :key="index" v-show="item.isShow == '1'">
            <el-submenu :index="index+''" v-if="item.childrenNum > 0">
              <template slot="title">
                
                <i :class="item.icon"></i>
                 <i v-show="item.name == '门店管理'"  :class="['fa','fa-television','fa-fw']"></i>
                {{item.name}}
              </template>
              <el-menu-item
                v-for="(child,index1) in item.children"
                :index="child.href"
                :key="index1"
                v-show="child.isShow == '1'"
              >{{child.name}}</el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-aside width="60px" v-show="collapsed">
        <el-menu :default-active="$route.path" router>
          <div v-for="(item,index) in routeData" :key="index" v-show="item.isShow == '1'">
            <el-submenu :index="index+''" :class="collapsed?'el-home-width':''">
              <template slot="title">
                <i :class="item.icon"></i>
                <i v-show="item.name == '门店管理'"  :class="['fa','fa-television','fa-fw']"></i>
              </template>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-main class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <span class="title-left">
              <i class="line"></i>
              <strong class="title">{{$route.meta.title}}</strong>
            </span>
            <span class="title-right">
              <el-button size="small" icon="el-icon-refresh" @click="shuaxin">刷新</el-button>
              <el-button size="small" icon="el-icon-arrow-left" @click="fanhui">返回</el-button>
            </span>
          </el-col>
          <el-col :span="24" class="content-wrapper" v-show="$route.name == 'Home'">
            <span class="hometext">这里是主页，点击左侧菜单</span>
          </el-col>
          <el-col :span="24" class="content-wrapper" v-show="$route.name != 'Home'">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import headurl from "../../static/images/home/headurl.png";
// 引入遮罩组件
import Shade from "@/components/Shade";
import { userDetail, roleMenuList } from "../api/api";
export default {
  components: {
    Shade,
  },
  data() {
    return {
      sysName: "取送车服务",
      sysUserName: "测试",
      sysUserAvatar: headurl,
      collapsed: false,
      routeData: [],
      menuarr: [],
      roleid: "",
      userId: "", //用户ID
    };
  },
  created() {
    this.userId = localStorage.getItem("userId");
    if (!this.userId) {
      this.$message({
        offset: 100,
        type: "warning",
        message: "登录凭证过期，重新登录!",
      });
      this.$router.replace({ path: "/Login" });
    }
  },
  mounted() {
    // 获取窗口大小
    this.screensize();
    this.userInfo();
    let _this = this;
    /*     setTimeout(function() {
          _this.rolemenuload();
        }, 500); */
    window.onresize = function () {
      _this.screensize();
    };
    this.pushwidth();
  },
  methods: {
    pushwidth() {},
    // 窗口大小变更事件
    screensize() {
      let screenHeight = document.documentElement.clientHeight; //窗口高度
      let oIframe = document.getElementsByClassName("content-container");
      oIframe[0].style.height = screenHeight - 70 + "px"; //'70'是头部高度
    },
    // 获取用户信息
    userInfo() {
      let para = {
        userId: localStorage.getItem("userId"),
      };
      userDetail(para).then((res) => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error",
          });
        } else {
          console.log
          this.roleid = res.body.roleId;
          localStorage.setItem("roleId", res.body.roleId); // 角色ID
          localStorage.setItem("roleCode", res.body.roleCode); // 角色英文名/编码
          // 姓名
          this.sysUserName = res.body.name;
          // 头像
          if (res.body.photo && res.body.photo != "null") {
            this.sysUserAvatar = res.body.photo;
          }
          //加载 角色列表
          this.rolemenuload();
        }
      });
    },
    // 角色权限菜单列表
    rolemenuload() {
      let para = {
        roleId: this.roleid,
      };
      roleMenuList(para).then((res) => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error",
          });
        } else {
          let recordarr = res.body;
          recordarr.sort(function (a, b) {
            return a.sort - b.sort;
          });
          let recordnewarr1 = [];
          let recordnewarr2 = [];
          let recordnewarr3 = [];
          for (let i = 0; i < recordarr.length; i++) {
            if (recordarr[i].sort < "10") {
              recordarr[i].icon = recordarr[i].icon.split(" ");
              recordnewarr1.push(recordarr[i]);
            }
            if (recordarr[i].sort > "10" && recordarr[i].sort < "100") {
              recordnewarr2.push(recordarr[i]);
            }
            if (recordarr[i].sort > "100" && recordarr[i].sort < "1000") {
              recordnewarr3.push(recordarr[i]);
            }
          }
          for (let j = 0; j < recordnewarr2.length; j++) {
            recordnewarr2[j]["children"] = [];
            for (let x = 0; x < recordnewarr3.length; x++) {
              if (recordnewarr2[j].menuId == recordnewarr3[x].parentId) {
                recordnewarr2[j]["children"].push(recordnewarr3[x]);
              }
            }
          }
          for (let a = 0; a < recordnewarr1.length; a++) {
            recordnewarr1[a]["children"] = [];
            let num1 = 0;
            for (let b = 0; b < recordnewarr2.length; b++) {
              if (recordnewarr1[a].menuId == recordnewarr2[b].parentId) {
                if (recordnewarr2[b].isShow == "1") {
                  num1++;
                }
                recordnewarr1[a]["children"].push(recordnewarr2[b]);
              }
              if (b == recordnewarr2.length - 1) {
                recordnewarr1[a]["childrenNum"] = num1;
              }
            }
          }
          // console.log(recordnewarr1)
          this.routeData = recordnewarr1;
          // 判断当前选中并展开菜单
          for (let i = 0; i < this.routeData.length; i++) {
            if (this.routeData[i].href == this.$route.path) {
              this.menuarr.push(i + "");
            } else {
              for (let j = 0; j < this.routeData[i].children.length; j++) {
                if (this.routeData[i].children[j].href == this.$route.path) {
                  this.menuarr.push(i + "");
                }
              }
            }
          }
          this.$store.dispatch("setPowerFun", recordnewarr1);
        }
      });
    },
    handleopen() {
      console.log("handleopen");
    },
    handleclose() {
      console.log("handleclose");
    },
    handleselect(key, keypath) {
      let that = this
      if (this.$route.path == "/storeview") {
        if (
          !localStorage.getItem("storeviewsave") &&
          localStorage.getItem("isFirst") == 1 &&
          localStorage.getItem("isAdmin") == 1
        ) {
          //
          this.$alert("请先修改并保存销售店的下单设置", "温馨提示", {
            confirmButtonText: "确定",
            callback: (action) => {
            },
          });
           return;
        }

       
      }
      this.$router.push({
        path: key,
      });
    },
    // 修改密码
    changepass() {
      this.$router.push({ path: "/changepass" });
    },
    // 退出登录
    logout() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("userId"); // 用户ID
          localStorage.removeItem("token"); // token
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    // 折叠导航栏
    collapse() {
      this.collapsed = !this.collapsed;
    },
    // 刷新
    shuaxin() {
      window.location.reload();
    },
    // 返回
    fanhui() {
      window.history.go(-1);
    },
  },
  beforeRouteEnter(to, from, next) {
    let localToken = localStorage.getItem("token");
    if (localToken) {
      next();
    } else {
      next({
        path: "/login",
      });
    }
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 100%;
  overflow: hidden;
  .el-header {
    color: #999999;
    line-height: 70px;
    text-align: right;
    padding-left: 0;
    border-bottom: 2px solid #f5f5f5;
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .userinfo {
      float: right;
      height: 70px;
      .userinfo-inner {
        display: inline-block;
        cursor: pointer;
        color: #999999;
        height: 70px;
        span {
          font-size: 12px;
          font-weight: bold;
        }
        i {
          font-weight: bolder;
          margin-left: 3px;
          padding-right: 15px;
        }
        img {
          height: 20px;
          width: 20px;
          border-radius: 20px;
          float: left;
          padding-left: 10px;
          margin: 25px 10px 25px 0;
        }
      }
      .loginout {
        float: right;
        padding: 0 10px;
        i {
          font-size: 20px;
          font-weight: 900;
        }
      }
      .userinfo-inner:hover,
      .loginout:hover {
        background: #f3f3f3;
      }
    }
    .logo {
      height: 70px;
      text-align: left;
      border-right: 1px solid #e4e4e4;
      span {
        font-size: 18px;
      }
      img {
        float: left;
        width: 40px;
        height: 40px;
        margin: 15px;
      }
    }
    .menus {
      padding: 0px 23px;
      width: 14px;
      cursor: pointer;
    }
  }
  .el-container {
    .el-aside {
      border-right: solid 1px #e6e6e6;
      background-color: #fff;
      color: #666;
      overflow: hidden;
      .el-menu {
        border-right: none;
      }
      .el-menu-item.is-active {
        color: #0079fe;
        background: #e6f2ff;
        border-right: 4px solid #0079fe;
      }
      .fa-fw {
        width: 24px;
        font-size: 16px;
      }
      .el-menu-item:hover {
        i {
          color: #0079fe;
          background: #fff;
        }
        color: #0079fe;
        background: #fff;
      }
    }
    .content-container {
      width: 100%;
      background: #f0f2f5;
      padding: 0;
      flex: 1;
      overflow-y: auto;
      .breadcrumb-container {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        background: #fff;
        border-bottom: 1px solid #e9e9e9;
        .title-left {
          .line {
            float: left;
            width: 4px;
            height: 20px;
            background: #0079fe;
            margin-top: 15px;
          }
          .title {
            float: left;
            font-size: 16px;
            color: #999;
            text-indent: 5px;
          }
        }
        .title-right {
          float: right;
          .el-button--small {
            padding: 8px 10px;
          }
        }
      }
      .content-wrapper {
        box-sizing: border-box;
        padding: 20px 20px;
        .hometext {
          padding: 10px;
        }
      }
    }
  }
}
</style>
