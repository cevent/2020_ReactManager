import React, {Component} from 'react';
import './index.less';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {formateDate} from '../../utils/dateUtils';
import {reqWeather} from '../../api';

import {withRouter} from 'react-router-dom';
import menuList from '../../config/menuConfig';

import {Modal} from 'antd';//登出提示
import LinkButton from '../link-button';
//const BASE='http://localhost:5000';

class HeaderNav extends Component {

  state={
    //特定格式的字符串
    currentTime:formateDate(Date.now()), //当前时间的字符串格式
    dayPictureUrl:'', //天气图片
    weather:'', //天气文本
    temperature:'', //温度
  }

  getCurrentTime=()=>{
    //每隔1秒，更新状态数据
    //需要存储，方便结束时间周期
    this.intervalID=setInterval(()=>{
      const currentTime=formateDate(Date.now());
      this.setState({currentTime});
    },1000)
  }

  getWeather=async ()=>{
    //返回为promise对象，需要添加asyn和await
    //解构
    const {dayPictureUrl,weather,temperature}=await reqWeather('衡水');
    this.setState({dayPictureUrl,weather,temperature});
  }

  //获取标题
  getTitle=()=>{
    //得到当前请求路径，引入withRouter，需要取消默认暴露
    const path=this.props.location.pathname;
    let title;
    menuList.forEach(item=>{
      if(item.key===path){//当前item.key=path，那么item.title=title
        title=item.title;
      }else if(item.children){
        //在所有的子item中查找匹配
        //const childrenItem=item.children.find(childrenItem=>childrenItem.key===path);
        //优化三级联动title
        const childrenItem=item.children.find(childrenItem=>path.indexOf(childrenItem.key)===0);

        if(childrenItem){
          title=childrenItem.title;
        }
      }
    });
    return title;
  }

  //退出登录
  logout=()=>{
    //显示确认框
    Modal.confirm({
      title:'确定退出吗？',
      onOk:()=>{
        console.log('OK',this);
        //清楚user数据
        storageUtils.removeUser();
        memoryUtils.user={};

        //跳转
        this.props.history.replace('/login');
      }
    })
    //
  }

  //设置循环定时器，动态时间 componentDidMount在第一次render之后执行，一般在这里执行异步操作
  componentDidMount(){
    this.getCurrentTime();
    //获取当前天气显示
    this.getWeather();
  }

  //取消时间周期循环:在当前组件卸载之前调用
  componentWillUnmount(){
    //清除定时器
    clearInterval(this.intervalID);
  }

  render() {

    //读取jsop
    const {currentTime,dayPictureUrl,weather,temperature}=this.state;
    const username=memoryUtils.user.username;
    //读取title
    const title=this.getTitle();
    return (
        <div className="header-nav">
          <div className="header-nav-top">
            <span>欢迎，{username}</span>
            <LinkButton onClick={this.logout}>退出</LinkButton>
          </div>
          <div className="header-nav-bottom">
            <div className="header-nav-bottom-left">{title}</div>
            <div className="header-nav-bottom-right">
              {/*<span>2020-02-18 00.02.33</span>
              <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
              <span>晴</span>*/}
              <span>{currentTime}</span>
              <img src={dayPictureUrl} alt="weather"/>
              <span className="city">衡水</span>
              <span>{weather}</span>
              <span>{temperature}</span>
            </div>
          </div>
        </div>
    )
  }
};

//高阶函数，包装headerHav
export default withRouter(HeaderNav);
