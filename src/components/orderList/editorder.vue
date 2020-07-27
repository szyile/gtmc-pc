<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">{{serviceType == 1 ? "取车" : "送车"}}服务</span>
      <span class="right">
        <i>*</i>为必填项
      </span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="180px" class="el-found" ref="formName">
      <el-form-item prop="startPoiAddress" label="出发地址：">
        <el-input v-model="form.startPoiAddress"></el-input>
        <br />
      </el-form-item>
      <!-- 上门取车，是客户到公司，所以出发地是客户地址，这里只能输入  -->
      <template v-if="serviceType == 1">
        <el-form-item prop="startPoiAddress" label="出发地联系人：">
          <el-input v-model="form.startMan"></el-input>
          <br />
        </el-form-item>
        <el-form-item prop="startManTel" label="出发地联系人手机号：">
          <el-input v-model="form.startManTel"></el-input>
          <br />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="startMan" label="出发地联系人：">
          <el-select
            v-model="form.startMan"
            placeholder="请选择出发地联系人"
            style="width:306px"
            @change="startChange"
          >
            <el-option
              v-for="(item,index) in objData"
              :key="index"
              :value="item.phone"
              :label="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right;">{{ item.phone }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="startManTel" label="出发地联系人手机号：">
          <el-input v-model="form.startManTel" :disabled="true"></el-input>
          <br />
        </el-form-item>
      </template>
      <el-form-item prop="endPoiAddress" label="目的地址：">
        <el-input v-model="form.endPoiAddress" :disabled="true"></el-input>
      </el-form-item>

      <!-- 上门取车，是客户到公司，所以这块需要显示的是店铺的联系人，可以进行选择 -->
      <template v-if="serviceType == 1 ">
        <el-form-item prop="endMan" label="目的地联系人：">
          <el-select
            v-model="form.endMan"
            placeholder="请选择目的地联系人"
            style="width:306px"
            @change="endChange"
          >
            <el-option
              v-for="(item,index) in objData"
              :key="index"
              :value="item.phone"
              :label="item.name"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right;">{{ item.phone }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="endManTel" label="目的地联系人手机号：">
          <el-input v-model="form.endManTel" placeholder="目的地联系人手机号"></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="endMan" label="目的地联系人：">
          <el-input v-model="form.endMan" placeholder="目的地联系人"></el-input>
        </el-form-item>
        <el-form-item prop="endManTel" label="目的地联系人手机号：">
          <el-input v-model="form.endManTel" placeholder="目的地联系人手机号"></el-input>
        </el-form-item>
      </template>
      <el-form-item prop="carNum" label="车牌号：">
        <el-input v-model="form.carNum" placeholder="请填写车牌号" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="orderTime" label=" 预约上门取车时间：">
        <el-date-picker
          v-model="form.orderTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择预约上门取车时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="estimateMP" label="预估里程及价格：">
        <el-input v-model="form.estimateMP"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" id="buttons">确认修改</el-button>
        <el-button @click="backListPage">返回上一页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  orderDetail,
  editOrder,
  returnCarMans,
  downOrder,
  newGetOrder,
  newPushOrder,
} from "../../api/api";

export default {
  data() {
    return {
      orderid: "", //订单id
      serviceType: "", //服务类型|1:取车;2:送车
      form: {
        orderId: "",
        //serviceType: "", // 服务类型|1:取车;2:送车
        startMan: "", // 出发地联系人
        endMan: "", // 目的地联系人
        carNum: "", // 车牌
        orderTime: "", // 预约上门取车时间
        estimateMP: "", //预估里程及金额
      },
      FormRules: {
        startMan: [
          { required: true, message: "出发地联系人不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "出发地联系人不能是空格",
            trigger: "blur",
          },
        ],
        endMan: [
          { required: true, message: "目的地联系人不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "目的地联系人不能是空格",
            trigger: "blur",
          },
        ],
        carNum: [
          { required: true, message: "车牌不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "车牌不能是空格",
            trigger: "blur",
          },
        ],
        orderTime: [
          {
            required: true,
            message: "预约上门取车时间不能为空",
            trigger: "blur",
          },
          {
            pattern: /^.*[^ ].*$/,
            message: "预约上门取车时间不能是空格",
            trigger: "blur",
          },
        ],
      },
      stringnum: 0,
      objData: [],
    };
  },
  mounted() {
    // 获取dealerid
    this.orderid = this.$route.query.orderid;
    this.orderid1 = this.$route.query.orderid1;
    this.serviceType = this.$route.query.serviceType;
    this.mianload();
    console.log("cookie:", document.cookie);
  },
  methods: {
    //加载页面
    mianload() {
      if (this.orderid) {
        var but = document.getElementById("buttons");
        but.innerHTML = "确认修改";
        let para = {
          orderId: this.orderid,
        };

        orderDetail(para).then((res) => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error",
            });
          } else {
            //this.serviceType = res.body.serviceType;//服务类型
            this.form.startPoiAddress = res.body.startPoiAddress;
            this.form.startMan = res.body.startMan;
            this.form.startManTel = res.body.startManTel;
            this.form.endPoiAddress = res.body.endPoiAddress;
            this.form.endMan = res.body.endMan;
            this.form.endManTel = res.body.endManTel;
            this.form.carNum = res.body.carNum;
            this.form.orderTime = res.body.orderTime;
            this.form.estimateMP =
              "本单预估里程" +
              res.body.actualMileage +
              "米,滴滴预估金额¥" +
              res.body.estimateMoney;

            this.getReturnCarManOpts(res.body.dealerCode);
          }
        });
      } else {
        var but = document.getElementById("buttons");
        but.innerHTML = "确认下单";
        let para = {
          orderId: this.orderid1,
        };
        orderDetail(para).then((res) => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error",
            });
          } else {
            //this.serviceType = res.body.serviceType;//服务类型
            this.form.startPoiAddress = res.body.startPoiAddress;
            this.form.startMan = res.body.startMan;
            this.form.startManTel = res.body.startManTel;
            this.form.endPoiAddress = res.body.endPoiAddress;
            this.form.endMan = res.body.endMan;
            this.form.endManTel = res.body.endManTel;
            this.form.carNum = res.body.carNum;
            this.form.orderTime = res.body.orderTime;
            this.form.estimateMP =
              "本单预估里程" +
              res.body.actualMileage +
              "米,滴滴预估金额¥" +
              res.body.estimateMoney;
            this.getReturnCarManOpts(res.body.dealerCode);
          }
        });
      }
    },
    //  送车服务选择门店联系人
    startChange(e) {
      this.form.startManTel = e;
    },
    // 取车服务，选择门店联系人
    endChange(e) {
      this.form.endManTel = e;
    },
    getReturnCarManOpts(dealerCode) {
      let _this = this;
      let para = {
        dealerCode: dealerCode,
      };
      returnCarMans(para)
        .then((res) => {
          //请求返回的数据
          //赋值
          _this.objData = res.body;
          console.log(this.objData);
        })
        .catch((error) => {
          //console.log(error);
        });
    },
    //保存
    onSubmit() {
      let that = this;
      var but = document.getElementById("buttons");

      this.$refs["formName"].validate((valid) => {
        if (valid) {
          let para = that.form;
          if (that.orderid || that.orderid1) {
            if (but.innerHTML == "确认修改") {
              if (confirm("是否已和车主联络并取得车主确认？", "提示")) {
                //编辑
                para.orderId = that.orderid;
                editOrder(para).then((res) => {
                  if (res.header.code !== 10000000) {
                    that.$message({
                      offset: 100,
                      message: res.header.message,
                      type: "error",
                    });
                  } else {
                    that.$message({
                      offset: 100,
                      message: "修改成功！",
                      type: "success",
                    });

                    setTimeout(function () {
                      that.$router.push({
                        path: "/orderlist",
                      });
                    }, 1000);
                  }
                });
              }
            } else {
              para.orderId = that.orderid1;

              if (that.serviceType == 1) {
                // 取车下单，get
                newGetOrder(para).then((res) => {
                  if (res.header.code !== 10000000) {
                    that.$message({
                      offset: 100,
                      message: res.header.message,
                      type: "error",
                    });
                  } else {
                    that.$message({
                      offset: 100,
                      message: "下单成功！",
                      type: "success",
                    });

                    setTimeout(function () {
                      that.$router.push({
                        path: "/orderlist",
                      });
                    }, 1000);
                  }
                });
              } else {
                // 送车下单push
                newPushOrder(para).then(res => {
                  if (res.header.code !== 10000000) {
                  that.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error",
                  });
                } else {
                  that.$message({
                    offset: 100,
                    message: "下单成功！",
                    type: "success",
                  });
                
                  setTimeout(function () {
                    that.$router.push({
                      path: "/orderlist",
                    });
                  }, 1000);
                }
                })
              }
            }
          } else {
            that.$message({
              offset: 100,
              message: "参数orderid缺失！",
              type: "warning",
            });
          }
        } else {
          that.$message({
            offset: 100,
            type: "warning",
            message: "信息录入格式不正确，请检查!",
          });
        }
      });
    },
    // 返回列表页面
    backListPage() {
      this.$confirm("即将离开本页面并返回上一页，请确认", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$router.push({
            path: "/orderlist",
          });
        })
        .catch(() => {});
    },
  },
  beforeRouteEnter(to, from, next) {
    let serviceTypex = to.query.serviceType;
    if (serviceTypex == "1") {
      to.meta.title = "取车服务";
    } else {
      to.meta.title = "送车服务";
    }
    next();
  },
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
