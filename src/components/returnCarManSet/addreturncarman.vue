<template>
  <div class="main-wrap">
    <div class="title">
      <span class="left">{{returncarmanid == undefined ? "添加" : "修改"}}接车人</span>
      <span class="right"><i>*</i>为必填项</span>
    </div>
    <el-form :model="form" :rules="FormRules" label-width="150px" class="el-found" ref="formName">
      <el-form-item prop="photo" label="头像：">
          <img v-if="form.sex == 1" src="../../../static/images/user/male.png" style="width: 45px; height: 45px" />
          <img v-else src="../../../static/images/user/female.png" style="width: 45px; height: 45px" />
       </el-form-item>
       <el-form-item prop="name" label="姓名：">
         <el-input v-model.trim="form.name" placeholder="请填写接车人姓名(小于等于10)" :title="form.name" maxlength="10"></el-input>
       </el-form-item>
       <el-form-item prop="phone" label="手机号：">
         <el-input v-model="form.phone" placeholder="请填写11位手机号码" maxlength='11'></el-input>
       </el-form-item>
       <el-form-item prop="sort" label="排序：">
         <el-input v-model="form.sort" placeholder="请输入序号()" maxlength="9"></el-input>
       </el-form-item>
       <el-form-item prop="sex" label="性别：">
         <el-radio-group v-model="form.sex">
           <el-radio :label="'1'">男</el-radio>
           <el-radio :label="'0'">女</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item prop="remarks" label="备注：">
         <el-input type="textarea" placeholder="请输入备注(300字内)" maxlength="300" @input="change_num" v-model="form.remarks">
         </el-input>
         <i class="strnum">已输入{{stringnum}}/300</i>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="onSubmit">提交</el-button>
         <el-button @click="backListPage">返回上一页</el-button>
       </el-form-item>
     </el-form>
   </div>
 </template>
 <script>
 import { returnCarManDetail, editReturnCarMan,addReturnCarMan } from "../../api/api";

export default {
  data() {
    return {
      returncarmanid: "",
      form: {
        returnCarManId: "",
         name: "", // 接车人姓名
         phone: "", // 接车人手机号
         sort: "", // 接车人排序号
         sex: "1", // 接车人性别
         remarks: ""// 备注
       },
       FormRules: {
         name: [
           { required: true, message: "接车人姓名不能为空", trigger: "blur" },
           {
             pattern: /^.*[^ ].*$/,
             message: "接车人姓名不能是空格",
             trigger: "blur"
           }
         ],
         phone: [
           { required: true, message: "手机号不能为空", trigger: "blur" },
           {
             pattern: /^1[3456789]\d{9}$/,
             message: "请输入正确的手机号码",
             trigger: "blur"
           }
         ],
         sort: [
           { required: true, message: "排序号不能为空", trigger: "blur" },
           { min:1,max:9, message: "排序号过大(小于等于9位)", trigger: "blur" },
           {
             pattern: /[0-9]/,
             message: "请输入正确的排序号",
             trigger: "blur"
           }
         ],
         sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
         remarks: []
       },
       stringnum: 0
     };
   },
   mounted() {
     // 获取 returncarmanid
     this.returncarmanid = this.$route.query.returncarmanid;
     this.mianload();
   },
   methods: {
     // 加载页面
     mianload() {
       if (this.returncarmanid) {
         let para = {
             returnCarManId: this.returncarmanid
         };
         returnCarManDetail(para).then(res => {
           if (res.header.code !== 10000000) {
             this.$message({
               offset: 100,
               message: res.header.message,
               type: "error"
             });
           } else {
             this.form.photo = res.body.photo;
             this.form.name = res.body.name;
             this.form.phone = res.body.phone;
             this.form.sort = res.body.sort;
             this.form.sex = res.body.sex;
             this.form.remarks = res.body.remarks;
             this.change_num()
           }
         });
       }
     },
     // 监听备注字数
     change_num() {
       this.stringnum = this.form.remarks.length;
     },
     sexPhoto(e){
       if( e == 1 ){
         this.form.photo = '../../../static/images/user/male.png';
       } else{
         this.form.photo = '../../../static/images/user/female.png';
       }
     },
     // 保存
     onSubmit() {
       if (confirm("确认保存该内容吗？","提示")) {
       this.$refs["formName"].validate(valid => {
         if (valid) {
           let para = this.form;
           if (this.returncarmanid) {
             // 编辑
             para.returnCarManId = this.returncarmanid;
             editReturnCarMan(para).then(res => {
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
                 let _this = this;
                 setTimeout(function() {
                   _this.$router.push({
                     path: "/returncarmanlist"
                   });
                 }, 1000);
               }
             });
           } else {
             // 新增
             addReturnCarMan(para).then(res => {
               if (res.header.code !== 10000000) {
                 this.$message({
                   offset: 100,
                   message: res.header.message,
                   type: "error"
                 });
               } else {
                 this.$message({
                   offset: 100,
                   message: "添加成功！",
                   type: "success"
                 });
                 let _this = this;
                 setTimeout(function() {
                   _this.$router.push({
                     path: "/returncarmanlist"
                   });
                 }, 1000);
               }
             });
           }
         } else {
           this.$message({
             offset: 100,
             type: "warning",
             message: "信息录入格式不正确，请检查!"
           });
         }
       });
       }
     },
     // 返回列表界面
     backListPage() {
       this.$confirm("即将离开本页面并返回上一页，请确认", "提示", {
         type: "warning"
       })
         .then(() => {
           this.$router.push({
             path: "/returncarmanlist"
           });
         })
         .catch(() => {});
     }
   },
   beforeRouteEnter(to, from, next) {
     let returncarmanidx = to.query.returncarmanid;
     if (returncarmanidx == undefined) {
       to.meta.title = "添加接车人";
     } else {
       to.meta.title = "修改接车人";
     }
     next();
   }
 };
 </script>
 <style lang="less" scoped>
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
         color: red;
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
 .user-header{
   position: relative;
   display: inline-block;
 }
 .user-header-com{
   width: 144px;
   height: 144px;
   display: inline-block;
 }
 .header-upload-btn{
   position: absolute;
   left: 0;
   top: 0;
   opacity: 0;
   /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
 }
 .tip{
   font-size: 14px;
   color: #666;
 }
 /* error是用于错误提示 */
 .error{
   font-size: 12px;
   color: tomato;
   margin-left: 10px;
 }
 </style>
