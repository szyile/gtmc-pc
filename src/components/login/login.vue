<template>
  <div class="main">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-container">
      <img class="logo" src="../../../static/images/home/logo.png" alt="">
      <h3 class="title">取送车管理后台</h3>
      <el-form-item prop="loginName">
        <el-input type="text" class="el-login-input" @keyup.enter.native="handleSubmit" prefix-icon="fa fa-user-circle-o"
          v-model="ruleForm.loginName" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" class="el-login-input" @keyup.enter.native="handleSubmit" prefix-icon="fa fa-lock"
          v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="checkpass">
        <el-input class="yzmpass" type="text" v-model="ruleForm.checkpass" auto-complete="off" @keyup.enter.native="handleSubmit"
          placeholder="请输入验证码">
        </el-input>
        <img class="yzmimg" @click="getCaptcha" :src="yzmimg" alt="">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleSubmit" :loading="logining">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { yzmLogin, requestLogin } from "../../api/api";
import md5 from "js-md5";
export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        loginName: "",
        password: "",
        checkpass: ""
      },
      rules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkpass: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      yzmimg: "",
      hashcode: ""
    };
  },
  mounted() {
    this.getCaptcha();
  },
  methods: {
    // 获取浏览器版本
    getbrowser() {
      let browser = {};
      let userAgent = navigator.userAgent.toLowerCase();
      let s;
      (s = userAgent.match(/edge\/([\d.]+)/)) ? (browser.edge = s[1]) :
      (s = userAgent.match(/rv:([\d.]+)\) like gecko/)) ?( browser.ie = s[1]):
      (s = userAgent.match(/msie ([\d.]+)/))? (browser.ie = s[1]):
      (s = userAgent.match(/firefox\/([\d.]+)/))? (browser.firefox = s[1]):
      (s = userAgent.match(/chrome\/([\d.]+)/))
        ? (browser.chrome = s[1])
        : (s = userAgent.match(/opera.([\d.]+)/))
        ? (browser.opera = s[1])
        : (s = userAgent.match(/version\/([\d.]+).*safari/))
        ? (browser.safari = s[1])
        : 0;
      let version = "";
      if (browser.edge)  {
        version ="Edge"+ browser.edge
      }else
      if (browser.ie) {
        version = "IE " + browser.ie;
      } else {
        if (browser.firefox) {
          version = "firefox " + browser.firefox;
        } else {
          if (browser.chrome) {
            version = "chrome " + browser.chrome;
          } else {
            if (browser.opera) {
              version = "opera " + browser.opera;
            } else {
              if (browser.safari) {
                version = "safari " + browser.safari;
              } else {
                version = "未知浏览器";
              }
            }
          }
        }
      }
      return version;
    },
    // 获取操作系统版本
    getsystem() {
      let sUserAgent = navigator.userAgent;
      let isWin =
        navigator.platform == "Win32" || navigator.platform == "Windows";
      let isMac =
        navigator.platform == "Mac68K" ||
        navigator.platform == "MacPPC" ||
        navigator.platform == "Macintosh" ||
        navigator.platform == "MacIntel";
      if (isMac) return "Mac";
      let isUnix = navigator.platform == "X11" && !isWin && !isMac;
      if (isUnix) return "Unix";
      let isLinux = String(navigator.platform).indexOf("Linux") > -1;
      if (isLinux) return "Linux";
      if (isWin) {
        let isWin2K =
          sUserAgent.indexOf("Windows NT 5.0") > -1 ||
          sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        let isWinXP =
          sUserAgent.indexOf("Windows NT 5.1") > -1 ||
          sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        let isWin2003 =
          sUserAgent.indexOf("Windows NT 5.2") > -1 ||
          sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        let isWinVista =
          sUserAgent.indexOf("Windows NT 6.0") > -1 ||
          sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        let isWin7 =
          sUserAgent.indexOf("Windows NT 6.1") > -1 ||
          sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        let isWin10 =
          sUserAgent.indexOf("Windows NT 10") > -1 ||
          sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10) return "Win10";
      }
      return "other";
    },
    // 获取验证码图片
    getCaptcha() {
      yzmLogin({}).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.yzmimg = res.body.img;
          this.hashcode = res.body.hashcode;
        }
      });
      this.ruleForm.checkpass = "";
    },
    // 登录
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let para = {
            loginName: this.ruleForm.loginName,
            password: md5(this.ruleForm.password),
            // loginIp: "192.168.10.10",
            browser: this.getbrowser(),
            operatingSystem: this.getsystem(),
            captcha: this.ruleForm.checkpass,
            hashcode: this.hashcode
          };
          this.logining = true;
          requestLogin(para).then(res => {
            if (res.header.code !== 10000000) {
              this.$message({
                offset: 100,
                message: res.header.message,
                type: "error"
              });
              if (res.header.message.indexOf("验证码") > -1) {
                this.getCaptcha();
              }
            } else {
              localStorage.setItem("userId", res.body.userId); // 用户ID
              localStorage.setItem("loginName", res.body.loginName); // 用户登录名
              localStorage.setItem("token",res.body.token||''); // token
              this.$router.push({ path: "/orderlist" });
            }
            this.logining = false;
          });
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "请输入完整信息!"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  background-image: url("../../../static/images/login/loginback.png");
  background-size: 100% 50%;
  background-repeat: no-repeat;
  .login-container {
    width: 300px;
    height: 480px;
    padding: 40px 60px 70px;
    background: #fff;
    box-shadow: 0 0 10px #cac6c6;
    position: absolute;
    top: 170px;
    left: 50%;
    margin-left: -150px;
    .logo {
      display: block;
      width: 115px;
      height: 115px;
      margin: 0 auto;
    }
    .title {
      font-size: 26px;
      margin: 55px auto 50px;
      text-align: center;
      color: #0079fe;
    }
    .el-form-item {
      .yzmpass {
        width: 50%;
      }
      .yzmimg {
        float: right;
        width: 40%;
        height: 40px;
      }
      .el-button--primary {
        border-radius: 3px;
        height: 40px;
        width: 100%;
        font-size: 18px;
      }
    }
    .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
