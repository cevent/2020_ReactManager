import React, {Component} from 'react';
import {Form,Select,Input} from 'antd';
import PropTypes from 'prop-types';
/**
 * 添加分类的form组件
 */

const Item=Form.Item;
const Option=Select.Option;
class AddForm extends Component {

  //申明接收props对象categorys
  static propTypes={
    setForm:PropTypes.func.isRequired, //获取form对象
    categorys:PropTypes.array.isRequired, //接收一级分类数组
    parentId:PropTypes.string.isRequired  //接收父分类ID

  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {

    //从category中取出数据
    const {categorys,parentId}=this.props;

    //获取form对象
    const {getFieldDecorator}=this.props.form;

    return (
      <Form>
        <Item>

          {
            getFieldDecorator('parentId',{
              initialValue:parentId,
              })(
              <Select >
                <Option value='0'>一级分类</Option>
                {
                  categorys.map(
                    categoryARR=> <Option value={categoryARR._id}>{categoryARR.name}</Option>
                  )
                }
              </Select>
            )
          }

        </Item>

        <Item>
          {
            getFieldDecorator('categoryName',{
              initialValue: '',
                rules:[
                  {
                    required:true,
                    message:'分类名称必须输入'
                  }
                ]
            }
            )(
              <Input placeholder='请输入分类名称'/>
            )
          }

        </Item>

      </Form>
    )
  }
};
//转换为高阶组件
export default Form.create()(AddForm);
