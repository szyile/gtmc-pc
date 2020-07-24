<template>
  <section>
    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="门店名称：">
          <el-input v-model="search_name1" placeholder="门店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店代码：">
          <el-input v-model="search_id1" placeholder="门店代码"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="search_status1" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="2"></el-option>
            <el-option label="停用" value="1"></el-option>
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
        <span class="right" v-if="power.indexOf(',添加门店,') > -1" @click="addstore"><i class="fa fa-plus fw"></i>
          添加门店</span>
      </div>
      <el-table ref="multipleTable" border :data="tabledata" highlight-current-row v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column align="center" sortable prop="dealerCode" label="门店代码ID">
        </el-table-column>
        <el-table-column align="center" prop="dealerName" label="门店名称">
        </el-table-column>
        <el-table-column align="center" sortable prop="dealerRel" label="门店联系人">
        </el-table-column>
        <el-table-column align="center" sortable prop="dealerTel" label="联系人电话">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="开通时间">
        </el-table-column>
        <el-table-column v-if="power.indexOf(',启用,') > -1" align="center" label="启用">
          <template slot-scope="scope">
            <el-switch @change="handleCheck(scope.$index, scope.row)" active-value="2" inactive-value="1"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作"
          v-if="power.indexOf(',编辑,') > -1 || power.indexOf(',删除,') > -1 || power.indexOf(',创建管理员,') > -1">
          <template slot-scope="scope">
            <el-button v-if="power.indexOf(',编辑,') > -1" class="el-button--table" size="small" icon="fa fa-pencil fa-fw"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button v-if="power.indexOf(',删除,') > -1" class="el-button--table" size="small" icon="fa fa-trash fa-fw"
              @click="handleDel(scope.$index, scope.row)">删除
            </el-button>
            <el-button v-if="power.indexOf(',创建管理员,') > -1" class="el-button--table" size="small" icon="fa fa-trash fa-fw"
              @click="handleCreateManager(scope.$index, scope.row)">创建管理员
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div class="tool-left" v-if="power.indexOf(',批量关闭门店,') > -1 || power.indexOf(',批量开启门店,') > -1">
        <el-button icon="fa fa-check-square-o fa-fw" @click="allSelection()" :disabled="tabledata.length == 0">全选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="reverseSelection()" :disabled="tabledata.length == 0">反选
        </el-button>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="power.indexOf(',批量关闭门店,') > -1" :disabled="sels.length == 0"
              @click.native="handleallClose">关闭门店</el-dropdown-item>
            <el-dropdown-item v-if="power.indexOf(',批量开启门店,') > -1" :disabled="sels.length == 0"
              @click.native="handleallOpen">开启门店</el-dropdown-item>
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
  import {batchOpenStore, createStoreManager, deleteStore, editStore, storeList} from "../../api/api";
  import md5 from "js-md5";
  import {mapState} from "vuex";

  export default {
  data() {
    return {
      // 查询
      search_name: "",
      search_id: "",
      search_status: "",
      search_name1: "",
      search_id1: "",
      search_status1: "",

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
    //获取门店列表
    getTableData() {
      let para = {
        status: this.search_status,
        dealerName: this.search_name,
        dealerCode: this.search_id,
        //roleCode : localStorage.getItem("roleCode"),//当前用户角色编码
        current: this.page,
        size: this.pagesize
      };
      this.listLoading = true;
      storeList(para).then(res => {
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
      this.search_name = this.search_name1;
      this.search_id = this.search_id1;
      this.search_status = this.search_status1;
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

    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/addstore",
        query: { dealerid: row.dealerId }
      });
    },

    // 创建关联门店
    addstore() {
      this.$router.push({
        path: "/addstore"
      });
    },

    // 开启或关闭
    handleCheck(index, row) {
      editStore(row).then(res => {
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
        }
      });
    },

    // 删除
    handleDel(index, row) {
      this.$confirm("确认删除该门店吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            dealerId: row.dealerId
          };
          this.listLoading = true;
          deleteStore(para).then(res => {
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
            this.listLoading = false;
          });
        })
        .catch(() => {});
    },

    // 创建门店管理员
    handleCreateManager(index, row) {
      let para = {
        dealerId: row.dealerId,
        password: md5('123456') //使用默认密码123456
      };
      this.listLoading = true;
      createStoreManager(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.$message({
            offset: 100,
            message: "创建门店管理员成功！",
            type: "success"
          });
        }
        this.getTableData();
      });
    },

    //批量关闭门店
    handleallClose() {
      this.$confirm("确认关闭这批门店吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            dealerIds: [],
            status: "1",
            remarks: ""
          };
          for (let i = 0; i < this.sels.length; i++) {
            para.dealerIds.push(this.sels[i].dealerId);
          }
          batchOpenStore(para).then(res => {
            if (res.header.code !== 10000000) {
              this.$message({
                offset: 100,
                message: res.header.message,
                type: "error"
              });
            } else {
              this.$message({
                offset: 100,
                message: "关闭成功！",
                type: "success"
              });
              this.getTableData();
            }
          });
        })
        .catch(() => {});
    },
    //批量开启门店
    handleallOpen() {
      this.$confirm("确认开启这批门店吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            dealerIds: [],
            status: "2",
            remarks: ""
          };
          for (let i = 0; i < this.sels.length; i++) {
            para.dealerIds.push(this.sels[i].dealerId);
          }
          batchOpenStore(para).then(res => {
            if (res.header.code !== 10000000) {
              this.$message({
                offset: 100,
                message: res.header.message,
                type: "error"
              });
            } else {
              this.$message({
                offset: 100,
                message: "开启成功！",
                type: "success"
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
    .table-title {
      .left {
        float: left;
      }
      .right {
        float: right;
        background: #0079fe;
        height: 36px;
        line-height: 36px;
        width: 115px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        border-radius: 3px;
        font-weight: 300;
        cursor: pointer;
      }
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
    .el-close-order {
      width: 400px;
      margin: 0 auto;
      .el-form-item {
        position: relative;
        text-align: right;
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
    }
  }
}
</style>
