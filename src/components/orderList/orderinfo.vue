<template>
  <section>
    <!-- 订单信息 -->
    <el-col class="part">
      <div class="all-title">
        <span class="title-left"><i class="el-icon-warning"></i>当前订单状态：{{orderstatus | orderstate}}</span>
        <span class="title-right" @click="copyinfo">复制信息给滴滴运维人员</span>
      </div>
      <div class="table">
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>基本信息</span>
        </p>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column prop="orderId" align="center" label="订单编号">
          </el-table-column>
          <el-table-column prop="customerName" align="center" label="车主姓名">
          </el-table-column>
          <el-table-column prop="customerTel" align="center" label="车主手机号">
          </el-table-column>
          <el-table-column prop="payPath" align="center" label="支付方式">
          </el-table-column>
          <el-table-column align="center" label="订单来源">
            <template slot-scope="scope">
              {{ scope.row.bussinessType == "1" ?  '预约保养' : '' }}
              {{ scope.row.bussinessType == "2" ?  '共享出行' : '' }}
              {{ scope.row.bussinessType == "3" ?  '预约年审' : '' }}
              {{ scope.row.bussinessType == "4" ?  '其他' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注">
          </el-table-column>
        </el-table>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column align="center" label="服务方式">
            <template slot-scope="scope">
              {{ scope.row.serviceType == "1" ?  '上门取车' : '' }}
              {{ scope.row.serviceType == "2" ?  '送车上门' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="orderChannel" align="center" label="接单渠道">
          </el-table-column>
          <el-table-column prop="dirverName" align="center" label="司机姓名">
          </el-table-column>
          <el-table-column prop="driverDid" align="center" label="司机工号">
          </el-table-column>
          <el-table-column prop="driverMob" align="center" label="司机电话">
          </el-table-column>
          <el-table-column prop="appraisal" align="center" label="司机评分">
          </el-table-column>
        </el-table>
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>取车联系人信息</span>
        </p>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column prop="startMan" align="center" label="联系人">
          </el-table-column>
          <el-table-column prop="startManTel" align="center" label="手机号码">
          </el-table-column>
          <el-table-column prop="startPoiName" align="center" label="取车地点">
          </el-table-column>
          <el-table-column prop="startPoiAddress" align="center" label="取车地址">
          </el-table-column>
        </el-table>
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>送达联系人信息</span>
        </p>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column prop="endMan" align="center" label="联系人">
          </el-table-column>
          <el-table-column prop="endManTel" align="center" label="手机号码">
          </el-table-column>
          <el-table-column prop="endPoiName" align="center" label="送达地点">
          </el-table-column>
          <el-table-column prop="endPoiAddress" align="center" label="送达地址">
          </el-table-column>
        </el-table>
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>车辆信息</span>
        </p>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column prop="carNum" align="center" label="车牌号">
          </el-table-column>
          <el-table-column prop="frameNum" align="center" label="车架号">
          </el-table-column>
          <el-table-column prop="engineNum" align="center" label="发动机号">
          </el-table-column>
        </el-table>
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>费用信息</span>
        </p>
        <!-- 注意：使用element tabel组件 设置prop时，无法使用三元表达式，需要更换为模板插槽的格式 -->
<!--        <el-table-column prop="orderPoint" align="center" label="累计积分抵扣">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="payMoney" align="center" label="实付金额">-->
<!--        </el-table-column>-->
<!--        </el-table>-->
<!--        <el-table :data="all_table" border v-loading="listLoading">-->
<!--          <el-table-column prop="activityName" align="center" label="活动内容">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="totalMoney" align="center" label="滴滴订单金额">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="" align="center" label="">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="" align="center" label="">-->

        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column  align="center" label="订单金额">
               <template slot-scope="scope">
                <span v-if='scope.row.totalMoney != null'>{{scope.row.totalMoney}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="累计优惠金额">
             <template slot-scope="scope">
                <span v-if='scope.row.discountMoney != null'>{{scope.row.discountMoney}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="累计积分抵扣">
              <template slot-scope="scope">
               <span v-if='scope.row.orderPoint != null'>{{scope.row.orderPoint}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column  align="center" label="实付金额">
              <template slot-scope="scope">
                <span v-if='scope.row.payMoney != null'>{{scope.row.payMoney}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
        </el-table>
        <el-table :data="all_table" border v-loading="listLoading">
          <el-table-column align="center" label="活动内容">
              <template slot-scope="scope">
                <span v-if='scope.row.activityName'>{{scope.row.activityName}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="滴滴订单金额">
              <template slot-scope="scope">
                <span v-if='scope.row.totalMoney != null'>{{scope.row.totalMoney}}</span>
                <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="">
              <template slot-scope="scope">
                <span></span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="">
              <template slot-scope="scope">
                <span></span>
              </template>
          </el-table-column>
        </el-table>
        <p class="each-title">
          <i class="fa fa-bookmark"></i>
          <span>操作信息</span>
        </p>
        <el-table :data="operate_data" border empty-text="暂无操作信息" v-loading="listLoading1">
          <el-table-column prop="createBy" align="center" label="操作者">
          </el-table-column>
          <el-table-column align="center" label="订单状态">
            <template slot-scope="scope">
              {{scope.row.orderStatus | orderstate}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="操作时间">
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注信息">
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </section>
</template>

<script>
import { orderDetail, orderOperate } from "../../api/api";
export default {
  data() {
    return {
      // 订单编号
      orderid: "",
      // 订单状态
      orderstatus: "",
      // 基础信息
      all_table: [],
      // 操作信息
      operate_data: [],
      // loading
      listLoading: false,
      listLoading1: false
    };
  },
  filters: {
    orderstate(val) {
      if (val == "10") {
        return "待审核";
      }
      if (val == "20") {
        return "待派单";
      }
      if (val == "30") {
        return "待接单";
      }
      if (val == "40" || val == "41") {
        return "待取车";
      }
      if (val == "50") {
        return "待交车";
      }
      if (val == "60" || val == "61") {
        return "待付款";
      }
      if (val == "70") {
        return "已完成";
      }
      if (val == "80" || val == "81") {
        return "已关闭";
      }
    }
  },
  methods: {
    //获取基本信息数据
    getTableinfo() {
      this.listLoading = true;
      let para = {
        orderId: this.orderid
      };
      orderDetail(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          //console.log(2222,this.all_table);
          console.log(res.body)
          this.all_table.push(res.body);
          this.orderstatus = res.body.orderStatus;
        }
        this.listLoading = false;
      });
    },

    // 获取订单操作信息
    getorderOperate() {
      this.listLoading1 = true;
      let para = {
        current: "1",
        size: "1000",
        orderId: this.orderid
      };
      orderOperate(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.operate_data = res.body.records;
        }
        this.listLoading1 = false;
      });
    },
    // 复制信息
    copyinfo() {
      let nowtime = new Date();
      let creatime = this.all_table[0].createTime;
      let date = nowtime.getTime() - new Date(creatime).getTime(); //时间差的毫秒数
      //计算相差分钟数
      let leave = date % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave / (60 * 1000));
      //计算相差秒数
      let leavex = leave % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leavex / 1000);
      let differtime = minutes + " 分钟" + seconds + " 秒";
      // 获取需要复制的文字
      // let copyStr =
      //   "滴滴订单号：" +
      //   this.all_table[0].orderId +
      //   "，下单时间：" +
      //   this.all_table[0].createTime +
      //   "，已下单" +
      //   differtime +
      //   "分钟，请及时处理";
        let copyStr ="滴滴订单号：" +this.all_table[0].thirdOrderId +"，起点地址：" +this.all_table[0].startPoiName +"，终点地址：" +
        this.all_table[0].endPoiName +"，下单人姓名："+this.all_table[0].customerName+'，联系方式：'+this.all_table[0].customerTel;
      // 创建input标签存放需要复制的文字
      const oInput = document.createElement("input");
      // 把文字放进input中，供复制
      oInput.value = copyStr;
      document.body.appendChild(oInput);
      // 选中创建的input
      oInput.select();
      // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
      const copyResult = document.execCommand("copy");
      // 操作中完成后 从Dom中删除创建的input
      document.body.removeChild(oInput);
      // 根据返回的复制结果 给用户不同的提示
      if (copyResult) {
        this.$message({
          offset: 100,
          message: "复制成功！",
          type: "success"
        });
      } else {
        this.$message({
          offset: 100,
          message: "复制失败！",
          type: "error"
        });
      }
    }
  },
  mounted() {
    this.orderid = this.$route.query.orderid;
    this.getTableinfo();
    this.getorderOperate();
  }
};
</script>

<style lang="less" scoped>
section {
  .step {
    width: 100%;
    height: 200px;
    background: #fff;
    .el-steps {
      height: 100px;
      padding: 50px 0;
    }
  }
  .part {
    background: #fff;
    margin: 20px 0;
    .all-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
      .title-left {
        height: 60px;
        line-height: 60px;
        padding: 0 50px;
        font-size: 17px;
        color: #f04844;
        font-weight: 600;
      }
      .title-right {
        margin-right: 20px;
        background: #0079fe;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
      }
      .title-right:hover {
        background: #409eff;
      }
    }
    .table {
      padding: 20px 50px;
      .each-title {
        font-size: 16px;
        font-weight: 600;
        margin-top: 30px;
      }
    }
  }
}
</style>
