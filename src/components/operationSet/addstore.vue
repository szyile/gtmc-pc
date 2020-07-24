<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">{{dealerid == undefined ? "添加" : "修改"}}门店</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="150px" class="el-found" ref="formName">
      <el-form-item prop="dealerName" label="门店名称：">
        <el-input v-model="form.dealerName" placeholder="请填写门店名称" maxlength="32"></el-input><br>
        <i class="el-icon-info">门店名称只是作为辨别多个门店条目之用，并不显示在前台中</i>
      </el-form-item>
      <el-form-item prop="dealerCode" label="门店代码ID：">
        <el-input v-model="form.dealerCode" placeholder="请填写门店代码ID" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item prop="dealerRel" label="门店联系人：">
        <el-input v-model="form.dealerRel" placeholder="门店联系人" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item prop="dealerTel" label="联系人电话：">
        <el-input v-model="form.dealerTel" placeholder="联系人电话" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态：">
        <el-switch active-value="2" inactive-value="1" v-model="form.status">
        </el-switch>
      </el-form-item>
      <el-form-item prop="dealerType" label="销售店取送车下单设置：">
        <el-radio-group v-model="form.dealerType">
          <el-radio :label="'1'">自动</el-radio>
          <el-radio :label="'0'">手动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="remarks" label="备注：">
        <el-input type="textarea" placeholder="请输入备注" maxlength="300" @input="change_num" v-model="form.remarks">
        </el-input>
        <i class="strnum">已输入{{stringnum}}/300</i>
      </el-form-item>
      <el-form-item>
<!--        <el-button type="primary" @click="onSubmit">保存</el-button>-->
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addStore, storeDetail, storeDetailByCode, editStore} from "../../api/api";
export default {
  data() {
    return {
      dealerid: "",
      form: {
        dealerId: "",
        dealerCode: "", // 门店代码id
        dealerName: "", // 门店名称
        dealerRel: "", // 门店联系人
        dealerTel: "", // 门店联系人电话
        status: "", // 状态
        remarks: "", // 备注
        dealerType: ""//下单状态
      },
      FormRules: {
        dealerName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店名称不能是空格",
            trigger: "blur"
          }
        ],
        dealerCode: [
          { required: true, message: "门店代码ID不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店代码ID不能是空格",
            trigger: "blur"
          }
        ],
        dealerRel: [
          { required: true, message: "门店联系人不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店联系人不能是空格",
            trigger: "blur"
          }
        ],
        dealerTel: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        remarks: []
      },
      stringnum: 0
    };
  },
  mounted() {
    //获取dealerid
    let roleCode = localStorage.getItem("roleCode");
    if(roleCode == 'storeManager'){
      let para = {
        dealerCode: localStorage.getItem("loginName")
      };
      storeDetailByCode(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.form.dealerCode = res.body.dealerCode;
          this.form.dealerName = res.body.dealerName;
          this.form.dealerRel = res.body.dealerRel;
          this.form.dealerTel = res.body.dealerTel;
          this.form.status = res.body.status;
          this.form.dealerType = res.body.dealerType;
          this.form.remarks = res.body.remarks;
          this.change_num();
        }
      });
    } else {
      this.dealerid = this.$route.query.dealerid;
      this.mianload();
    }
  },
  methods: {
    // 加载页面
    mianload() {
      if (this.dealerid) {
        let para = {
          dealerId: this.dealerid
        };
        storeDetail(para).then(res => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error"
            });
          } else {
            this.form.dealerCode = res.body.dealerCode;
            this.form.dealerName = res.body.dealerName;
            this.form.dealerRel = res.body.dealerRel;
            this.form.dealerTel = res.body.dealerTel;
            this.form.status = res.body.status;
            this.form.dealerType = res.body.dealerType;
            this.form.remarks = res.body.remarks;
            this.change_num();
          }
        });
      }
    },
    // 监听备注字数
    change_num() {
      this.stringnum = this.form.remarks.length;
    },
    // 保存
    onSubmit() {
        this.$refs["formName"].validate(valid => {
          if (valid) {
            let para = this.form;
            if (this.dealerid) {
              if (confirm("1.取送车向代驾商下单是否为自动或者手动的功能设置一年只能修改3次，超过3次之后则一年内不能进行修改。\n" +
                "\n" +
                "2.取送车向代驾商下单是否为自动或者手动的功能设置时间间隔要超过一个月，使用该功能之后一个月的时间内不能修改该功能。", "温馨提示")) {
              // 编辑
              para.dealerId = this.dealerid;
              editStore(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                } else {
                  this.$message({
                    offset: 100,
                    message: "修改成功！",
                    type: "success"
                  });
                  let _this = this;
                  setTimeout(function () {
                    _this.$router.push({
                      path: "/storelist"
                    });
                  }, 1000);
                }
              });
              }
            } else {
              // 新增
              addStore(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                } else {
                  this.$message({
                    offset: 100,
                    message: "添加成功！",
                    type: "success"
                  });
                  let _this = this;
                  setTimeout(function () {
                    _this.$router.push({
                      path: "/storelist"
                    });
                  }, 1000);
                }
              });
            }
          } else {
            this.$message({
              offset: 100,
              type: "warning",
              message: "信息录入格式不正确，请检查!"
            });
          }
        });
      }
    ,
    // 取消
    resetForm() {
      this.$confirm("即将离开页面，请确认", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$router.push({
            path: "/storelist"
          });
        })
        .catch(() => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    let dealeridx = to.query.dealerid;
    if (dealeridx == undefined) {
      to.meta.title = "添加门店";
    } else {
      to.meta.title = "修改门店";
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
        color: #ff0000;
      }
    }
  }
  .el-form {
    padding: 50px 100px;
    .el-form-item {
      position: relative;
      .el-input {
        width: 30%;
      }
      .el-icon-info {
        font-size: 12px;
        color: #a1a1a1;
      }
      .el-textarea {
        width: 500px;
        height: 120px;
        border: 1px solid #d7d7d7;
        border-radius: 3px;
      }
      .strnum {
        position: absolute;
        bottom: 20px;
        left: 408px;
        color: #e0e0e0;
        height: 10px;
      }
    }
  }
}
</style>
