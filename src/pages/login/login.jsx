import React, {Component} from 'react';
import './login.less';
 import logo from '../../assets/imgs/亚盟.png';
 import {Form,Icon,Input,Button,message} from 'antd';
 import memoryUtils from '../../utils/memoryUtils';
 import storageUtils from '../../utils/storageUtils';
 import {Redirect} from 'react-router-dom';
 import {reqLogin} from '../../api';

 //此处的定义不能卸载import之前
 const Item=Form.Item;
 /**
 * 登录路由组件
 */
class Login extends Component {
  //提交事件
  handleSubmit=(event)=>{
    //阻止默认提交
    event.preventDefault();

    //获取form对象
    const form=this.props.form;
    //获取表单项值，返回对象
    const values=form.getFieldsValue();
    console.log('handleSubmit: ',values);

    //对所有表单字段进行校验-初期表单
    /*form.validateFields((err,values)=>{
      if(!err){
        //console.log('提交AJAX请求：Received values of form: ',values);

        //请求登录
        //函数解构
        const {username,password}=values;
        reqLogin(username,password)
          .then(response=>{
            console.log('Admin成功了',response.data);
          })
          .catch(error=>{
            console.log('Admin失败了',error);
          });

      }else{
        console.log('校验失败!');
      }
    })*/

    /** async 和 await ：简化promise对象的使用，不用通过.then.catch来指定成功或者失败的回调函数。以同步编码方式 实现异步流程（有回调函数就是异步编码）
     * 1. async：所在函数（最近的）定义的左侧写入
     * 2. await：在返回promise的表达式左侧，写入await。不要promise，抓取promise异步执行成功的value数据
     */

    //优化表单(简化promise使用)：async await
    form.validateFields(async (err,values)=>{
      if(!err){
        //console.log('提交AJAX请求：Received values of form: ',values);

        //请求登录
        //函数解构
        const {username,password}=values;

        //1.使用try-catch，优化ajax.jsx后，统一暴露异常，无需try-catch
        /*try{*/

          //2.接收异步请求：response ,使用await等待返回数据，await所在函数最最短需要添加async
          /*修改1，取消response：const response=await reqLogin(username,password);*/
        const result=await reqLogin(username,password);
          //console.log('请求成功',response.data);

          //3.返回结果对象
          //修改2，不使用response.data：const result=response.data;//{status:0=存在,data:user} {status:1=不存在,msg:'error'}
          //修改3，取消ajax.js中的response
          if(result.status===0){
            //登录成功
            message.success('登录成功！');
            //跳转之前 传给user（保存到utils）
            const user=result.data;
            memoryUtils.user=user;//存在内存中
            storageUtils.saveUser(user);//保存在local本地中

            //push跳转后台管理,现在没有完成的路径跳转，需要使用replace(无需回退)
            /*this.props.history.push();*/
            this.props.history.replace('/');
          } else{
            //失败
            message.error(result.msg);
          }

        /*}catch(error){
         alert('请求错误：'+error.message);
        }*/

      }else{
        console.log('校验失败!');
      }
    })

  }

  //密码验证
  validatorPWD=(rule,value,callback)=>{
    console.log('validatorPWD验证：',rule,value);
    /**
     * callback():验证通过
     * callback('')：验证失败，指定提示文本
     * */

    if(!value){
      callback('请输入密码...');
    }else if(value.length<5){
      callback('密码长度不能小于4位');
    }else if(value.length>14){
      callback('密码长度不能大于13位');
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字或下划线组成');
    }else{
      callback();
    }

  }

  render() {

    //如果用户已经登录，跳转后台管理界面
    const user=memoryUtils.user;
    if(user && user._id){
      return <Redirect to='/'/>
    }

    //获取WrapLogin-form对象
    const form =this.props.form;
    const {getFieldDecorator}=form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>亚盟REACT全栈 — 数据查询系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            {/*
                1)必 须 输 入
                2)必 须 大 于 等 于 4 位
                3)必 须 小 于 等 于 13 位
                4)必 须 是 英 文 、 数 字 或 下 划 线 组
                /^/ 以...开头  /$/以...结尾 /[a-zA-Z0-9_]+/以[a-z A-Z 0-9 _下划线] [内容] 位置[]+ 任意位置
            */}
            <Item>
              {
                getFieldDecorator('username',{
                  //配置对象：属性名是特定的名称 whiteSpace:true,忽略空格
                  //声明式验证：使用已定义好的验证规则
                  rules:[
                    {
                    required:true,
                      whiteSpace:true,
                    message:'用户名不能为空'
                    },
                    {
                      min:4,
                      message:'用户名至少四位'
                    },
                    {
                      max:13,
                      message:'用户名不能超过13位'
                    },
                    {
                      pattern:/^[a-zA-Z0-9_]+$/,
                      message:'用户名/密码必须是英文、数字或下划线组成'
                    }
                  ],
                })(
                  <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  />
                )
              }

            </Item>
            <Form.Item>
              {/*自定义验证validator*/}
              {
                getFieldDecorator('password',{
                  rules:[
                   {
                     validator:this.validatorPWD
                   }
                ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>

            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>

            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
};

/**
 * 前端表单验证
 * 1.收集表单数据
 * 2.区别
 * （1）高阶函数
 *  |-一般特别的函数
 *    A. 接受函数类型的参数
 *    B. 返回值是函数
 *
 *  |-常见
 *    A. 定时器：setTimeOut() / setInterval()
 *    B. Promise: Promise( ()=> {} )
 *                then(value =>{}
 *                ,reason =>{}
 *                )
 *    C. 数组遍历相关的方法：forEach() / filter() / map() / reduce() / find() / findIndex()
 *    D. 函数对象的bind()
 *    E. Form.create()() / getFieldDecorator()()
 *
 *  /- 高阶函数更新动态，更加具有扩展性
 *
 *               {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
 * （2）高阶组件:标签的实例
 *  |- 本质：就是一个函数
 *  |- 流程：接收一个组件（被包装组件），返回一个新组件（包装组件），包装组件回向被包装组件传入特定属性
 *  |- 作用：扩展组件的功能，接收组件函数，返回新的组件函数
 *
 */
//调用Login组件，返回WrapLogin新组件（包装form组件），传递一个对象属性form
const WrapLogin=Form.create()(Login);
export default WrapLogin;

