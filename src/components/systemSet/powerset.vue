<template>
  <section>
    <!-- 权限设置 -->
    <el-col :span="24" class="table">
      <div class="table-title title">
        权限设置
      </div>
      <table class="main-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>模块</th>
            <th>页面</th>
            <th>功能</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tableData" :key="index">
            <td>
              <p :style="'height:'+30*item.childrenNum+'px;line-height:'+30*item.childrenNum+'px'">
                <input type="checkbox" :v-model="item.menuId" @change="handleCheckAllChange(item)"
                  :checked="item.checked">
                <label>{{item.name}}</label>
              </p>
            </td>
            <td>
              <p v-for="(child0,index0) in item.children" :key="index0"
                :style="'height:'+30*child0.childrenNum+'px;line-height:'+30*child0.childrenNum+'px'">
                <input type="checkbox" :v-model="child0.menuId" @change="handleCheckItemChange(item,child0)"
                  :checked="child0.checked">
                <label>{{child0.name}}</label>
              </p>
            </td>
            <td>
              <div v-for="(child1,index1) in item.children" :key="index1"
                :style="'height:'+30*child1.childrenNum+'px;line-height:30px'">
                <p v-for="(child2,index2) in child1.children" :key="index2">
                  <input type="checkbox" :v-model="child2.menuId" @change="handleCheckOnceChange(item,child1,child2)"
                    :checked="child2.checked">
                  <label>{{child2.name}}</label>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table-footer">
        <el-button @click="submitbtn" type="primary">提交</el-button>
      </div>
    </el-col>
  </section>
</template>

<script>
import { menuList, roleMenuList, editRole } from "../../api/api";
export default {
  data() {
    return {
      roleid: "",

      // 所有权限
      tableData: [],

      // 角色权限
      roleData: []
    };
  },
  methods: {
    // 角色权限菜单列表
    rolemenuload() {
      let para = {
        roleId: this.roleid
      };
      roleMenuList(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          if (res.body != "null" && res.body != null) {
            this.roleData = res.body;
          }
          let _this = this;
          setTimeout(function() {
            _this.mainload();
          }, 200);
        }
      });
    },
    // 权限菜单列表
    mainload() {
      let para = {
        current: 1,
        size: 1000
      };
      menuList(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          let recordarr = res.body.records;
          for (let c = 0; c < recordarr.length; c++) {
            recordarr[c]["checked"] = false;
            for (let d = 0; d < this.roleData.length; d++) {
              if (recordarr[c].menuId == this.roleData[d].menuId) {
                recordarr[c]["checked"] = true;
              }
            }
          }
          let recordnewarr1 = [];
          let recordnewarr2 = [];
          let recordnewarr3 = [];
          for (let i = 0; i < recordarr.length; i++) {
            if (recordarr[i].sort < "10") {
              recordnewarr1.push(recordarr[i]);
            }
            if (recordarr[i].sort > "10" && recordarr[i].sort < "100") {
              recordnewarr2.push(recordarr[i]);
            }
            if (recordarr[i].sort > "100" && recordarr[i].sort < "1000") {
              recordnewarr3.push(recordarr[i]);
            }
          }
          for (let j = 0; j < recordnewarr2.length; j++) {
            recordnewarr2[j]["children"] = [];
            let num = 0;
            for (let x = 0; x < recordnewarr3.length; x++) {
              if (recordnewarr2[j].menuId == recordnewarr3[x].parentId) {
                recordnewarr2[j]["children"].push(recordnewarr3[x]);
                num++;
              }
              if (x == recordnewarr3.length - 1) {
                if (num == 0) {
                  recordnewarr2[j]["childrenNum"] = 1;
                } else {
                  recordnewarr2[j]["childrenNum"] = num;
                }
              }
            }
          }
          for (let a = 0; a < recordnewarr1.length; a++) {
            recordnewarr1[a]["children"] = [];
            let num1 = 0;
            for (let b = 0; b < recordnewarr2.length; b++) {
              if (recordnewarr1[a].menuId == recordnewarr2[b].parentId) {
                recordnewarr1[a]["children"].push(recordnewarr2[b]);
                num1 = Number(recordnewarr2[b].childrenNum) + Number(num1);
              }
              if (b == recordnewarr2.length - 1) {
                recordnewarr1[a]["childrenNum"] = num1;
              }
            }
          }
          this.tableData = recordnewarr1;
        }
      });
    },
    // 选中模块
    handleCheckAllChange(val) {
      val.checked = !val.checked;
      // 页面和功能全选
      for (let i = 0; i < val.children.length; i++) {
        val.children[i].checked = val.checked;
        for (let j = 0; j < val.children[i].children.length; j++) {
          val.children[i].children[j].checked = val.checked;
        }
      }
    },
    // 选中页面
    handleCheckItemChange(val, value) {
      value.checked = !value.checked;
      // 功能全选
      for (let a = 0; a < value.children.length; a++) {
        value.children[a].checked = value.checked;
      }
      // 模块是否选中
      if (value.checked) {
        val.checked = true;
      } else {
        let num = 0;
        for (let b = 0; b < val.children.length; b++) {
          if (!val.children[b].checked) {
            num++;
          }
        }
        if (num == val.children.length) {
          val.checked = false;
        }
      }
    },
    // 选中功能
    handleCheckOnceChange(val, value, valnr) {
      valnr.checked = !valnr.checked;
      if (valnr.checked) {
        // 页面选中
        value.checked = true;
        // 模块选中
        val.checked = true;
      }
    },
    // 提交
    submitbtn() {
      let checkdata = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let newdata = this.tableData[i].children;
        if (this.tableData[i].checked) {
          checkdata.push({
            menuId: this.tableData[i].menuId,
            operTags: this.tableData[i].permission
          });
        }
        for (let j = 0; j < newdata.length; j++) {
          let newdata1 = newdata[j].children;
          if (newdata[j].checked) {
            checkdata.push({
              menuId: newdata[j].menuId,
              operTags: newdata[j].permission
            });
          }
          for (let x = 0; x < newdata1.length; x++) {
            if (newdata1[x].checked) {
              checkdata.push({
                menuId: newdata1[x].menuId,
                operTags: newdata1[x].permission
              });
            }
          }
        }
      }
      let para = {
        roleId: this.roleid,
        menuList: checkdata
      };
      editRole(para).then(res => {
        if (res.header.code !== 10000000) {
          this.$message({
            offset: 100,
            message: res.header.message,
            type: "error"
          });
        } else {
          this.$message({
            offset: 100,
            message: "权限设置成功！",
            type: "success"
          });
          let _this = this;
          setTimeout(function() {
            _this.$router.push({
              path: "/roleset"
            });
          }, 1000);
        }
      });
    },
  },
  mounted() {
    this.roleid = this.$route.query.roleid;
    this.rolemenuload();
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
  .table {
    padding: 10px 20px;
    background: #fff;
    .main-table {
      width: 100%;
      thead {
        tr {
          th {
            height: 50px;
            background-color: #f5f5f5;
            font-size: 16px;
            font-weight: 700;
            color: #666666;
            border-top: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;
            text-align: left;
            padding: 0 10px;
          }
        }
      }
      tbody {
        td {
          border-bottom: 1px solid #ebeef5;
          padding: 0 10px;
          font-size: 12px;
          div {
            border-bottom: 1px dashed #ebeef5;
          }
          div:last-child {
            border-bottom: none;
          }
          p {
            display: flex;
            justify-content: start;
            align-items: center;
          }
        }
        td:last-child {
          color: #999999;
        }
      }
    }
    .table-footer {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      .el-button {
        padding: 12px 50px;
      }
    }
  }
}
</style>