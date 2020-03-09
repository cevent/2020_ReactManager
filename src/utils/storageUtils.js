/**
 * 进行local数据管理的工具模块
 */
import store from 'store';

const USER_KEY='user_key';
export default{
  /**
   * 1.保存user
   */
  saveUser(user){
    //string转化 接收json
    //localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY,user)
  },

  /**
   * 2.读取user
   */
  readUser(){
    //如果有值，转换为json，如果无值，直接为json可是字符串
    //return JSON.parse(localStorage.getItem(USER_KEY) || '{}' )
    return store.get(USER_KEY) || {}
  },

  /**
   * 3.删除user
   */
  removeUser(){
    //localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  }

}
