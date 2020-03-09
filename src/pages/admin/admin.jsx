import React, {Component} from 'react';
import {Redirect,Route,Switch} from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils';

/**
 * 引入antd布局
 */
import {Layout} from 'antd';
//将left-navigate下的文件设置为index，可直接引入文件夹，默认index文件
import LeftNav from '../../components/left-navigate';
import HeaderNav from '../../components/header-navigate';

/*引入二级路由*/
import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Order from '../order/order';

const {Footer,Sider,Content} =Layout;
/**
 *后台管理的路由组件
 */
export default class Admin extends Component {
  render() {
    const user=memoryUtils.user;
    if(!user || !user._id){
      //如果内存中没有存储user对象，当前未登录，自动跳转到登录在render()中
      return <Redirect to='/login'></Redirect>
    }
    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <HeaderNav>Header</HeaderNav>
          <Content style={{backgroundColor:'#fff',margin:30}}>
            <Switch>
              <Route path='/home' component={Home}></Route>
              <Route path='/category' component={Category}></Route>
              <Route path='/product' component={Product}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Route path='/order' component={Order}></Route>
              {/*避免请求错误，非法请求都重定向到home*/}
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'#cccccc'}}>即刻开启你的数据跟踪之旅 — @cevent提供技术支持</Footer>
        </Layout>
      </Layout>
    )
  }
};

//可并入class，统一暴露
//export default App;
