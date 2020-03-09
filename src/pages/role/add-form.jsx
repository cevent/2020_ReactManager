import React, {Component} from 'react';
import {Form,Input} from 'antd';
import PropTypes from 'prop-types';

/**
 * 添加角色的组件
 */
const Item=Form.Item;

class AddForm extends Component {

  //申明接收props对象的roles
  static propTypes={
    setForm:PropTypes.func.isRequired, //获取form对象
  }

  componentWillMount(){
    this.props.setForm(this.props.form);
  }

  render() {

    //2.获取form对象
    const {getFieldDecorator}=this.props.form;

    //指定Item布局
    const formItemLayout={
      labelCol:{span:6},
      wrapperCol:{span:15}
    }

    return (
      <Form>

        <Item label='角色名称：' {...formItemLayout}>
          {
            getFieldDecorator('roleName',{
              initialValue: '',
              rules:[
                {
                  required:true,
                  message:'角色名称必须输入'
                }
              ]
            })(
              <Input placeholder='请输入角色名称'/>
            )
          }
        </Item>

      </Form>
    )
  }
};

//高阶函数
export default Form.create()(AddForm);
