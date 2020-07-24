<template>
  <section>
    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="接车人姓名：">
          <el-input v-model="search_name1" placeholder="接车人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="search_id1" placeholder="手机号"></el-input>
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
        <span class="right" v-if="power.indexOf(',添加接车人,') > -1" @click="addreturncarman"><i class="fa fa-plus fw"></i>
          添加</span>
      </div>
      <el-table ref="multipleTable" border :data="tabledata" highlight-current-row v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column fixed="left" type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column align="center" sortable label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.photo" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="姓名">
        </el-table-column>
        <el-table-column align="center" sortable label="  性别">
          <template slot-scope="scope">
            {{scope.row.sex == 1 ? "男" : ""}}
            {{scope.row.sex == 0 ? "女" : ""}}
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="phone" label="手机号">
        </el-table-column>
        <el-table-column align="center" sortable label="接车状态">
          <template slot-scope="scope">
            {{scope.row.returnCarStatus == 1 ? "忙碌" : ""}}
            {{scope.row.returnCarStatus == 0 ? "空闲" : ""}}
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="sort" label="排序">
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
      <div class="tool-left" v-if="power.indexOf(',批量删除接车人,') > -1">
        <el-button icon="fa fa-check-square-o fa-fw" @click="allSelection()" :disabled="tabledata.length == 0">全选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="reverseSelection()" :disabled="tabledata.length == 0">反选
        </el-button>
        <el-button icon="fa fa-square-o fa-fw" @click="handleallDelete()" :disabled="tabledata.length == 0">删除
        </el-button>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
        :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {batchDeleteReturnCarMan, deleteReturnCarMan, returnCarManList} from "../../api/api";
  import {mapState} from "vuex";

  export default {
  data() {
    return {
      // 查询
      search_name: "",//接车人姓名key
      search_id: "", //接车人手机号key
      search_name1: "",//接车人姓名查询条件值
      search_id1: "",//接车人手机号查询条件值

      // 表格
      tabledata: [],
      sels: [], //列表选中列

      // 分页
      total: 0,
      page: 1, //第一页
      pagesize: 10, //页大小
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
    //获取接车人列表
    getTableData() {
      let para = {
        name: this.search_name,//接车人姓名
        phone: this.search_id, //接车人手机号
        roleCode : localStorage.getItem("roleCode"),//当前用户角色编码
        current: this.page,
        size: this.pagesize
      };
      this.listLoading = true;
      returnCarManList(para).then(res => {
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
        path: "/addreturncarman",
        query: { returncarmanid: row.returnCarManId }
      });
    },

    // 添加接车人
    addreturncarman() {
      this.$router.push({
        path: "/addreturncarman"
      });
    },

    // 删除接车人
    handleDel(index, row) {
      this.$confirm("确认删除该接车人吗?", "删除确认", {
        type: "warning"
      })
        .then(() => {
          let para = {
            returnCarManId: row.returnCarManId
          };
          this.listLoading = true;
          deleteReturnCarMan(para).then(res => {
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

    //批量删除接车人
    handleallDelete() {

       if(this.sels.length==0){
         alert('请选择要删除的联系人');
      this.$confirm("确认删除这批接车人吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            returnCarManIds: [],
            remarks: ""
          };
          for (let i = 0; i < this.sels.length; i++) {
            para.returnCarManIds.push(this.sels[i].returnCarManId);
          }
          batchDeleteReturnCarMan(para).then(res => {
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
    }
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
