/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
  date.getFullYear()：获取4位的年
  date.getMonth() + 1：获取月（默认month初始化为0），需要加1
*/
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}
