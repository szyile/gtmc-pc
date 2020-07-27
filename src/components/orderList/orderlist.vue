<template>
  <section>
    <el-col :span="24">
      <div class="tu" style="height:84px">
        <div class="ding">
          <!-- <p class="titles" @click="diDi" :style="search_avatar==1?'background-color: white;':'background-color: #ccc'">
          <br/>滴滴—手动派单<br/><br/><span class="guan">(滴滴代驾取送车订单管理)</span>
        </p> -->
          <p class="titles cur" @click="diDi">
            <img src="../../../static/images/ordelCount/didilogo.svg" alt="">
          </p>
          <p class="titles " @click="daiJia">
            <img src="../../../static/images/ordelCount/edaijialogo.png" alt="">
          </p>
          <!-- <p class="titles"  @click="daiJia">
          <br/>E代驾<br/><br/><span class="guan">(E代驾取送车订单管理)</span>
        </p> -->
        </div>
      </div>
    </el-col>

    <!-- 数据统计 -->

    <el-col :span="24" class="alldata" v-if="roleCode == 'admin'">
      <el-form :inlineclass="true" v-loading="listLoading1">
        <el-form-item>
          <span><i class="el-list-round" style="background:#58A3F7"></i>预下单</span>
          <span>{{orderscount.waitCheckNum}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#FEC03D"></i>待派单</span>
          <span>{{orderscount.waitAssignNum}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#FFA94C"></i>待接单</span>
          <span>{{orderscount.waitTakeOrderNum}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#8167F5"></i>待取车</span>
          <span>{{orderscount.waitTakeCar}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#C280FF"></i>待交车</span>
          <span>{{orderscount.waitReturnCar}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#FFFF80"></i>待付款</span>
          <span>{{orderscount.waitPay}}</span>
        </el-form-item>
        <el-form-item>
          <span><i class="el-list-round" style="background:#4BCED0"></i>已完成</span>
          <span>{{orderscount.completedNum}}</span>
        </el-form-item>
        <el-form-item class="el-order-alldata">
          <span><i class="el-list-round" style="background:#FB6260"></i>已关闭</span>
          <span>{{orderscount.closedNum}}</span>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title sj">数据筛选</div>
      <el-form :inline="true" style="display: block">
        <el-form-item label="提交时间">
          <el-date-picker v-model="search_createTime1" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="预约时间">
          <el-date-picker v-model="search_startTime1" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="服务方式：">
          <el-select v-model="search_serviceType1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="送车上门" value="2"></el-option>
            <el-option label="上门自取" value="1"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="车主账号">
          <el-input v-model="search_user1" placeholder="车主账号"></el-input>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input v-model="search_order1" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：">
          <el-input v-model="search_car1" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态：">
          <el-select v-model="search_status1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="10"></el-option>
            <el-option label="待派单" value="20"></el-option>
            <el-option label="待接单" value="30"></el-option>
            <el-option label="待下单" value="38"></el-option>
            <el-option label="待取车" value="40,41"></el-option>
            <el-option label="待交车" value="50"></el-option>
            <el-option label="待付款" value="60,61"></el-option>
            <el-option label="已完成" value="70"></el-option>
            <el-option label="已关闭" value="80,81"></el-option>
          </el-select>
        </el-form-item>
        <img src="../../../static/images/home/prompt.png" @click="ShowStatus(0)" />
        <el-form-item label="订单类型：">
          <el-select v-model="search_businessType1">
            <el-option label="预约保养" value="0"></el-option>
            <el-option label="便捷下单" value="3"></el-option>
            <!-- <el-option label="其他" value="12"></el-option> -->
          </el-select>
        </el-form-item>
        <div class="statusImg">
          <img src="../../../static/images/home/prompt.png" @click="ShowStatus(1)" />
        </div>

        <!-- <img src="../../../static/images/home/headurl.png" id="img" v-if="tu"/> -->
        <!-- 弹出层 -->
        <el-dialog :title="gettitle" :visible.sync="tu" width="50%">
          <img style="width:100%;heigth:100%" v-if="status_stu==0" src="../../../static/images/ordelCount/order_sta.png" alt="" />
          <img style="width:100%;heigth:100%" v-else src="../../../static/images/ordelCount/order_lx.png" alt="" />
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tu = false">关闭</el-button>
          </span>
        </el-dialog>
        <!-- 弹出层结束 -->
        <el-form-item>
          <el-button type="primary" icon="fa fa-search fa-fw" @click="SearchData"> 查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 数据列表 -->
    <el-col :span="24" class="table">
      <div class="table-title title">
        订单列表
      </div>

      <template>
        <div class="style" @click="allTime" :style="store_avatar==1?'background-color: #66b1ff;;color: white':'background-color: #f5f5f5'">
          <img v-if="store_avatar==2" src="../../../static/images/ordelCount/allwhite.png" class="imgs" />
          <img v-else src="../../../static/images/ordelCount/allgray.png" class="imgs" />
          全部订单
          <span class="two">{{this.search_allNum}}</span>件
        </div>
        <div class="style" @click="normalTime" :style="store_avatar==2?'background-color: #66b1ff;;color: white':'background-color: #f5f5f5'">
          <img v-if="store_avatar==2" src="../../../static/images/ordelCount/paidanwhite.png" class="imgs" />
          <img v-else src="../../../static/images/ordelCount/paidangray.png" class="imgs" />
          派单正常
          <span class="two">{{this.search_normalNum}}</span>件
        </div>
        <div class="style" @click="overTime" :style="store_avatar==3?'background-color: #66b1ff;;color: white':'background-color: #f5f5f5'">
          <img v-if="store_avatar==3" src="../../../static/images/ordelCount/gaojingwhite.png" class="imgs" />
          <img v-else src="../../../static/images/ordelCount/gaojinggray.png" class="imgs" />
          派单超时
          <span class="two">{{this.search_overNum}}</span>件
        </div>
      </template>

      <el-table ref="multipleTable" border :data="orders" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange">

        <el-table-column fixed="left" type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column align="center" label="订单类型">
          <template slot-scope="scope">
            {{ scope.row.businessType == '0' ?  '预约保养' : '' }}
            {{ scope.row.businessType == '3' ?  '便捷下单' : '' }}
            {{ scope.row.businessType == '12' ?  '其他' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="orderId" label="订单编号">
          <template slot-scope="scope">
            <!-- {{scope.row.overType==null}} -->
            <span v-if="scope.row.overType==2 &&scope.row.overType!=null">
              <img src="../../../static/images/home/info.png" width="25" height="25" /> {{ scope.row.orderId}}
            </span>
            <span v-else-if="scope.row.overType ==1 &&scope.row.overType!=null">
              <img src="../../../static/images/home/noinfo.png" width="25" height="25" /> {{ scope.row.orderId}}
            </span>
            <span v-else>
              {{ scope.row.orderId}}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="assignTime" label="派单时长">
          <template slot-scope="scope">
            <span v-if="scope.row.assignTime !=null && scope.row.applyStatus=='1'" style="color:#FB6260">
              {{ scope.row.assignTime}}
            </span>
            <span v-else-if="scope.row.assignTime !=null && scope.row.applyStatus=='0'">
              {{ scope.row.assignTime}}
            </span>
            <span v-else>
              —
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="createTime" label="提交时间">
        </el-table-column>
        <el-table-column align="center" sortable prop="startTime" label="预约时间">
        </el-table-column>
        <el-table-column align="center" sortable prop="customerTel" label="车主账号">
        </el-table-column>
        <el-table-column align="center" sortable prop="carNum" label="车牌号">
        </el-table-column>
        <el-table-column align="center" sortable prop="estimateMoney" label="预估金额">
          <template slot-scope="scope">
            <span v-if="scope.row.estimateMoney">￥</span>
            <span>{{ scope.row.estimateMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务方式">
          <template slot-scope="scope">
            {{ scope.row.serviceType == '1' ?  '上门取车' : '' }}
            {{ scope.row.serviceType == '2' ?  '送车上门' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <span v-show="scope.row.orderStatus == '10'">
              <i class="el-list-round" style="background:#58A3F7"></i>待审核
            </span>
            <span v-show="scope.row.orderStatus == '20'">
              <i class="el-list-round" style="background:#FEC03D"></i>待派单
            </span>
            <span v-show="scope.row.orderStatus == '30'">
              <i class="el-list-round" style="background:#FFA94C"></i>待接单
            </span>
            <span v-show="scope.row.orderStatus == '38'">
              <i class="el-list-round" style="background:#FFA94C"></i>待下单
            </span>
            <span v-show="scope.row.orderStatus == '40' || scope.row.orderStatus == '41'">
              <i class="el-list-round" style="background:#8167F5"></i>待取车
            </span>
            <span v-show="scope.row.orderStatus == '50'">
              <i class="el-list-round" style="background:#C280FF"></i>待交车
            </span>
            <span v-show="scope.row.orderStatus == '60' || scope.row.orderStatus == '61'">
              <i class="el-list-round" style="background:#FFFF80"></i>待付款
            </span>
            <span v-show="scope.row.orderStatus == '70'">
              <i class="el-list-round" style="background:#4BCED0"></i>已完成
            </span>
            <span v-show="scope.row.orderStatus == '80' || scope.row.orderStatus == '81'">
              <i class="el-list-round" style="background:#FB6260"></i>已关闭
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属门店">
          <template slot-scope="scope">
            {{ scope.row.serviceType == '1' ?  scope.row.endPoiName : '' }}
            {{ scope.row.serviceType == '2' ?  scope.row.startPoiName : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- {{power}} -->
            <!-- {{power.indexOf(',查看订单,')}} -->
            <el-button class="el-button--table" size="small" @click="handleDetail(scope.$index, scope.row)">查看订单
            </el-button>
            <el-button v-show="scope.row.orderStatus=='10' || scope.row.orderStatus=='20'" class="el-button--table" size="small" icon="fa fa-pencil fa-fw" @click="handleEdit(scope.$index, scope.row)">修改订单
            </el-button>
            <el-button v-show="scope.row.orderStatus=='38' && scope.row.serviceType==1" class="el-button--table" size="small" @click="handleDown(scope.$index, scope.row)">
              取车下单
            </el-button>
            <el-button v-show="scope.row.orderStatus=='38' && scope.row.serviceType==2" class="el-button--table" size="small" @click="handleDown(scope.$index, scope.row)">
              送车下单
            </el-button>
            <el-button v-show="scope.row.orderStatus=='10' || scope.row.orderStatus=='20' || scope.row.orderStatus=='38' || scope.row.orderStatus=='30'" class="el-button--table" size="small" @click="handleCancel(scope.$index, scope.row)">关闭订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div class="tool-left" v-if="power.indexOf(',批量关闭订单,') > -1">
        <el-button icon="fa fa-check-square-o fa-fw" @click="allSelection()" :disabled="orders.length == 0">全选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="reverseSelection()" :disabled="orders.length == 0">反选</el-button>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="power.indexOf(',批量关闭订单,') > -1" :disabled="sels.length == 0" @click.native="handleallCan">关闭订单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]" :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>

    <!-- 关闭订单对话框 -->
    <el-dialog title="关闭订单" :before-close="close_cancel" :visible.sync="closeFormVisible" :close-on-click-modal="false" width="600px">
      <el-form class="el-close-order" ref="closeForm" :model="closeForm" :rules="closeFormRules" label-width="100px">
        <el-form-item prop="cancelType" label="关闭原因：">
          <el-radio-group v-model="closeForm.cancelType">
            <el-radio :label="'1'">车主原因</el-radio>
            <el-radio :label="'2'">司机原因</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="cancelReason" label="关闭说明：">
          <el-input type="textarea" placeholder="请输入关闭说明" maxlength="300" @input="close_num" v-model="closeForm.cancelReason">
          </el-input>
          <i>已输入{{stringnum}}/300</i>
        </el-form-item>
        <el-form-item class="formbtn">
          <el-button :type="!closeForm.cancelType || !closeForm.cancelReason?'info':'primary'" @click="close_submit">确定</el-button>
          <el-button @click="close_cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </section>
</template>

<script>
import { batchCancel, orderCancel, orderCount,storeDetailByCode, orderList } from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      roleCode:localStorage.getItem('roleCode'),
      //弹出图片
      tu: false,

      // 订单统计
      orderscount: {},
      //控制？弹出层
      status_stu: '',
      // 查询
      search_user: "",
      search_order: "",
      search_car: "",
      search_status: "",
      search_createTime: "",
      search_createTime1: "",
      search_assignTime: "",
      search_assignTime1: "",
      search_startTime: "",
      search_startTime1: "",
      search_serviceType: "",
      search_user1: "",
      search_order1: "",
      search_car1: "",
      search_status1: "",
      search_serviceType1: "",
      search_businessType: "",
      search_businessType1: "",
      dealerCode:"",

      //区别订单超时的
      search_discern: "",

      //区别是否选中tab
      search_avatar: 1,

      //区别是否选中派单
      store_avatar: 0,
      // 分页
      total: 0,
      page: 1,
      pagesize: 10,

      // loading
      listLoading: false,
      listLoading1: false,

      search_allNum: 0, //全部订单
      search_overNum: 0, //派单超时
      search_normalNum: 0, //派单正常

      // 订单列表
      orders: [],
      sels: [], //列表选中列
      roworderid: "", //行内操作 订单号

      //关闭订单对话框
      closeFormVisible: false,
      closeForm: {
        cancelType: "",
        cancelReason: ""
      },
      closeFormRules: {
        cancelType: [
          { required: true, message: "关闭原因不能为空", trigger: "blur" }
        ],
        cancelReason: [
          { required: true, message: "关闭说明不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "关闭说明不能是空格",
            trigger: "blur"
          }
        ]
      },
      stringnum: 0,
      // 权限
      power: ","
    };
  },
  computed: {
    ...mapState({
      powerlist: state => state.power
    }),
    gettitle() {
      if (this.status_stu == 0) {
        return '订单状态说明'
      } else {
        return '订单类型说明'
      }
    }
  },

  methods: {

    //获取订单列表
    getorderslist() {
      let para = {
        orderId: this.search_order,
        orderStatus: this.search_status,
        carNum: this.search_car,
        customerTel: this.search_user,
        startTime: this.search_startTime,
        createTime: this.search_createTime,
        assignTime: this.search_assignTime,
        serviceType: this.search_serviceType,
        businessType: this.search_businessType,
        orderType: "",
        discern: this.search_discern,
        roleCode: localStorage.getItem("roleCode"),
        current: this.page,
        size: this.pagesize
      };
      if(window.localStorage.getItem('isAdmin')==1){
        para.dealerCode=localStorage.getItem('loginName')
        // console.log(para)
      }
      //  console.log(para)
      this.listLoading = true;
      orderList(para).then(res => {
        // console.log(res.body)
        if (res.body.records[0] != null) {
          this.search_allNum = res.body.records[0].allNum;
          this.search_overNum = res.body.records[0].overNum;
          this.search_normalNum = res.body.records[0].normalNum;
        } else {
          // console.log(123)
          //如果后台没有数据直接返回0
          this.search_allNum = 0;
          this.search_overNum = 0;
          this.search_normalNum = 0;
        }
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          console.log(res.body)
          this.orders = (res.body && res.body.records) ? res.body.records : [];
          for (let i = 0; i < this.orders.length; i++) {
            this.orders[i].estimateMoney = Number(this.orders[i].estimateMoney)
            this.orders[i].actualMoney = Number(this.orders[i].actualMoney)
          }
          this.total = (res.body && res.body.total) ? res.body.total : 0;
        }
        this.listLoading = false;
      });
    },

    // 获取订单统计数据,不必要了
    getordersnum() {
      this.listLoading1 = true;
      orderCount({}).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.orderscount = res.body || {};
        }
        this.listLoading1 = false;
      });
    },

    // 改变每页条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getorderslist();
    },

    // 改变页数
    handleCurrentChange(val) {
      this.page = val;
      this.getorderslist();
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    ShowStatus(stu) {
      this.status_stu = stu
      this.tu = true;

    },
    // 查询
    SearchData(stu) {
      if (this.search_createTime1 != '') {
        this.search_createTime = JSON.stringify(this.search_createTime1)
      }
      if (this.search_startTime1 != '') {
        this.search_startTime = JSON.stringify(this.search_startTime1);
      }
      this.search_assignTime = this.search_assignTime1;
      this.search_serviceType = this.search_serviceType1;
      this.search_businessType = this.search_businessType1;
      this.search_user = this.search_user1;
      this.search_order = this.search_order1;
      this.search_car = this.search_car1;
      this.search_status = this.search_status1;
      this.page = 1;
      this.getorderslist();
    },

    // 全选
    allSelection() {
      this.$refs.multipleTable.toggleAllSelection(this.orders);
    },

    // 反选
    reverseSelection() {
      this.orders.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },

    // 选中某行
    handleSelectionChange(sels) {
      this.sels = sels;
    },

    //查看订单详情
    handleDetail(index, row) {
      this.$router.push({
        path: "/orderinfo",
        query: { orderid: row.orderId }
      });
    },

    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/editorder",
        query: { orderid: row.orderId, serviceType: row.serviceType }
      });
    },
    diDi() {
      this.search_avatar = 1;
    },
    daiJia() {
      // this.search_avatar=2;
      alert('该功能尚未开放，敬请期待！');
    },
    //全部订单
    allTime() {
      this.store_avatar = 1;
      this.search_discern = '';
      this.page = 1;
      this.getorderslist();
    },

    //派单正常
    normalTime() {
      this.store_avatar = 2;
      this.search_discern = 'normal';
      this.page = 1;
      this.getorderslist();
    },

    //派单超时
    overTime() {
      this.store_avatar = 3;
      this.search_discern = 'over';
      this.page = 1;
      this.getorderslist();
    },

    // 待下单
    handleDown(index, row) {
      this.$router.push({
        path: "/editorder",
        query: { orderid1: row.orderId, serviceType: row.serviceType }
      });
    },

    //关闭订单
    handleCancel(index, row) {
      this.closeFormVisible = true;
      this.roworderid = row.orderId;
    },

    // 批量关闭订单
    handleallCan() {
      this.closeFormVisible = true;
    },

    // 关闭订单对话框确定按钮
    close_submit() {
      this.$refs["closeForm"].validate(valid => {
        if (valid) {
          if (this.stringnum > 300) {
            this.$message({
              offset: 100,
              type: "warning",
              message: "关闭说明不能超过300个字符！"
            });
          } else {
            if (this.roworderid) {
              // 单个关闭
              let para = {
                orderId: this.roworderid,
                cancelType: this.closeForm.cancelType,
                cancelReason: this.closeForm.cancelReason,
                orderStatus: "81"
              };
              this.listLoading = true;
              orderCancel(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                } else {
                  this.$message({
                    offset: 100,
                    message: "成功关闭订单！",
                    type: "success"
                  });
                  this.close_cancel();
                  this.getorderslist();
                }
                this.listLoading = false;
              });
            } else {
              // 批量关闭
              let csorderId = [];
              for (let i = 0; i < this.sels.length; i++) {
                csorderId.push(this.sels[i].orderId);
              }
              let para = {
                orderId: csorderId,
                cancelType: this.closeForm.cancelType,
                cancelReason: this.closeForm.cancelReason,
                orderStatus: "81"
              };
              this.listLoading = true;
              batchCancel(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                } else {
                  this.$message({
                    offset: 100,
                    message: "成功关闭订单！",
                    type: "success"
                  });
                  this.close_cancel();
                  this.getorderslist();
                }
                this.listLoading = false;
              });
            }
          }
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "信息录入格式不正确，请检查！"
          });
        }
      });
    },

    // 关闭订单对话框取消按钮
    close_cancel() {
      this.$refs["closeForm"].resetFields();
      this.closeFormVisible = false;
      this.stringnum = 0;
      this.roworderid = "";
      this.listLoading = false;
    },

    // 监听关闭订单备注字数
    close_num() {
      this.stringnum = this.closeForm.cancelReason.length;
    }
  },
  // created() {
  //   this.getorderslist();
  //   this.getordersnum();
  // },
  mounted() {
    // 防止比Home组件userInfo方法执行快拿错roleCode

    this.listLoading = true;
    setTimeout(() => {
      this.getorderslist();
      this.getordersnum();
    }, 2000)
     

    // 获取页面功能角色
    for (let i = 0; i < this.powerlist.length; i++) {
      for (let j = 0; j < this.powerlist[i].children.length; j++) {
        for (
          let c = 0;
          c < this.powerlist[i].children[j].children.length;
          c++
        ) {
          if (this.powerlist[i].children[j].href == this.$route.path) {
            this.power += this.powerlist[i].children[j].children[c].name + ",";
          }
        }
      }
    }
    setTimeout(()=>{
      this.roleCode = localStorage.getItem("roleCode")
    },1000)
  }
};
</script>

<style lang="less" scoped>
.guan {
  font-size: 5px;
}

.tu {
  background: url("../../../static/images/home/setting.png");
  margin-bottom: 20px;
}
.ding {
  // margin:0px 150px 0px;
}
.titles {
  float: left;
  /*阴影*/
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: center;
  /*内边距*/
  // white-space: nowrap;
  width: 12%;
  height: 82px;
  float: left;
  img {
    width: 80%;
    height: 60%;
    cursor: pointer;
  }
}
.cur {
  background-color: #fff;
}
.img {
  margin-bottom: 20px;
}

.statusImg {
  display: inline-block;
}
.style {
  background: #f5f5f5;
  /*背景色*/
  box-shadow: 0 2px 4px 2px #ccc;
  /*阴影*/
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  /*内边距*/
  white-space: nowrap;
  width: 11%;
  height: 40px;
  display: flex;
  flex-wrap: nowrap;
  float: left;
  margin: 0px 15px 30px;
}
.selected {
  background-color: #63d0f7;
}
.two {
  color: red;
  /*字体颜色*/
}
.imgs {
  // margin-right: 15px;
  width: 25px;
  height: 25px;
}
section {
  .title {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 16px;
    float: left;
  }
  .alldata {
    .el-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-form-item {
        width: 165px;
        height: 70px;
        padding: 15px 0;
        border: 1px solid #e9e9e9;
        text-align: center;
        background: #fff;
        span {
          display: block;
          font-size: 28px;
        }
        span:first-child {
          color: #999;
          font-size: 14px;
          height: 30px;
        }
      }
    }
  }
  .sj {
    float: none !important;
  }
  .search {
    width: 100%;
    border: 1px solid #e9e9e9;
    background: #fff;
    margin-bottom: 20px;
    .search-title {
      padding: 0 20px;
      border-bottom: 1px solid #e9e9e9;
    }
    .el-form {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .el-form-item {
        margin: 20px 0;
        padding: 0 20px;
        .el-input {
          width: 150px;
        }
        .el-select {
          width: 150px;
        }
        .el-button {
          padding-left: 8px;
        }
      }
    }
  }
  .table {
    padding: 10px 20px;
    background: #fff;
  }
  .toolbar {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    background: #fff;
    .tool-left {
      float: left;
      .el-dropdown {
        height: 38px;
        line-height: 38px;
        text-indent: 10px;
        width: 100px;
        border: 1px solid #dcdfe6;
        margin-left: 20px;
        border-radius: 4px;
        color: #606266;
      }
    }
    .el-pagination {
      float: right;
      height: 30px;
      padding: 25px 0;
    }
  }
  .el-dialog {
    .el-close-order {
      width: 100%;
      .el-form-item {
        position: relative;
        .el-textarea {
          height: 120px;
          border: 1px solid #d7d7d7;
          border-radius: 3px;
        }
        i {
          position: absolute;
          bottom: 20px;
          right: 2px;
          color: #e0e0e0;
          height: 10px;
        }
      }
      .formbtn {
        text-align: right;
      }
    }
  }
}
</style>
