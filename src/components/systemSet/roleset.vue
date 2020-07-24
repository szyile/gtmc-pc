<template>
  <section>
    <!-- 数据筛选 -->
    <el-col :span="24" class="search">
      <div class="search-title title">数据筛选</div>
      <el-form :inline="true">
        <el-form-item label="角色名称：">
          <el-input v-model="search_rolename1" placeholder="角色名称"></el-input>
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
        <span class="right" v-if="power.indexOf(',添加,') > -1" @click="addrole"><i class="fa fa-plus fw"></i> 添加</span>
      </div>
      <el-table ref="multipleTable" border :data="tabledata" highlight-current-row v-loading="listLoading">
        <el-table-column align="center" sortable prop="name" label="角色名称">
        </el-table-column>
        <el-table-column align="center" sortable prop="remarks" label="角色描述">
        </el-table-column>
        <el-table-column align="center" sortable prop="updateTime" label="更新时间">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作"
          v-if="power.indexOf(',设置权限,') > -1 || power.indexOf(',编辑,') > -1 || power.indexOf(',删除,') > -1">
          <template slot-scope="scope">
            <el-button v-if="power.indexOf(',设置权限,') > -1" class="el-button--table" size="small"
              icon="fa fa-wrench fa-fw" @click="handlePower(scope.$index, scope.row)">设置权限
            </el-button>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
        :current-page="page" :page-size="pagesize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>

    <!-- 添加/修改角色 -->
    <el-dialog :title="role_dialog" :before-close="change_cancel" :visible.sync="RoleFormVisible"
      :close-on-click-modal="false" width="600px">
      <el-form :model="change_form" :rules="changeRules" class="el-change" label-width="100px" ref="formName">
        <el-form-item prop="name" :label="role_dialog+'：'">
          <el-input placeholder="请输入角色名称" v-model="change_form.name"  maxlength=32>
          </el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input type="textarea" placeholder="请输入角色描述" maxlength="300" @input="change_num"
            v-model="change_form.remarks">
          </el-input>
          <i>已输入{{stringnum}}/300</i>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="change_submit">确定</el-button>
          <el-button @click="change_cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { roleList, addRole, editRole, deleteRole } from "../../api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 查询
      search_rolename: "",
      search_rolename1: "",

      // 表格
      tabledata: [],

      // 添加/修改角色弹层
      role_dialog: "添加/修改角色",
      RoleFormVisible: false,
      change_form: {
        roleId: "",
        name: "",
        remarks: ""
      },
      changeRules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          {
            pattern: /^.*[^ ].*$/,
            message: "角色名称不能是空格",
            trigger: "blur"
          }
        ]
      },
      stringnum: 0,

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
    //获取角色列表
    getTableData() {
      let para = {
        current: this.page,
        size: this.pagesize,
        name: this.search_rolename
      };
      this.listLoading = true;
      roleList(para).then(res => {
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
      this.search_rolename = this.search_rolename1;
      this.page=1;
      this.getTableData();
    },
    // 设置权限
    handlePower(index, row) {
      this.$router.push({
        path: "/powerset",
        query: { roleid: row.roleId }
      });
    },

    // 添加角色
    addrole() {
      this.RoleFormVisible = true;
      this.role_dialog = "添加角色";
    },

    // 编辑角色
    handleEdit(index, row) {
      this.RoleFormVisible = true;
      this.role_dialog = "编辑角色";
      this.change_form = {
        roleId: row.roleId,
        name: row.name,
        remarks: row.remarks
      };
      this.stringnum = row.remarks.length;
    },

    // 监听角色描述字数
    change_num() {
      this.stringnum = this.change_form.remarks.length;
    },

    // 添加/修改角色弹层确定按钮
    change_submit() {
      this.$refs["formName"].validate(valid => {
        if (valid) {
          if (this.stringnum > 300) {
            this.$message({
              offset: 100,
              type: "warning",
              message: "角色描述不能超过300个字符！"
            });
            return false
          } else {
            let para = this.change_form;
            this.listLoading = true;
            if (this.change_form.roleId) {
              // 编辑角色
              editRole(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                  return false
                } else {
                  this.$message({
                    offset: 100,
                    message: "角色修改成功！",
                    type: "success"
                  });
                  this.change_cancel();
                  this.getTableData();
                }
                this.listLoading = false;
              });
            } else {
              // 新增角色
              addRole(para).then(res => {
                if (res.header.code !== 10000000) {
                  this.$message({
                    offset: 100,
                    message: res.header.message,
                    type: "error"
                  });
                  return false
                } else {
                  this.$message({
                    offset: 100,
                    message: "角色添加成功！",
                    type: "success"
                  });
                  this.change_cancel();
                  this.getTableData();
                }
                this.listLoading = false;
              });
            }
          }
        } else {
          this.$message({
            offset: 100,
            type: "warning",
            message: "请输入角色名称！"
          });
        }
      });
    },

    // 添加/修改角色弹层取消按钮
    change_cancel() {
      this.RoleFormVisible = false;
      this.change_form = {
        roleId: "",
        name: "",
        remarks: ""
      };
      this.stringnum = 0;
    },

    // 删除
    handleDel(index, row) {
      this.$confirm("确认删除该角色吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { roleId: row.roleId };
          this.listLoading = true;
          deleteRole(para).then(res => {
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
    .userlist {
      color: #0079fe;
      cursor: pointer;
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
    .el-form-item {
      position: relative;
      .el-input {
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