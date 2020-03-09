import React, {PureComponent} from 'react';
import {Form,Input,Select} from 'antd';
import PropTypes from 'prop-types';

/**
 * 添加角色的组件
 */
const Item=Form.Item;
const Option=Select.Option;
class UserAddUpdate extends PureComponent {

  //申明接收props对象的roles
  static propTypes={
    setForm:PropTypes.func.isRequired, //获取form对象
    roles:PropTypes.array.isRequired, //获取角色
    user:PropTypes.object
  }

  componentWillMount(){
    this.props.setForm(this.props.form);
  }

  render() {

    const {roles,user}=this.props;
    //判断:const user=this.props.user || {};

    //2.获取form对象
    const {getFieldDecorator}=this.props.form;

    //指定Item布局
    const formItemLayout={
      labelCol:{span:6},
      wrapperCol:{span:15}
    }

    return (
      <Form {...formItemLayout}>

        <Item label='用户名：' >
          {
            getFieldDecorator('username',{
              initialValue: user.username,
              rules:[
                {
                  required:true,
                  message:'用户名称必须输入'
                }
              ]
            })(
              <Input placeholder='请输入用户名称'/>
            )
          }
        </Item>
        {
          user._id?null:(
            <Item label='密码：' >
              {
                getFieldDecorator('password',{
                  initialValue: user.password,
                  rules:[
                    {
                      required:true,
                      message:'密码必须输入'
                    }
                  ]
                })(
                  <Input type='password' placeholder='请输入密码'/>
                )
              }
            </Item>
          )
        }
        <Item label='手机号：' >
          {
            getFieldDecorator('phone',{
              initialValue: user.phone,
              rules:[
                {
                  required:true,
                  message:'手机号码必须输入'
                }
              ]
            })(
              <Input  placeholder='请输入手机号码'/>
            )
          }
        </Item>
        <Item label='邮箱：' >
          {
            getFieldDecorator('email',{
              initialValue: user.email,
            })(
              <Input  placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色：' >
          {
            getFieldDecorator('role_id',{
              /*initialValue: '', 为了出现选择提示，这里不可以设置默认值*/
              initialValue: user.role_id,
              rules:[
                {
                  required:true,
                  message:'角色必须选择'
                }
                ]
            })(
              <Select placeholder="请选择">
                {
                  roles.map(
                    role=>
                      <Option key={role._id} value={role._id}>{role.name}</Option>
                  )
                }
              </Select>
            )
          }
        </Item>

      </Form>
    )
  }
};

//高阶函数
export default Form.create()(UserAddUpdate);
