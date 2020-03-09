/**
 * 发送异步ajax请求的函数模块
 * 1.封装axios
 * 2.请求返回值：Promise对象
 * 3.优化：统一处理请求异常,在外层return一个Promise对象，在请求出错时，不使用reject，给出错误提示
 */
import axios from 'axios';
import {message} from 'antd';

//如果没有传值，指定空对象data={}
export default function ajax(url,data={},type='GET') {//形参默认值，默认GET请求

  //3.优化：统一处理请求异常，省略login.jsx的try-catch
  return new Promise((resolve,reject)=>{

    //1.执行异步ajax请求
    let promise;
    if(type==='GET'){
      //发送get请求
      promise= axios.get(url,{

        //配置对象，对象不为单一对象，有可能是数组，所以这里只能用data
        params: data
      });
    }else{
      //发送post请求
      //2.如果成功，调用resolve(value)
      promise= axios.post(url,data);
    }

    promise.then(response=>{
      /*直接.data：resolve(response); 传给login.jsx
      * 取消异步的response，而是resolve返回response.data
      * */
      resolve(response.data);
      //3.如果失败，不调用reject(reason),直接提示异常信息
    }).catch(error=>{
      //reject(error)
      //引入antd的message
      message.error('请求出错了'+error.message);
    })

  })

}

//请求登录接口
/*
axios('/login',{username:'Cevent',password:'123456'},'POST')
  .then();

//添加用户
axios('/manager/user/add',{username:'Cevent',password:'123456',phone:'16619954889'},'POST')
  .then();
*/
