//是否是手机号
export const isMobile=(str)=>{
  let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  if (reg.test(str) || str == '') {
    return true
  } else {
    return false
  }
}
//是否是两位小数的数字
export const isNum=(str)=>{
  var reg = /(^[1-9]{1}\d{0,}$)|(^[1-9]{1}\d{0,}\.{1}\d{1,2}[0]*$)|(^[0]{1}\.{1}\d{0,1}[1-9]{1}[0]*$)/;
  if(!reg.test(str)){
    return false;
  }else{
    return true;
  }
}
//是否是正整数
export const isInteger=(str)=>{
	var reg = /^[0-9]*[1-9][0-9]*$/;
		return reg.test(str);
}
//是否是字符串
export const isValidStr=(str)=>{
	var reg = /^[0-9a-zA-Z]*$/;
		return reg.test(str);
}
// 防抖
export const _debounce = (fn, delays, flag = false) => {
  let delay = delays || 200
  let timer
  return function () {
    let th = this
    let args = arguments
    if (!flag) {
      if (timer) return
      fn.apply(th, args)
    } else {
      if (timer) clearTimeout(time)
    }
    timer = setTimeout(function () {
      timer = null
      if (!flag) {
        clearTimeout(timer)
      } else {
        fn.apply(th, args)
      }
    }, delay)
  }
}
// 节流
export const _throttle = (fn, intervals) => {
  let last
  let timer
  let interval = intervals || 200
  return function () {
    let th = this
    let args = arguments
    let now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}
