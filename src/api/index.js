/**分别暴露 -->接口型函数
 * 1.包含N个接口请求函数的模块
 * 2.每个接口函数的返回值：Promise
 * 3.根据接口文档，定义接口请求
 *
 * jsonp解决ajax跨域的原理
 1). jsonp只能解决GET类型的ajax请求跨域问题
 2). jsonp请求不是ajax请求, 而是一般的get请求
 3). 基本原理
 浏览器端:
 1) 动态生成<script>来请求后台接口(src就是接口的url)
 2) 定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
 服务器端:
 3) 接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
 浏览器端:
 4) 收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */

import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';

const BASE='';

//1.登录接口
/*export function reqLogin(username,password) {
  return ajax('/login',{username,password},'POST');
}*/

/*export const reqLogin=(username,password)=> ajax('/login',{username,password},'POST');*/
export const reqLogin=(username,password)=> ajax(BASE+'/login',{username,password},'POST');

//需要在package.json中添加代理后端服务器地址："proxy":"http://localhost:5000"


//2.添加用户接口
export const reqAddUser=(user)=>ajax('/manager/user/add',user,'POST');

//3.jsonp请求接口函数：天气weather(解决get类型的ajax请求跨域问题,jsonp本来是一般的get请求，不属于ajax请求)
export const reqWeather=(city)=>{

  //返回更改为promise对象
  return new Promise((resolve,reject)=>{

    const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url,{},(err,data)=>{
      console.log('jsonp',err,data);

      //成功:获取API数据
      if(!err && data.status==='success'){
        //函数解构赋值
        const {dayPictureUrl,weather,temperature}=data.results[0].weather_data[0];
        resolve({dayPictureUrl,weather,temperature});
      }else{
        //失败
        message.error('获取天气信息失败');
      }

    });
  });


}
//reqWeather('北京')

//category分类列表
//1.获取一级/二级分类列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manager/category/list',{parentId});
//2.添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax(BASE+'/manager/category/add',{categoryName,parentId},'POST');
//3.更新分类{categoryId,categoryName} 传入一个对象，包含2个属性
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+'/manager/category/update',{categoryId,categoryName},'POST');
//4.获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manager/product/list',{pageNum,pageSize});

//5.搜索商品名称/描述分页列表,[searchType]:搜索类型productName/productDesc
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manager/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName,});

/*export const reqSearchProducts=({pageNum,pageSize,searchName})=>ajax(BASE+'/manager/product/search',{
  pageNum,
  pageSize,
  productName:searchName,});*/

//6.根据分类ID获取分类:传入对象，是包含参数的对象，即使只有一个参数
export const reqCategory=(categoryId)=>ajax(BASE+'/manager/category/info',{categoryId});

//7.更新商品状态(上/下架)
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manager/product/updateStatus',{productId,status},'POST');

//8.删除图片
export const reqImageDelete=(name)=>ajax(BASE+'/manager/img/delete',{name},'POST');

//9.添加商品
//export const reqAddProduct=(product)=>ajax(BASE+'/manager/product/add',{product},'POST');
//10.修改商品
//export const reqUpdateProduct=(product)=>ajax(BASE+'/manager/product/update',{product},'POST');

//11.合并：添加/修改商品
export const reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manager/product/'+(product._id?'update':'add'),product,'POST');

//12.获取所有角色列表
export const reqRoles=()=>ajax(BASE+'/manager/role/list');

//13.添加角色
export const reqAddRoles=(roleName)=>ajax(BASE+'/manager/role/add',{roleName},'POST')

//14.获取更新的角色
export const reqUpdateAuthorizedRoles=(role)=>ajax(BASE+'/manager/role/update',role,'POST');

//15.获取用户列表
export const reqUsers=()=>ajax(BASE+'/manager/user/list');

//16.删除用户
export const reqUserDel=(userId)=>ajax(BASE+'/manager/user/delete',{userId},'POST');

//17.添加/更新用户
export const reqUserAddUpdate=(user)=>ajax(BASE+'/manager/user/'+(user._id?'update':'add'),user,'POST');
