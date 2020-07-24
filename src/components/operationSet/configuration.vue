<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">配置管理</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="250px" ref="formName" id="formName">
      <el-form-item label="单笔订单预扣积分金额">
      </el-form-item>
      <el-form-item label="当前预扣金额：">
        <span>{{form.changemoney}}积分</span>
      </el-form-item>
      <el-form-item prop="configValue" label="修改金额：">
        <el-input v-model="form.configValue" placeholder="请填写大于0的整数,最大值1000"  maxlength="4"></el-input>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="editNum">确认</el-button>
      </el-form-item>
      <el-form-item class="part2" label="是否验证门店申请开通">
      </el-form-item>
      <el-form-item label="是否开启验证：">
        <el-radio-group v-model="form.configValue1">
          <el-radio :label="'true'">开启验证</el-radio>
          <el-radio :label="'false'">关闭验证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { priceInfo, setPrice, checkOpen } from "../../api/api";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      form: {
        configId: "",
        configValue: "",
        configId1: "",
        configValue1: "",
        changemoney: ""
      },
      FormRules: {
        configValue: [
          {
            pattern: /^[1-9][0-9]{0,3}$/,
            message: "请填写大于0的整数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getnowmoney();
  },
  methods: {
    //获取当前预扣
    getnowmoney() {
      let para = {
        configKey: "score"
      };
      let loadingInstance = Loading.service({
        target: "#formName",
        fullscreen: false
      });
      priceInfo(para).then(res => {
        loadingInstance.close();
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].configKey == "score") {
              this.form.configId = res.body[i].configId;
              this.form.changemoney = res.body[i].configValue;
            }
            if (res.body[i].configKey == "dealer") {
              this.form.configId1 = res.body[i].configId;
              this.form.configValue1 = res.body[i].configValue;
            }
          }
        }
      });
    },
   editNum(){
       this.$refs["formName"].validate(valid => {         
        if (valid) {
            if(Number(this.form.configValue)>1000){
              this.$message({
            offset: 100,
            type: "warning",
            message: "配置值不能大于1000！"
          });
          return false;
            }
          this.$confirm("确认修改配置吗?", "提示", {
            type: "warning"
          }).then(() => {
              let issuccess = [];
              // 修改预扣积分金额
              let para = {
                configId: this.form.configId,
                configValue: this.form.configValue
              };
              setPrice(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    type: "error",
                    message: res.header.message
                  });
                  return false;
                }else{
                  this.getnowmoney();
                  this.form.configValue = "";
                } 
              });
            }).catch(() => {});
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "请输入大于0的整数！"
          });
          return false;
        }
      });
  },
  //修改开启验证门店
   onSubmit(){
       this.$refs["formName"].validate(valid => {
         console.log(1111111,valid);
         if(valid) {
           let para1 = {
            configId: this.form.configId1,
            configValue: this.form.configValue1
            };
            checkOpen(para1).then(res => {
              if (res.header.code !== 10000000) {
                this.$message({
                  offset: 100,
                  type: "error",
                  message: res.header.message
                });
                return false;
              } else {
                this.$message({
                  offset: 100,
                  type: "success",
                  message: "修改成功！"
                });
         }
         
       })
      }
    })
    },
        // 保存
    // onSubmit() {
    //   this.$refs["formName"].validate(valid => {
    //     if (valid) {
    //         if(Number(this.form.configValue)>1000){
    //           this.$message({
    //         offset: 100,
    //         type: "warning",
    //         message: "配置值不能大于1000！"
    //       });
    //       return false;
    //         }
    //       this.$confirm("确认修改配置吗?", "提示", {
    //         type: "warning"
    //       })
    //         .then(() => {
    //           let issuccess = [];
    //           // 修改预扣积分金额
    //           let para = {
    //             configId: this.form.configId,
    //             configValue: this.form.configValue
    //           };
    //           setPrice(para).then(res => {
    //             if (res.header.code !== 10000000) {
    //               this.$message({
    //                 offset: 100,
    //                 type: "error",
    //                 message: res.header.message
    //               });
    //               return false;
    //             } else {
    //               // 修改是否开通门店
    //               let para1 = {
    //                 configId: this.form.configId1,
    //                 configValue: this.form.configValue1
    //               };
    //               checkOpen(para1).then(res => {
    //                 if (res.header.code !== 10000000) {
    //                   this.$message({
    //                     offset: 100,
    //                     type: "error",
    //                     message: res.header.message
    //                   });
    //                   return false;
    //                 } else {
    //                   this.$message({
    //                     offset: 100,
    //                     type: "success",
    //                     message: "修改成功！"
    //                   });
    //                   this.getnowmoney();
    //                   this.form.configValue = "";
    //                 }
    //               });
    //             }
    //           });

    //           /*  // 判断两次是否都修改成功
    //           if (issuccess.length == 0) {
    //             this.$message({
    //               offset: 100,
    //               type: "success",
    //               message: "修改成功！"
    //             });
    //             this.getnowmoney();
    //             this.form.configValue = "";
    //           }
    //           if (issuccess.length == 1) {
    //             this.$message({
    //               offset: 100,
    //               type: "error",
    //               message: issuccess[0]
    //             });
    //           }
    //           if (issuccess.length == 2) {
    //             this.$message({
    //               offset: 100,
    //               type: "error",
    //               message: "提交失败"
    //             });
    //           } */
    //         })
    //         .catch(() => {});
    //     } else {
    //       this.$message({
    //         offset: 100,
    //         type: "warning",
    //         message: "请输入大于0的整数！"
    //       });
    //       return false;
    //     }
    //   });
    // }
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
        width: 30%;
      }
      .el-form-item__content {
        .el-button {
          padding: 10px 30px;
        }
      }
    }
    .part2 {
      margin-top: 80px;
    }
    .el-form-item:last-child {
      margin-top: 80px;
    }
  }
}
</style>