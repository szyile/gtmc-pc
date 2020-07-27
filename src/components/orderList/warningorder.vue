<template>
  <section>

    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="车牌号：">
          <el-input v-model="search_car1" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item label="剩余接单时间：">
          <el-select v-model="search_time1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="低于5分钟" value="5"></el-option>
            <el-option label="低于10分钟" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="search_state1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="已处理" value="1"></el-option>
            <el-option label="未处理" value="2"></el-option>
            <el-option label="已关闭" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fa fa-search fa-fw" @click="SearchData"> 查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 数据列表 -->
    <el-col :span="24" class="table">
      <div class="table-title title">
        数据列表
      </div>
      <el-table ref="multipleTable" border :data="users" highlight-current-row v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column align="center" sortable prop="orderId" label="订单编号">
        </el-table-column>
        <el-table-column align="center" sortable prop="creatTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" sortable prop="customerTel" label="车主账号">
        </el-table-column>
        <el-table-column align="center" sortable prop="carNum" label="车牌号">
        </el-table-column>
        <el-table-column align="center" sortable label="剩余接单时间" width="150">
          <template slot-scope="scope">
            <span class="isred" v-if='scope.row.status == 3'>0分钟0秒</span>
            <span :class="Number(scope.row.timeLeft) < 1500 ? 'isred' : ''" v-else>
              {{ scope.row.timeLeft | getDuration }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status == '1' ?  '已处理': '' }}
            {{ scope.row.status == '2' ?  '未处理': '' }}
            {{ scope.row.status == '3' ?  '已关闭': '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作"
          v-if="power.indexOf(',编辑,') > -1 || power.indexOf(',查看订单,') > -1 || power.indexOf(',重新派单,') > -1">
          <template slot-scope="scope">
            <el-button v-if="power.indexOf(',编辑,') > -1" class="el-button--table" size="small" icon="fa fa-pencil fa-fw"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button v-if="power.indexOf(',查看订单,') > -1" class="el-button--table" size="small"
              @click="handleDetail(scope.$index, scope.row)">查看订单
            </el-button>
<!--             <el-button v-if="power.indexOf(',重新派单,') > -1" class="el-button--table" size="small"
              @click="handleRefresh(scope.$index, scope.row)">重新派单
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div class="tool-left" v-if="power.indexOf(',批量修改状态,') > -1">
        <el-button icon="fa fa-check-square-o fa-fw" @click="allSelection()" :disabled="users.length == 0">全选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="reverseSelection()" :disabled="users.length == 0">反选</el-button>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="power.indexOf(',批量修改状态,') > -1" :disabled="sels.length == 0"
              @click.native="handleallState">修改状态</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
        :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>

    <!-- 编辑预警订单状态 -->
    <el-dialog title="提交处理进度" :before-close="change_cancel" :visible.sync="OrderFormVisible"
      :close-on-click-modal="false" width="600px">
      <el-form :model="change_form" :rules="changeRules" class="el-change" label-width="100px" ref="formName">
        <el-form-item prop="status" label="状态：">
          <el-select v-model="change_form.status" placeholder="请选择状态">
            <el-option label="已处理" value="1"></el-option>
            <el-option label="已关闭" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remarks" label="备注信息：">
          <el-input type="textarea" placeholder="请输入备注信息" maxlength="300" @input="change_num"
            v-model="change_form.remarks">
          </el-input>
          <i>已输入{{stringnum}}/300</i>
        </el-form-item>
        <el-form-item>
          <el-button :type="!change_form.remarks || !change_form.status?'info':'primary'" @click="change_submit">确定
          </el-button>
          <el-button @click="change_cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </section>
</template>

<script>
import {
  warnList,
  refreshOrder,
  warnOrderStatus,
  batchWarnOrderStatus
} from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 查询
      search_car: "",
      search_time: "",
      search_state: "",
      search_car1: "",
      search_time1: "",
      search_state1: "",

      // 表格
      users: [],
      sels: [], //列表选中列

      // 分页
      total: 0,
      page: 1,
      pagesize: 10,

      // 编辑预警订单状态
      OrderFormVisible: false,
      change_form: {
        orderWarnId: "",
        status: "",
        remarks: ""
      },
      changeRules: {
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        remarks: [
          { required: true, message: "备注信息不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "备注信息不能是空格",
            trigger: "blur"
          }
        ]
      },
      stringnum: 0,
      // 权限
      power: ",",
      // 定时器
      timer: "",

      // loading
      listLoading: false
    };
  },
  computed: {
    ...mapState({
      powerlist: state => state.power
    })
  },
  filters: {
    // 毫秒转化成剩余时间
    getDuration(value) {
      let minutes = Math.floor(((value % 86400) % 3600) / 60);
      let seconds = Math.floor(((value % 86400) % 3600) % 60);
      if (Number(value) < 0) {
        minutes = 0;
        seconds = 0;
      }
      let duration = minutes + "分钟" + seconds + "秒";
      return duration;
    }
  },
  methods: {
    //获取用户列表
    getUsers(callback) {
      let para = {
        current: this.page,
        size: this.pagesize,
        status: this.search_state,
        carNum: this.search_car,
        timeLeft: this.search_time
      };
      if(window.localStorage.getItem('isAdmin')==1){
        para.dealerCode=localStorage.getItem('loginName')
        // console.log(para)
      }
      this.listLoading = true;
      warnList(para).then(res => {
        //回调
        if(callback){
          callback(res);
        }
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.users = (res.body&&res.body.records)?res.body.records:[];
          this.total = (res.body&&res.body.total)?res.body.total:0;
        }
        this.listLoading = false;
      });
    },

    // 改变每页条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUsers();
    },

    // 改变页数
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    // 查询
    SearchData() {
      this.search_car = this.search_car1;
      this.search_time = this.search_time1;
      this.search_state = this.search_state1;
      this.page=1;
      this.getUsers();
    },
    // 全选
    allSelection() {
      this.$refs.multipleTable.toggleAllSelection(this.users);      
    },

    // 反选
    reverseSelection() {
      this.users.forEach(row => {
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

    // 监听备注信息字数
    change_num() {
      this.stringnum = this.change_form.remarks.length;
    },

    // 编辑预警订单状态弹层确定按钮
    change_submit() {
      this.$refs["formName"].validate(valid => {
        if (valid) {
          if (this.stringnum > 300) {
            this.$message({
              offset: 100,
              type: "warning",
              message: "备注信息不能超过300个字符！"
            });
          } else {
            let para = this.change_form;
            this.listLoading = true;
            if (this.change_form.orderWarnId) {
              // 编辑单个状态
              warnOrderStatus(para).then(res => {
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
                  this.change_cancel();
                  this.getUsers();
                }
                this.listLoading = false;
              });
            } else {
              // 批量修改状态
              para.orderWarnId = [];
              for (let i = 0; i < this.sels.length; i++) {
                para.orderWarnId.push(this.sels[i].orderWarnId);
              }
              batchWarnOrderStatus(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                } else {
                  this.$message({
                    offset: 100,
                    message: "状态修改成功！",
                    type: "success"
                  });
                  this.change_cancel();
                  this.getUsers();
                }
                this.listLoading = false;
              });
            }
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

    // 编辑预警订单状态弹层取消按钮
    change_cancel() {
      this.OrderFormVisible = false;
      this.change_form = {
        orderWarnId: "",
        status: "",
        remarks: ""
      };
      this.stringnum = 0;
    },

    // 编辑订单
    handleEdit(index, row) {
      this.change_form.orderWarnId = row.orderWarnId;
      this.OrderFormVisible = true;
    },

    // 重新派单
    handleRefresh(index, row) {
      let para = {
        orderId: row.orderId
      };
      refreshOrder(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.$message({
            offset: 100,
            message: "重新派单成功！",
            type: "success"
          });
          this.getUsers();
        }
      });
    },

    //批量修改状态
    handleallState() {
      this.$confirm("确认修改这批订单吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.OrderFormVisible = true;
        })
        .catch(() => {});
    }
  },
  mounted() {
    let _this = this;
    this.getUsers(res=>{
    this.timer = setInterval(function() {
      _this.getUsers();
    }, 60*1000);
    });
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

  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
section {
  .title {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 16px;
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
      .el-form-item {
        margin: 20px;
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
    .isred {
      color: #fb6260;
    }
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
    .el-form-item {
      position: relative;
      .el-select {
        width: 80%;
      }
      .el-textarea {
        width: 80%;
        height: 120px;
        border: 1px solid #d7d7d7;
        border-radius: 3px;
      }
      i {
        position: absolute;
        bottom: 20px;
        right: 96px;
        color: #e0e0e0;
        height: 10px;
      }
    }
    .el-form-item:last-child {
      text-align: right;
      padding-right: 100px;
    }
  }
}
</style>