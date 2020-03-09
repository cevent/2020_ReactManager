/**应用的根组件
 */
import React,{Component} from 'react';
/*import {Button,message} from 'antd';*/
import {BrowserRouter,Route,Switch} from 'react-router-dom';
//HashRouter的项目和Switch项目不同，路径上必须加#:localhost:3000/#/
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

/**
 *
 */
export default class App extends Component{

  /*  btnHandle=()=>{
      message.success('this is ant-d designer');
    }*/

  render() {
    /*return <Button type="primary" onClick={this.btnHandle}>测试ant-d Primary</Button>*/
    //源于根路径的问题，这里省略默认admin路径，<Route path='/admin' component={Admin}></Route>
    return (
      <BrowserRouter>
        <Switch>{/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}
