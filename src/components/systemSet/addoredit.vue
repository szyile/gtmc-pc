<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">{{userid == undefined ? "新增" : "修改"}}信息</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="100px" ref="formName" v-loading="formLoading">
      <el-form-item prop="loginName" label="登录账号：">
        <el-input v-model.trim="form.loginName" autocomplete="off" maxlength=32 placeholder="请填写登录账号"></el-input>
      </el-form-item>
      <el-form-item v-if="!userid" prop="password" label="登录密码：">
        <el-input type="text"  onfocus="this.type='password'"  autocomplete="off" v-model="form.password" maxlength="20" placeholder="密码为8~20位，由字母、数字、_#@!~%^&*组成"></el-input>
      </el-form-item>
      <el-form-item v-if="userid" label="登录密码：">
        <el-input type="password" autocomplete="off" :disabled="true" v-model="form.password"  maxlength="20" placeholder="密码为8~20位，由字母、数字、_#@!~%^&*组成"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="员工姓名：">
        <el-input v-model.trim="form.name" placeholder="请填写员工姓名" :title="form.name" maxlength=32></el-input>
      </el-form-item>
      <el-form-item prop="sex" label="员工性别：">
        <el-radio-group v-model="form.sex">
          <el-radio :label="'1'">男</el-radio>
          <el-radio :label="'0'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phone" label="手机号码：">
        <el-input v-model="form.phone" placeholder="请填写手机号码" maxlength=11></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱地址：">
        <el-input v-model="form.email" placeholder="请填写邮箱地址" :title="form.email"  maxlength=32></el-input>
      </el-form-item>
      <el-form-item prop="roleId" label="用户角色：">
        <el-select v-model="form.roleId" placeholder="请选择当前角色"  :disabled="userid">
          <el-option v-for="(item,index) in roledata" :key="index" :label="item.name" :value="item.roleId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="resetForm" v-if="!userid">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addUser, userDetail, editUser, roleList } from "../../api/api";
import md5 from "js-md5";
export default {
  data() {
    return {
      // 表单数据
      form: {
        loginName: "",
        password: "",
        name: "",
        sex: "",
        phone: "",
        email: "",
        roleId: ""
      },
      FormRules: {
        loginName: [
          { required: true, message: "登录账号不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "登录账号不能是空格",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_])[\da-zA-Z~!@#$%^&*_]{8,20}$/,
            message: "密码为8~20位，由字母、数字、_#@!~%^&*组成",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "员工姓名不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "员工姓名不能是空格",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "用户角色不能为空", trigger: "blur" }
        ]
      },
      // 角色列表
      roledata: [],
      userid: "",
      formLoading: false
    };
  },
  mounted() {
    // 获取userid
    this.userid = this.$route.query.userid;
    this.mianload();
    this.getRoleData();
  },
  methods: {
    // 加载页面
    mianload() {
      if (this.userid != undefined) {
        let para = {
          userId: this.userid
        };
        this.formLoading = true;
        userDetail(para).then(res => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error"
            });
          } else {
            this.form.loginName = res.body.loginName;
            this.form.name = res.body.name;
            this.form.sex = res.body.sex;
            this.form.phone = res.body.phone;
            this.form.email = res.body.email;
            this.form.roleId = res.body.roleId;
            this.form.password = res.body.password; //密码特殊处理
          }
          this.formLoading = false;
        });
      } else {
        this.form.loginName = "";
        this.form.name = "";
        this.form.sex = "1";
        this.form.phone = "";
        this.form.email = "";
        this.form.roleId = "";
        this.form.password = ""; //密码特殊处理
      }
    },
    //获取角色列表
    getRoleData() {
      let para = {
        current: "1",
        size: "1000"
      };
      roleList(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.roledata = res.body.records;
        }
      });
    },
    // 保存
    onSubmit() {
      this.$refs["formName"].validate(valid => {
        if (valid) {
          if (this.userid) {
            // 编辑
            let para = {
              userId:this.userid,
/*               photo:''	,//否	string	V32	头像
              corpId:'',	//否	string	V32	归属销售店
              vspCorpId:'',	//否	string	V32	归属运营商id
              number:'',	//否	string	V32	工号	 */
              name:this.form.name,	//否	string	V32	姓名
              loginName:this.form.loginName,
              email:this.form.email,
              phone:this.form.phone,
/*               loginFlag:'',//	否	string	V32	是否允许登录 0否 1是
              userType:'',//	否	string	V32	1厂商 2运营商 3销售店 4担当 5gms销售人员
              remark:'',//	否	string	V32	备注 */
              sex:this.form.sex
            };
/*             para.password = md5(this.form.password);
            para.userId = this.userid; */
            editUser(para).then(res => {
              if (res.header.code !== 10000000) {
                this.$message({
                  offset: 100,
                  message: res.header.message,
                  type: "error"
                });
              } else {
                this.$message({
                  offset: 100,
                  type: "success",
                  message: "修改成功！"
                });
                let _this = this;
                setTimeout(function() {
                  _this.$router.push({
                    path: "/userset"
                  });
                }, 1000);
              }
            });
          } else {
            // 添加
             let para = {
/*               photo:''	,//否	string	V32	头像
              corpId:'',	//否	string	V32	归属销售店
              vspCorpId:'',	//否	string	V32	归属运营商id
              number:'',	//否	string	V32	工号	 */
              name:this.form.name,	//否	string	V32	姓名
              loginName:this.form.loginName,
              password:md5(this.form.password),
              email:this.form.email,
              phone:this.form.phone,
              roleId:this.form.roleId,
/*               loginFlag:'',//	否	string	V32	是否允许登录 0否 1是
              userType:'',//	否	string	V32	1厂商 2运营商 3销售店 4担当 5gms销售人员
              remark:'',//	否	string	V32	备注 */
              sex:this.form.sex
            };
            //para.password = md5(this.form.password);
            addUser(para).then(res => {
              if (res.header.code !== 10000000) {
                this.$message({
                  offset: 100,
                  message: res.header.message,
                  type: "error"
                });
              } else {
                this.$message({
                  offset: 100,
                  type: "success",
                  message: "添加成功！"
                });
                let _this = this;
                setTimeout(function() {
                  _this.$router.push({
                    path: "/userset"
                  });
                }, 1000);
              }
            });
          }
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "请输入符合规则的信息！"
          });
        }
      });
    },
    // 重置
    resetForm() {
      if (this.userid == undefined) {
        this.$refs["formName"].resetFields();
      } else {
        this.mianload();
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    let useridx = to.query.userid;
    if (useridx == undefined) {
      to.meta.title = "新增员工";
    } else {
      to.meta.title = "修改员工";
    }
    next();
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
    padding: 50px 100px;
    .el-form-item {
      .el-input {
        width: 60%;
      }
      .el-select {
        width: 60%;
      }
    }
  }
}
</style>
