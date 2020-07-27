// 引入axios
import axios from 'axios';
import md5 from 'js-md5';
import _this from '../main.js';
import {_debounce} from "@/utils"

axios.defaults.timeout =  60*1000; //超时时间 60秒

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function(config) {
    //获取请求参数
    let params = JSON.stringify(config.data||{});
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : "";
    let appid = "PADS003";
    let appkey = 'FA2PeiRO4Yy81iQiwzCWA'
    let timeLong = new  Date().getTime();
    // 配置请求头
    config.headers['Content-Type'] = 'application/json';
    config.headers.token =  token;
    config.headers.appid =  appid;
    config.headers.timestamp = timeLong;
    if (token) {
        config.headers.sign = md5('appid='+appid+'&appkey='+appkey+'&timestamp='+timeLong+'&token='+token+params).toUpperCase()
    } else {
        config.headers.sign = md5('appid='+appid+'&appkey='+appkey+'&timestamp='+timeLong+params).toUpperCase()
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  // console.log(response,'response');
  // console.log(_this,'_this');
  if(response.data.header.code=='10000001'){ //token失效 登录超时
    if(response.data.body == '12000000'){
      localStorage.removeItem('token') //token失效  清除token
      toLogin();
    }
  }
  return response;
}, function(error) {
  let errStatus =(error.response&&error.response.status)? error.response.status.toString():'';
  if (errStatus == "404") {
    _this.$message({
      offset: 100,
      message: '无法找到指定位置的资源',
      type: "error"
    })
  }
  if (errStatus.substr(0, 1) == "5") {
    _this.$message({
      offset: 100,
      message: '服务器异常',
      type: "error"
    })
  }
  if (errStatus.substr(0, 1) == "4" && errStatus != "404") {
    _this.$message({
      offset: 100,
      message: '访问异常',
      type: "error"
    })
  }
  // 超时 无响应的情况
  if (errStatus=="") {
    _this.$message({
      offset: 100,
      message:error.message ,
      type: "error"
    })
  }

  return Promise.reject(error);
});

// let fetchcar = "https://test.icheyou.net/api";  //测试
//let fetchcar = "/fetchcar";                    //开发
let fetchcar = 'https://iclub-padstest.gtmc.com.cn/api';//广丰测试
// let fetchcar = "http://172.20.10.10:8000/"

// let fetchcar = 'https://iclub-pads.gtmc.com.cn/api';  //广丰正式



// let fetchcar = process.env.SERV_ADDR; // 接口服务地址 在config/*.env.js进行配置

let toLogin =_debounce(function(){ //5秒内只能有一次跳转到登录页面
  _this.$message({
    offset: 100,
    message: 'TOKEN失效,请重新登录',
    type: "warning"
  })
  setTimeout(function(){
    _this.$router.replace({
      path:'/login'
    })
  },2*1000)
},5*1000)

// 验证码
export const yzmLogin = params => {
  //let  param = JSON.stringify(params||{})
  return axios.post(fetchcar +"/v1.0/w/pads/system/user/captcha",params,{
/*   headers: {
      sign:md5("appid="+appid+"&appkey="+appkey+"&timestamp="+ new Date().getTime()).toUpperCase()
  } */
}).then(res => res.data)};

// 登录
export const requestLogin = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/login", params, {
 /*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 修改账号密码
export const changePassword = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/password", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 订单统计
export const orderCount = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/count", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 订单列表
export const orderList = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/page/", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 订单详情
export const orderDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/detail", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 修改订单
export const editOrder = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/update", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 确认下单
export const downOrder = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/confirm", params, {
    /*   headers: {
          sign:doSign(params)
      } */
}).then(res => res.data)};

// 取车下单
export const newGetOrder = params => { return axios.post(fetchcar +"/v1.0/m/pads/order/new-get-order", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 送车下单
export const newPushOrder = params => { return axios.post(fetchcar +"/v1.0/m/pads/order/new-push-order", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 订单详情操作信息
export const orderOperate = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/operator/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 取消订单
export const orderCancel = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/cancel", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 批量取消订单
export const batchCancel = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/batch-cancel", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 预警列表
export const warnList = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/warn/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 重新派单
export const refreshOrder = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/resend", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 编辑预警订单状态
export const warnOrderStatus = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/warn/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 批量修改预警订单状态
export const batchWarnOrderStatus = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/warn/batch-update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 接车人分页列表
export const returnCarManList = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/page", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 接车人详情
export const returnCarManDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/detail", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 新增接车人
export const addReturnCarMan = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/add", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 编辑接车人
export const editReturnCarMan = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/update", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 删除接车人
export const deleteReturnCarMan = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/delete", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 批量删除接车人
export const batchDeleteReturnCarMan = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/batch-delete", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 接车人列表
export const returnCarMans = params => { return axios.post(fetchcar +"/v1.0/w/pads/returncarman/list", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 活动列表
export const activeList = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 活动详情
export const activeDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/detail", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 新增活动
export const addActive = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/add", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 编辑活动
export const updateActive = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 删除活动
export const deleteActive = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/delete", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 批量开启/关闭活动
export const batchOpenActive = params => { return axios.post(fetchcar +"/v1.0/w/pads/activity/batch-open", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 门店列表
export const storeList = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 门店详情
export const storeDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/detail", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};
// 门店详情
export const storeDetailByCode = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/detailByCode", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 新增门店
export const addStore = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/add", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 编辑门店
export const editStore = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 删除门店
export const deleteStore = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/delete", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 创建门店管理员
export const createStoreManager = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/manager/create", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 批量开启/关闭门店
export const batchOpenStore = params => { return axios.post(fetchcar +"/v1.0/w/pads/dealer/batch-open", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 配置单价/是否开通验证门店
export const priceInfo = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/price/search", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 修改配置单价
export const setPrice = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/price/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 修改是否开通门店
export const checkOpen = params => { return axios.post(fetchcar +"/v1.0/w/pads/order/config/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 角色列表
export const roleList = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 角色明细
export const roleDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/detail", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 角色信息
export const roleInfo = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/info", params, {
  /*   headers: {
        sign:doSign(params)
    } */
}).then(res => res.data)};

// 新增角色
export const addRole = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/add", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 编辑角色
export const editRole = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 删除角色
export const deleteRole = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/delete", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 角色菜单列表
export const roleMenuList = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/role-menu/list", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 菜单列表
export const menuList = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/role/menu/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 用户列表
export const userList = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 添加账号
export const addUser = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/add", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 账号详情
export const userDetail = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/detail", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 编辑账号
export const editUser = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/update", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 删除账号
export const deleteUser = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/delete", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 批量启用/禁用账号
export const checkOpenUser = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/batch-flag", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};

// 登录日志
export const loginRecord = params => { return axios.post(fetchcar +"/v1.0/w/pads/system/user/login/page", params, {
/*   headers: {
      sign:doSign(params)
  } */
}).then(res => res.data)};
