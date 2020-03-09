/**
 * 入口js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';
//import 'antd/dist/antd.css';

//读取local中保存的user
const user=storageUtils.readUser();
memoryUtils.user=user;

//将App组件标签渲染到index页面的div上root
ReactDOM.render(<App/>,document.getElementById('root'));

