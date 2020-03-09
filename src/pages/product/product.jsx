import React, {Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import ProductHome from './home';
import ProductAddOrUpdate from './add-update';
import ProductDetail from './detail';
//父组件定义样式，可在子组件实现
import './product.less';

export default class Product extends Component {
  render() {

    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact />{/*路径完全比配exact*/}
        <Route path='/product/add-update' component={ProductAddOrUpdate}></Route>
        <Route path='/product/detail' component={ProductDetail}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
};
