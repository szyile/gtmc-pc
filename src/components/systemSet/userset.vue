<template>
  <section>
    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="登录账号：">
          <el-input v-model="search_user1" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="search_phone1" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="员工角色：">
          <el-select v-model="search_role1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in roledata" :key="index" :label="item.name" :value="item.roleId">
            </el-option>
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
        <span class="left">数据列表</span>
        <span class="right" v-if="power.indexOf(',添加,') > -1" @click="adduser"><i class="fa fa-plus fw"></i> 添加</span>
      </div>
      <el-table ref="multipleTable" border :data="tabledata" highlight-current-row v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column align="center" sortable prop="name" label="员工姓名">
        </el-table-column>
        <el-table-column align="center" sortable label="性别">
          <template slot-scope="scope">
            {{scope.row.sex == 1 ? "男" : ""}}
            {{scope.row.sex == 0 ? "女" : ""}}
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="roleName" label="当前角色">
        </el-table-column>
        <el-table-column align="center" prop="loginName" label="登录账号">
        </el-table-column>
        <el-table-column align="center" prop="phone" label="手机号">
        </el-table-column>
        <el-table-column v-if="power.indexOf(',启用,') > -1" align="center" label="启用">
          <template slot-scope="scope">
            <el-switch @change="handleCheck(scope.$index, scope.row)" active-value="1" inactive-value="0"
              v-model="scope.row.loginFlag">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作"
          v-if="power.indexOf(',编辑,') > -1 || power.indexOf(',删除,') > -1">
          <template slot-scope="scope">
            <el-button v-if="power.indexOf(',编辑,') > -1" class="el-button--table" size="small" icon="fa fa-pencil fa-fw"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button v-if="power.indexOf(',删除,') > -1" class="el-button--table" size="small" icon="fa fa-trash fa-fw"
              @click="handleDel(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div class="tool-left" v-if="power.indexOf(',批量启用员工,') > -1 || power.indexOf(',批量停用员工,') > -1">
        <el-button icon="fa fa-check-square-o fa-fw" @click="allSelection()" :disabled="tabledata.length == 0">全选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="reverseSelection()" :disabled="tabledata.length == 0">反选
        </el-button>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="power.indexOf(',批量启用员工,') > -1" :disabled="sels.length == 0"
              @click.native="handleallOpen">启用员工</el-dropdown-item>
            <el-dropdown-item v-if="power.indexOf(',批量停用员工,') > -1" :disabled="sels.length == 0"
              @click.native="handleallStop">停用员工</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
        :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import {
  userList,
  roleList,
  deleteUser,
  editUser,
  checkOpenUser
} from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 查询
      search_user: "",
      search_phone: "",
      search_role: "",
      search_user1: "",
      search_phone1: "",
      search_role1: "",

      // 角色列表
      roledata: [],

      // 表格
      tabledata: [],
      sels: [], //列表选中列

      // 分页
      total: 0,
      page: 1,
      pagesize: 10,
      // 权限
      power: ",",

      // loading
      listLoading: false
    };
  },
  computed: {
    ...mapState({
      powerlist: state => state.power
    })
  },
  methods: {
    //获取用户列表
    getTableData() {
      let para = {
        current: this.page,
        size: this.pagesize,
        roleId: this.search_role,
        name: "",
        loginName: this.search_user,
        email: "",
        phone: this.search_phone
      };
      this.listLoading = true;
      userList(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.tabledata = (res.body&&res.body.records)?res.body.records:[];
          this.total = (res.body&&res.body.total)?res.body.total:0;
        }
        this.listLoading = false;
      });
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
    // 改变每页条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTableData();
    },
    // 改变页数
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
    // 查询
    SearchData() {
      this.search_user = this.search_user1;
      this.search_phone = this.search_phone1;
      this.search_role = this.search_role1;
      this.page=1;
      this.getTableData();
    },
    // 全选
    allSelection() {
      this.$refs.multipleTable.toggleAllSelection(this.tabledata);
    },
    // 反选
    reverseSelection() {
      this.tabledata.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    // 选中某行
    handleSelectionChange(sels) {
      this.sels = sels;
    },
    // 添加
    adduser() {
      this.$router.push({
        path: "/addoredit"
      });
    },
    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/addoredit",
        query: { userid: row.userId }
      });
    },
    // 删除
    handleDel(index, row) {
      this.$confirm("确认删除该员工吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            userId: row.userId
          };
          deleteUser(para).then(res => {
            if (res.header.code !== 10000000) {
              this.$message({
                offset: 100,
                message: res.header.message,
                type: "error"
              });
            } else {
              this.$message({
                offset: 100,
                message: "删除成功！",
                type: "success"
              });
              this.getTableData();
            }
          });
        })
        .catch(() => {});
    },
    // 开启或关闭
    handleCheck(index, row) {
      editUser(row).then(res => {
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
            message: "状态修改成功！"
          });
        }
      });
    },
    // 批量启用员工
    handleallOpen() {
      this.$confirm("确认启用这批员工吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            userIds: "",
            loginFlag: "1"
          };
          for (let i = 0; i < this.sels.length; i++) {
            para.userIds += this.sels[i].userId + ",";
          }
          para.userIds.substr(0, para.userIds.length - 1);
          checkOpenUser(para).then(res => {
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
                message: "成功启用这批员工！"
              });
              this.getTableData();
            }
          });
        })
        .catch(() => {});
    },
    // 批量停用员工
    handleallStop() {
      this.$confirm("确认停用这批员工吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            userIds: "",
            loginFlag: "0"
          };
          for (let i = 0; i < this.sels.length; i++) {
            para.userIds += this.sels[i].userId + ",";
          }
          para.userIds.substr(0, para.userIds.length - 1);
          checkOpenUser(para).then(res => {
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
                message: "成功停用这批员工！"
              });
              this.getTableData();
            }
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getTableData();
    this.getRoleData();
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
        margin: 20px 20px;
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
    .table-title {
      .left {
        float: left;
      }
      .right {
        float: right;
        background: #0079fe;
        height: 36px;
        line-height: 36px;
        width: 86px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        border-radius: 3px;
        font-weight: 300;
        cursor: pointer;
      }
    }
    .el-button--table {
      padding: 10px 5px;
      margin: 0;
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
    .el-form-item:last-child {
      padding-left: 100px;
    }
  }
}
</style>