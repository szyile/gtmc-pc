<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">修改密码</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="100px" ref="formName">
      <el-form-item prop="oldpass" label="旧密码：">
        <el-input type="password" placeholder="请输入旧密码" autocomplete="off" v-model="form.oldpass"  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item prop="newpass" label="新密码：">
        <el-input type="password" placeholder="密码为8~20位，由字母、数字、_#@!~%^&*组成" autocomplete="off" v-model="form.newpass" maxlength="20"><span color="red">密码为8~20位，由字母、数字、_#@!~%^&*组成</span></el-input>
      </el-form-item>
      <el-form-item prop="referpass" label="确认密码：">
        <el-input type="password" placeholder="密码为8~20位，由字母、数字、_#@!~%^&*组成" autocomplete="off" v-model="form.referpass" maxlength="20"><span color="red">密码为8~20位，由字母、数字、_#@!~%^&*组成</span></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { changePassword } from "../../api/api";
import md5 from 'js-md5';
export default {
  data() {
    return {
      form: {
        oldpass: "",
        newpass: "",
        referpass: ""
      },
      FormRules: {
        oldpass: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }/* ,
          {
            pattern: /(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,20}/,
            message: "密码长度为8-20位 数字+字母+特殊字符",
            trigger: "blur"
          } */
        ],
        newpass: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_])[\da-zA-Z~!@#$%^&*_]{8,20}$/,
            message: "密码为8~20位，由字母、数字、_#@!~%^&*组成",
            trigger: "blur"
          }
        ],
        referpass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_])[\da-zA-Z~!@#$%^&*_]{8,20}$/,
            message: "密码为8~20位，由字母、数字、_#@!~%^&*组成",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 保存
    onSubmit() {
      this.$refs["formName"].validate(valid => {
        if (valid) {
          if (this.form.newpass != this.form.referpass) {
            this.$message({
              offset: 100,
              type: "warning",
              message: "两次输入的密码不一致!"
            });
            return false;
          } else {
            let para = {
              userId: localStorage.getItem("userId"),
              oldPassword: md5(this.form.oldpass),
              newPassword: md5(this.form.newpass)
            };
            changePassword(para).then(res => {
              if (res.header.code !== 10000000) {
                this.$message({
                  offset: 100,
                  message: res.header.message,
                  type: "error"
                });
              } else {
                let _this = this;
                this.$message({
                  offset: 100,
                  message: "修改成功，即将跳转登录...",
                  type: "success"
                });
                setTimeout(function() {
                  localStorage.removeItem("userId"); // 用户ID
                  localStorage.removeItem("token"); // token
                  _this.$router.push("/login");
                }, 2000);
              }
            });
          }
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "请输入符合规则的信息!"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.main-wrap {
  background: #ffffff;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-weight: 700;
      font-size: 16px;
    }
    .right {
      color: #999999;
      i {
        margin-right: 5px;
        color: red;
      }
    }
  }
  .el-form {
    padding: 20px 50px;
    .el-form-item {
      .el-input {
        width: 50%;
      }
      .el-form-item__content {
        .el-button {
          padding: 10px 30px;
        }
      }
    }
  }
}
</style>