<template>
  <section>
    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="登录人员：">
          <el-input v-model="search_user1" placeholder="登录人员"></el-input>
        </el-form-item>
        <el-form-item label="时间范围：">
          <el-date-picker v-model="search_time1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
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
      <el-table ref="multipleTable" border :data="tabledata" highlight-current-row v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" sortable prop="createTime" label="日志时间">
        </el-table-column>
        <el-table-column align="center" label="终端设备">
          <template slot-scope="scope">
            {{scope.row.terminalType == '1' ? "web" : ""}}
            {{scope.row.terminalType == '2' ? "app" : ""}}
            {{scope.row.terminalType == '3' ? "微信" : ""}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operatingSystem" label="操作系统">
        </el-table-column>
        <el-table-column align="center" prop="browser" label="浏览器">
        </el-table-column>
        <el-table-column align="center" prop="loginName" label="登录人员">
        </el-table-column>
        <el-table-column align="center" prop="ip" label="IP地址">
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
        :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { loginRecord } from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 查询
      search_user: "",
      search_time: ["", ""],
      search_user1: "",
      search_time1: ["", ""],

      // 表格
      tabledata: [],

      // 分页
      total: 0,
      page: 1,
      pagesize: 10,

      // loading
      listLoading: false
    };
  },
  methods: {
    //获取用户列表
    getTableData() {

      let para = {
        loginName: this.search_user,
        startTime: this.search_time[0]?this.search_time[0]+' 00:00:00':'',
        endTime: this.search_time[1]?this.search_time[1]+' 23:59:59':'',
        current: this.page,
        size: this.pagesize
      };
      this.listLoading = true;
      loginRecord(para).then(res => { 
        console.log(res);
               
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.tabledata = (res.body&&res.body.records)?res.body.records:[];
          console.log( this.tabledata);
          
          this.total = (res.body&&res.body.total)?res.body.total:0;
        }
        this.listLoading = false;
      });
    },
    handleSelectionChange(){

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
    SearchData(){
      this.search_user = this.search_user1;
      this.search_time = this.search_time1;
      this.page=1;
      this.getTableData();
    }
  },
  mounted() {
    this.getTableData();
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
}
</style>