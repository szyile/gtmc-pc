<template>
  <div class="main-wrap" @click="visible = false">
    <div class="title">
      <span class="left">{{dealerid == undefined ? "添加" : "修改"}}门店</span>
      <span class="right">
        <i>*</i>为必填项
      </span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="180px" class="el-found" ref="formName">
      <el-form-item prop="dealerName" label="门店名称：">
        <el-input v-model="form.dealerName" placeholder="请填写门店名称" maxlength="32"></el-input>
        <br />
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
        <el-switch active-value="2" inactive-value="1" v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item prop="dealerType" label="销售店取送车下单设置：">
        <div>
          <el-radio v-model="radio" label="自动">自动</el-radio>
          <el-popover placement="top" title="首次修改下单设置，我们将下单设置换为【手动】" trigger="manual" v-model="visible">
            <el-radio ref="radioSd" slot="reference" v-model="radio" label="手动">手动</el-radio>
          </el-popover>
        </div>
         <div class="explain">
          <div class="left">说明：</div>
          <div class="left">
            <p>1、贵店icrop设置直连SMB看板推荐使用【自动】模式</p>
            <p> 2、贵店icrop设置非直连SMB看板推荐使用【手动】模式，并请及时在icrop审核预约保养单</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="remarks" label="备注：">
        <el-input type="textarea" placeholder="请输入备注" maxlength="300" @input="change_num" v-model="form.remarks"></el-input>
        <i class="strnum">已输入{{stringnum}}/300</i>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click.stop="onEdit" v-if="!isShowSave">修改</el-button>
        <el-button type="primary" @click="Submit" v-if="isShowSave">保存</el-button>
        <!-- 提交弹窗事件 -->
        <el-dialog 
        :close-on-press-escape="false" :close-on-click-modal="false"
         :show-close="false" custom-class="aaa" title="" :visible.sync="dialogVisible" width="30%">
          <h3>
            <img class="diaimg" src="../../../static/images/home/order_noin_time.png" alt="">
            温馨提示
            <span class="small">(2020剩余修改次数:{{res_deg}}次)</span>
          </h3>
          <p>1.取送车向代驾商下单是否为自动或者手动的功能设置一年只能修改3次，超过3次之后则一年内不能进行修改。</p>
          <p>2.取送车向代驾商下单是否为自动或者手动的功能设置时间间隔要超过一个月，使用该功能之后一个月的时间内不能修改该功能。</p>
          <p class="time">{{time}}S</p>
          <span slot="footer" class="">
            <el-button @click="diaclose">取 消</el-button>
            <el-button type="primary" @click="diapush" :disabled="dontSub">确 定</el-button>
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  addStore,
  storeDetail,
  storeDetailByCode,
  editStore,
} from "../../api/api";
export default {
  data() {
    return {
      dontSub:true,
      dialogVisible: false,
      time: 10,
      res_deg: 0,//剩余次数
      dealerid: "",
      isShowSave: false,
      visible: false,
      radio: '',
      interval: '',
      form: {
        dealerId: "",
        dealerCode: "", // 门店代码id
        dealerName: "", // 门店名称
        dealerRel: "", // 门店联系人
        dealerTel: "", // 门店联系人电话
        status: "", // 状态
        remarks: "", // 备注
        dealerType: "", //下单状态
      },
      FormRules: {
        dealerName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店名称不能是空格",
            trigger: "blur",
          },
        ],
        dealerCode: [
          { required: true, message: "门店代码ID不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店代码ID不能是空格",
            trigger: "blur",
          },
        ],
        dealerRel: [
          { required: true, message: "门店联系人不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "门店联系人不能是空格",
            trigger: "blur",
          },
        ],
        dealerTel: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        remarks: [],
      },
      stringnum: 0,
    };
  },
  mounted() {
    //获取dealerid
    let roleCode = localStorage.getItem("roleCode");
    if (roleCode == "storeManager") {
      let para = {
        dealerCode: localStorage.getItem("loginName"),
      };
      storeDetailByCode(para).then((res) => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error",
          });
        } else {
          // console.log(res.body)
          this.dealerid = res.body.dealerId
          this.form.dealerCode = res.body.dealerCode;
          this.form.dealerName = res.body.dealerName;
          this.form.dealerRel = res.body.dealerRel;
          this.form.dealerTel = res.body.dealerTel;
          this.form.status = res.body.status;
          this.form.dealerType = res.body.dealerType;
          // 1自动 0手动
          this.res_deg = 3-res.body.number
          this.radio = res.body.dealerType == 0 ? '手动' : '自动'
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
          dealerId: this.dealerid,
        };
        storeDetail(para).then((res) => {
          if (res.header.code !== 10000000) {
            this.$message({
              offset: 100,
              message: res.header.message,
              type: "error",
            });
          } else {
            this.form.dealerCode = res.body.dealerCode;
            this.form.dealerName = res.body.dealerName;
            this.form.dealerRel = res.body.dealerRel;
            this.form.dealerTel = res.body.dealerTel;
            this.form.status = res.body.status;
            this.form.dealerType = res.body.dealerType;
            this.radio = res.body.dealerType == 0 ? '手动' : '自动'
            this.form.remarks = res.body.remarks;
            //  console.log(res.body)
         
           
            this.change_num();
          }
        });
      }
    },
    // 监听备注字数
    change_num() {
      this.stringnum = this.form.remarks.length;
    },
    change(e) {
      if (e == '手动') {
        this.visible = true;
      }
    },
    // 修改
    onEdit() {
      
      this.isShowSave = true;
      if(window.localStorage.getItem('old_isFirst')==1){
        
        this.visible = true;
        this.radio = '手动';
      }
      

    },
    Submit() {
      window.localStorage.setItem('old_isFirst',0)
      console.log("触发保存")
      this.time=10
      this.dialogVisible = true
      // 设置定时器
      this.interval = setInterval(() => {
        this.time--
        if(this.time==0){
          //清除定时器
          window.clearInterval(this.interval)
          //开启弹窗的button
          this.dontSub=false
        }
      }, 1000);
    },
    // 保存
    onSubmit() {
      this.$refs["formName"].validate((valid) => {
        if (valid) {
          let para = this.form;
          // console.log(this.dealerid)
          // 编辑
          para.dealerId = this.dealerid;
          para.dealerType = this.radio == '自动' ? 1 : 0
          // console.log('发送请求');
          // return;
          editStore(para).then((res) => {
            if (res.header.code !== 10000000) {
              console.log(res.body)
              this.$message({
                offset: 100,
                message: res.header.message,
                type: "error",
              });
            } else {
              this.$message({
                offset: 100,
                message: "修改成功！",
                type: "success",
              });
              localStorage.setItem('storeviewsave', true)
              let _this = this;
              setTimeout(function () {
                _this.interval = ''
                _this.$router.push({
                  path: "/storelist",
                });
              }, 1000);
            }
          });


        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "信息录入格式不正确，请检查!",
          });
        }
      });
    },
    //弹窗点击取消
    diaclose() {
      // console.log("取消请求")
      //清除定时器
      window.clearInterval(this.interval)
      this.dialogVisible=false
    },
    //弹窗确定
    diapush(){
      //清除定时器
      window.clearInterval(this.interval)
      //发送请求
      this.onSubmit()
      this.dialogVisible=false
    },
    // 取消
    resetForm() {
      this.$confirm("即将离开页面，请确认", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$router.push({
            path: "/storelist",
          });
        })
        .catch(() => { });
    },
  },
  beforeRouteEnter(to, from, next) {
    let dealeridx = to.query.dealerid;
    if (dealeridx == undefined) {
      to.meta.title = "添加门店";
    } else {
      to.meta.title = "修改门店";
    }
    next();
  },
};
</script>
<style lang="less" scoped>
// 说明样式
.explain{
  color: #999999;
  .left{
    float: left;
  }
}
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
.small {
  font-size: 12px;
  color: #ff0000;
}
.time {
  color: #ff0000;
  font-size: 30px;
  text-align: center;
  font-weight: bolder;
}
.diaimg {
  width: 20px;
  height: 20px;
}
</style>

<style lang="less">
.aaa {
  border-radius: 10px !important;
  background: #fff !important;
  .el-dialog__header {
    padding: 0px 0px 0px !important;
    background: #fff !important;
  }
}
</style>
