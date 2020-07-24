import Vue from 'vue'
import Router from 'vue-router'
// 主框架
import Home from '@/components/Home'
// 404页面
import NotFound from '@/components/404'
// 登录页
import Login from '@/components/login/login'
// 订单信息-订单一览
import OrderList from '@/components/orderList/orderlist'
// 订单信息-订单详情
import OrderInfo from '@/components/orderList/orderinfo'
// 订单信息-修改订单
import EditOrder from '@/components/orderList/editorder'
// 订单信息-预警一览
import WarningOrder from '@/components/orderList/warningorder'
// 接车人管理-接车一览
import ReturnCarManList from '@/components/returnCarManSet/returncarmanlist'
// 接车人管理-添加/编辑接车人
import AddReturnCarMan from '@/components/returnCarManSet/addreturncarman'
// 运营管理-活动一览
import ActiveList from '@/components/operationSet/activelist'
// 运营管理-修改/创建关联活动
import FoundActive from '@/components/operationSet/foundactive'
// 运营管理-门店一览
import StoreList from '@/components/operationSet/storelist'
// 运营管理-添加/编辑门店
import AddStore from '@/components/operationSet/addstore'
// 运营管理-单价配置
import Configuration from '@/components/operationSet/configuration'
// 系统设置-角色管理
import RoleSet from '@/components/systemSet/roleset'
// 系统设置-设置权限
import PowerSet from '@/components/systemSet/powerset'
// 系统设置-员工管理
import UserSet from '@/components/systemSet/userset'
// 系统设置-新增/编辑员工
import AddOrEdit from '@/components/systemSet/addoredit'
// 系统设置-登录日志
import LoginRecord from '@/components/systemSet/loginrecord'
// 个人信息-修改密码
import ChangePass from '@/components/user/changepass'

Vue.use(Router)

export default new Router({
  routes: [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    meta:{
      title: '登录',
      needLogin: false,
      hidden: true
    }
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta:{
      title: '主页',
      needLogin: true,
      hidden: true
    }
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta:{
      title: '订单信息',
      iconCls: 'fa fa-list-alt fa-fw',//图标样式class
    },
    children: [
        { path: '/orderlist', component: OrderList, name: 'OrderList', meta:{ title: '订单一览', needLogin: true}},
        { path: '/orderinfo', component: OrderInfo, name: 'OrderInfo', meta:{ title: '订单详情', hidden: true, needLogin: true}},
        { path: '/editorder', component: EditOrder, name: 'EditOrder', meta:{ title: '订单修改', hidden: true, needLogin: true}},
        { path: '/warningorder', component: WarningOrder, name: 'WarningOrder', meta:{ title: '预警一览', needLogin: true}}
    ]
  },
  {
      path: '/',
      component: Home,
      name: 'Home',
      meta:{
        title: '接车人管理',
        iconCls: 'fa fa-list-alt fa-fw',//图标样式class
      },
      children: [
        { path: '/returncarmanlist', component: ReturnCarManList, name: 'ReturnCarManList', meta:{ title: '接车一览', needLogin: true}},
        { path: '/addreturncarman', component: AddReturnCarMan, name: 'AddReturnCarMan', meta:{ title: '添加/修改接车人', hidden: true, needLogin: true}}
      ]
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta:{
      title: '运营管理',
      iconCls: 'fa fa-television fa-fw',//图标样式class
    },
    children: [
      { path: '/activelist', component: ActiveList, name: 'ActiveList', meta:{ title: '活动一览', needLogin: true}},
      { path: '/foundactive', component: FoundActive, name: 'FoundActive', meta:{ title: '修改/创建关联活动', hidden: true, needLogin: true}},
      { path: '/storelist', component: StoreList, name: 'StoreList', meta:{ title: '门店一览', needLogin: true}},
      { path: '/addstore', component: AddStore, name: 'AddStore', meta:{ title: '添加/修改门店', hidden: true, needLogin: true}},
      { path: '/configuration', component: Configuration, name: 'Configuration', meta:{ title: '运营配置', needLogin: true}}
    ]
  },
  {
      path: '/',
      component: Home,
      name: 'Home',
      meta:{
        title: '门店管理',
        iconCls: 'fa fa-television fa-fw',//图标样式class
      },
      children: [
        { path: '/addstore', component: AddStore, name: 'AddStore_1', meta:{ title: '门店信息一览', needLogin: true}}
      ]
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta:{
      title: '系统设置',
      iconCls: 'fa fa-cog fa-fw',//图标样式class
    },
    children: [
      { path: '/roleset', component: RoleSet, name: 'RoleSet', meta:{ title: '角色管理', needLogin: true}},
      { path: '/powerset', component: PowerSet, name: 'PowerSet', meta:{ title: '设置权限', hidden: true, needLogin: true}},
      { path: '/userset', component: UserSet, name: 'UserSet', meta:{ title: '员工管理', needLogin: true}},
      { path: '/addoredit', component: AddOrEdit, name: 'AddOrEdit', meta:{ title: '修改/新增员工', hidden: true, needLogin: true}},
      { path: '/loginrecord', component: LoginRecord, name: 'LoginRecord', meta:{ title: '登录日志', needLogin: true}}
    ]
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    meta:{
      title: '个人信息',
      iconCls: 'fa fa-user fa-fw',//图标样式class
      hidden: true
    },
    children: [
        { path: '/changepass', component: ChangePass, name: 'ChangePass', meta:{ title: '修改密码', needLogin: true}}
    ]
  },
  {
    path: '*',
    component: NotFound,
    name: 'NotFound',
    meta:{
      title: '404',
      hidden: true
    }
  },
  ]
})
