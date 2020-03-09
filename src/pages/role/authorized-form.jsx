import React, {Component} from 'react';
import {Form,Input,Tree} from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';

/**
 * 设置角色的组件
 */
const Item=Form.Item;
const TreeNode=Tree.TreeNode;
export default class AuthorizedForm extends Component {

  //申明接收props对象的roles
  static propTypes={
    role:PropTypes.object
  };

  //动态取出role
  constructor(props){
    super(props);
    //根据传入角色menus，生成初始状态，需要解构role
    const {menus}=this.props.role;
    this.state={
      checkedKeys:menus
    }
  }

  //将menus-checkedKeys传给role父组件
  getAuthorizedMenus=()=> this.state.checkedKeys;

  getMenuTreeNodes=(menuList)=>{
    return menuList.reduce((pre,item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {
            item.children?this.getMenuTreeNodes(item.children):null
          }
        </TreeNode>
      )
      //每次遍历都会返回pre
      return pre;
    },[])
  };

  //选中某个node权限
  onChecked=checkedKeys=>{
    console.log('onChecked',checkedKeys);
    //this.setState建立了新数组
    this.setState({checkedKeys});
  };

  //加载角色treeNode
  componentWillMount(){
    this.treeNodes=this.getMenuTreeNodes(menuList);
  };

  //根据新传入的role来更新checkedKeys状态，willReceiveProps(该属性延续到react17版本 当前"react": "^16.12.0",)初始的状态（第一次接收属性）下不回调，只有更新状态时调用
  /**
   * 当组件接收到新的属性时，自动调用
   * @param nextProps
   */
  componentWillReceiveProps(nextProps){
    console.log('componentWillReceiveProps(): ',nextProps);
    const menus=nextProps.role.menus;
    this.setState({
      checkedKeys:menus
    });
    //可以直接改变当前状态并被渲染调用，会报错： Line 69:5:  Do not mutate state directly. Use setState()
    /*this.state.checkedKeys=menus;*/

  }

  render() {

    console.log('第一次调用render()');

    //重新渲染role，传入的是最新修改的role，但是没有根据新role里面的menus进行显示，是根据onChecked的setState来显示的，但是并没有根据新传入的role更新状态
    const {role}=this.props;
    const {checkedKeys}=this.state;

    //指定Item布局
    const formItemLayout={
      labelCol:{span:6},
      wrapperCol:{span:15}
    }

    return (
      <div>

        <Item label='角色名称：' {...formItemLayout}>
              <Input value={role.name} disabled/>

        </Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onChecked}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>

      </div>
    )
  }
};

