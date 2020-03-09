import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form,Input} from 'antd';

/**
 * 更新分类的form组件
 */

const Item=Form.Item;
class UpdateForm extends Component {

  static propTypes={
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }

  //同步调用
  componentWillMount(){
    //将form对象通过setForm方法传递给category父组件
    this.props.setForm(this.props.form)
  }

  render() {

    //读取当前指定分类的名字
      const {categoryName}=this.props;

    //获取form对象
    const {getFieldDecorator}=this.props.form;

    return (
      <Form>
        <Item>

          {
            getFieldDecorator('categoryName',{
              initialValue:categoryName,
              rules:[
                {
                  required:true,
                  message:'分类名称必须输入'
                }
              ]
              })(
              <Input placeholder='请输入修改的内容'/>
            )
          }

        </Item>

      </Form>
    )
  }
};
//转换为高阶组件
export default Form.create()(UpdateForm);
