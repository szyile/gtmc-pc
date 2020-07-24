<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">{{activeid == undefined ? "创建" : "修改"}}关联活动</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="100px" class="el-found" ref="formName">
      <el-form-item prop="activityName" label="活动名称：">
        <el-input maxlength="32" v-model="form.activityName" placeholder="请填写活动名称"></el-input><br>
        <!-- <i class="el-icon-info">活动名称只是作为辨别多个活动条目之用，并不显示在前台中</i> -->
      </el-form-item>
      <el-form-item prop="iclubEventId" label="活动ID：">
        <el-input v-model="form.iclubEventId" placeholder="请填写活动ID" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item prop="startTime" label="开始时间：">
        <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime" label="到期时间：">
        <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择到期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="discountType" label="优惠政策：">
        <el-radio-group v-model="form.discountType" @change="change_value">
          <p>
            <el-radio :label="'1'">免单</el-radio>
          </p>
          <p>
            <el-radio :label="'2'">订单折扣</el-radio>
            <el-select :disabled="form.discountType == '2' ? false : true" v-model="form.discount2"
              placeholder="请选择折扣比例">
              <el-option label="9.5折" value="0.95"></el-option>
              <el-option label="9折" value="0.90"></el-option>
              <el-option label="8.5折" value="0.85"></el-option>
              <el-option label="8折" value="0.80"></el-option>
              <el-option label="5折" value="0.50"></el-option>
            </el-select>
          </p>
          <p>
            <el-radio :label="'3'">减免金额</el-radio>
            <el-input :disabled="form.discountType == '3' ? false : true" maxlength="10" v-model="form.discount3"
              placeholder="请填写减免金额,例如12345678.00"></el-input>
          </p>
          <p>
            <el-radio :label="'5'">赠送优惠券</el-radio>
            <el-input :disabled="form.discountType == '5' ? false : true" maxlength="20" v-model="form.discount5"
              placeholder="请填写优惠券批次ID"></el-input>
          </p>
          <p>
            <el-radio :label="'6'">赠送积分</el-radio>
            <el-input :disabled="form.discountType == '6' ? false : true"  maxlength="7" v-model="form.discount6"
              placeholder="请填写赠送积分金额"></el-input>
          </p>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="activityStatus" label="状态：">
        <el-switch active-value="2" inactive-value="1" v-model="form.activityStatus">
        </el-switch>
      </el-form-item>
      <el-form-item prop="remarks" label="备注：">
        <el-input type="textarea" placeholder="请输入备注" maxlength="300" @input="change_num" v-model="form.remarks">
        </el-input>
        <i class="strnum">已输入{{stringnum}}/300</i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addActive, activeDetail, updateActive } from "../../api/api";
import {isNum,isInteger,isValidStr} from "@/utils"
export default {
  data() {
    return {
      activeid: "",
      form: {
        activityName: "",
        iclubEventId: "",
        startTime: "",
        endTime: "",
        discountType: "",
        discount1: "0",
        discount2: "",
        discount3: "",
        discount5: "",
        discount6: "",
        activityStatus: "",
        remarks: ""
      },
      FormRules: {
        activityName: [
          { required: true, message: "活动名称不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "活动名称不能是空格",
            trigger: "blur"
          }
        ],
        iclubEventId: [
          { required: true, message: "活动ID不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "活动ID不能是空格",
            trigger: "blur"
          }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "到期时间不能为空", trigger: "blur" }
        ],
        discountType: [
          { required: true, message: "优惠政策不能为空", trigger: "blur" }
        ],
        activityStatus: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        remarks: []
      },
      stringnum: 0
    };
  },
  mounted() {
    // 获取activeid
    this.activeid = this.$route.query.activeid;
    this.mianload();
  },
  computed:{

  },
  methods: {
    // 加载页面
    mianload() {
      if (this.activeid) {
        let para = {
          activityId: this.activeid
        };
        activeDetail(para).then(res => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error"
            });
          } else {
            console.log(11111111,res.body);
            
            this.form.iclubEventId = res.body.iclubEventId;
            this.form.activityName = res.body.activityName;
            this.form.startTime = res.body.startTime;
            this.form.endTime = res.body.endTime;
            this.form.activityStatus = res.body.activityStatus;
            this.form.remarks = res.body.remarks;
            this.change_num();
            this.form.discountType = res.body.discountType;
            if (res.body.discountType == "2") {
              this.form.discount2 = res.body.discount;
            }
            if (res.body.discountType == "3") {
              this.form.discount3 = res.body.discount;
            }
            if (res.body.discountType == "5") {
              this.form.discount5 = res.body.discount;
            }
            if (res.body.discountType == "6") {
              this.form.discount6 = res.body.discount;
            }
          }
        });
      }
    },
    // 监听备注字数
    change_num() {
      this.stringnum = this.form.remarks.length;
    },
    // 监听单选按钮变化
    change_value() {
      this.form.discount2 = "";
      this.form.discount3 = "";
      this.form.discount5 = "";
      this.form.discount6 = "";
    },
    checkDiscount(para){
          if (para.discountType == "1") {
                para.discount = this.form.discount1;
              } else if (para.discountType == "2") {
                para.discount = this.form.discount2;
              } else if (para.discountType == "3") {
                para.discount = this.form.discount3;
              } else if (para.discountType == "5") {
                para.discount = this.form.discount5;
              } else if (para.discountType == "6") {
                para.discount = this.form.discount6;
              }
              if (para.discount == "") {
                this.$message({
                  offset: 100,
                  message: "请填写具体优惠政策！",
                  type: "warning"
                });
                return false;
              }

               if (para.discountType == "1") {
              } else if (para.discountType == "2") {
                  
              } else if (para.discountType == "3") {
                if(!isNum(para.discount)){
                    this.$message({
                  offset: 100,
                  message: "请输入正确的减免金额",
                  type: "warning"
                });
                return false;
                }
                if(parseFloat(para.discount)>=10000000){
                  this.$message({
                  offset: 100,
                  message: "减免金额最大值不能超过10000000",
                  type: "warning"
                });
                return false;
                }
              } else if (para.discountType == "5") {
                if(!isValidStr(para.discount)){
                  this.$message({
                  offset: 100,
                  message: "请输入正确的优惠券批次ID",
                  type: "warning"
                });
                return false;
                }
                if(para.discount.length>20){
                  this.$message({
                  offset: 100,
                  message: "优惠券批次ID长度不能超过20位",
                  type: "warning"
                });
                return false;
                }
              } else if (para.discountType == "6") {
                if(!isInteger(para.discount)){
                this.$message({
                  offset: 100,
                  message: "请输入正确的赠送积分",
                  type: "warning"
                });
                return false;
                }
                if(parseFloat(para.discount)>=10000000){
                  this.$message({
                  offset: 100,
                  message: "赠送积分最大值不能超过10000000",
                  type: "warning"
                });
                return false;
                }
              }
    
     return true 
    },
    // 保存
    onSubmit() {
      this.$refs["formName"].validate(valid => {
        if (valid) {
          if (this.form.startTime < this.form.endTime) {
            if (this.activeid) {
              // 编辑
              let para = {
                customerId: localStorage.getItem("userId"),
                activityId: this.activeid,
                activityName: this.form.activityName,
                iclubEventId: this.form.iclubEventId,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                discountType: this.form.discountType,
                discount: "",
                activityStatus: this.form.activityStatus,
                remarks: this.form.remarks
              };
/*               if (para.discountType == "1") {
                para.discount = this.form.discount1;
              } else if (para.discountType == "2") {
                para.discount = this.form.discount2;
              } else if (para.discountType == "3") {
                para.discount = this.form.discount3;
              } else if (para.discountType == "5") {
                para.discount = this.form.discount5;
              } else if (para.discountType == "6") {
                para.discount = this.form.discount6;
              } */
              if (/* para.discount == "" */!this.checkDiscount(para)) {
       /*          this.$message({
                  offset: 100,
                  message: "请填写具体优惠政策！",
                  type: "warning"
                }); */
                return false
              } else {
                updateActive(para).then(res => {
                  if (res.header.code !== 10000000) {
                    this.$message({
                      offset: 100,
                      message: res.header.message,
                      type: "error"
                    });
                    return false;
                  } else {
                    this.$message({
                      offset: 100,
                      message: "修改成功！",
                      type: "success"
                    });
                    let _this = this;
                    setTimeout(function() {
                      _this.$router.push({
                        path: "/activelist"
                      });
                    }, 1000);
                  }
                });
              }
            } else {
              // 新增
              let para = {
                customerId: localStorage.getItem("userId"),
                activityName: this.form.activityName,
                iclubEventId: this.form.iclubEventId,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                discountType: this.form.discountType,
                discount: "",
                activityStatus: this.form.activityStatus,
                remarks: this.form.remarks
              };
/*               if (para.discountType == "1") {
                para.discount = this.form.discount1;
              } else if (para.discountType == "2") {
                para.discount = this.form.discount2;
              } else if (para.discountType == "3") {
                para.discount = this.form.discount3;
              } else if (para.discountType == "5") {
                para.discount = this.form.discount5;
              } else if (para.discountType == "6") {
                para.discount = this.form.discount6;
              } */
              if (/* para.discount == "" */!this.checkDiscount(para)) {
/*                 this.$message({
                  offset: 100,
                  message: "请填写具体优惠政策！",
                  type: "warning"
                }); */
                return false;
              } else {
                addActive(para).then(res => {
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
                    setTimeout(function() {
                      _this.$router.push({
                        path: "/activelist"
                      });
                    }, 1000);
                  }
                });
              }
            }
          } else {
            this.$message({
              offset: 100,
              type: "warning",
              message: "活动的到期时间不得早于开始时间!"
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
    },
    // 取消
    resetForm() {
      this.$confirm("即将离开页面，请确认", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$router.push({
            path: "/activelist"
          });
        })
        .catch(() => {});
    }
  },
  beforeRouteEnter(to, from, next) {
    let activeidx = to.query.activeid;
    if (activeidx == undefined) {
      to.meta.title = "创建关联活动";
    } else {
      to.meta.title = "修改关联活动";
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
      position: relative;
      .el-input {
        width: 80%;
      }
      .el-radio-group {
        width: 80%;
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0;
          .el-input {
            width: 80%;
          }
          .el-select {
            width: 80%;
          }
        }
      }
      .el-icon-info {
        font-size: 12px;
        color: #a1a1a1;
      }
      .el-textarea {
        width: 80%;
        height: 120px;
        border: 1px solid #d7d7d7;
        border-radius: 3px;
      }
      .strnum {
        position: absolute;
        bottom: 20px;
        left: 65%;
        color: #e0e0e0;
        height: 10px;
      }
    }
  }
}
</style>