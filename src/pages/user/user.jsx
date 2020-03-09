import React, {Component} from 'react';
import {Card,Button,Table,Modal,message} from 'antd';
import {formateDate} from '../../utils/dateUtils';
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import {reqUserDel, reqUsers,reqUserAddUpdate} from '../../api';
import UserAddUpdate from './user-add-update';
/**
 * 用户列表
 */
export default class User extends Component {

  state={
    users:[], //用户列表
    roles:[], //角色列表
    loading:false,
    isShow:false, //是否显示确认框
  };

  initColumns=()=>{
    this.columns=[
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title:'邮箱',
        dataIndex:'email'
      },
      {
        title:'电话',
        dataIndex:'phone'
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        render:(role_id)=>this.rolesName[role_id]
      },
      {
        title:'操作',
        render:(user)=>(
          <span>
            <LinkButton onClick={()=>this.showUserUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={()=>this.userDel(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  };

  //根据role的数组，生成包含所有角色名的对象，属性名用角色id值
  initRolesName=(roles)=>{
    const rolesName=roles.reduce((pre,role)=>{
      pre[role._id]=role.name;
      return pre;
    },{});

    //保存
    this.rolesName=rolesName;
  };

  //获取用户
  getUsers=async ()=>{
    const result=await reqUsers();
    if(result.status===0){
      const {users,roles}=result.data;
      //获取roleName
      this.initRolesName(roles);
      this.setState({
        users,roles
      });
    }
  };

  //删除用户
  userDel=(user)=>{
    Modal.confirm({
      title:`确认删除 ${user.username} 吗？`,
      onOk:async ()=>{
        const result=await reqUserDel(user._id)
        if(result.status===0){
          message.success('删除用户成功！');
          //列表更新
          this.getUsers();
        }

      }
    }
    )
  }

  //添加用户
  addUpdateUsers=async ()=>{
    //隐藏确认框
    this.setState({isShow:false});
    //1.收集数据
    const user=this.form.getFieldsValue();
    this.form.resetFields();

    //如果是更新，需要给user指定_id属性
    if(this.user){
      user._id=this.user._id
    }

    //2.提交添加请求
    const result=await reqUserAddUpdate(user);
    //3.更新列表
    if(result.status===0){
      message.success(`${this.user?'修改':'添加'}用户成功！`);
      this.getUsers();
    }
  };

  showUserAdd=()=>{
    //清空user
    this.user=null;
    this.setState({isShow:true});
  }

  //更新用户
  showUserUpdate=(user)=>{
    //1.保存user
    this.user=user;
    //2.
    this.setState({
      isShow:true
    })
    //3.

  };

  componentWillMount(){
    this.initColumns();
  };

  componentDidMount(){
    this.getUsers();
  };


  render() {

    const {users,isShow,loading,roles}=this.state;
    //const user=this.user; 这里引入是否存在的user对象
    const user=this.user || {};
    const title=<Button type="primary" onClick={this.showUserAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
        />

        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addUpdateUsers}
          onCancel={()=>{
            this.form.resetFields()
            this.setState({isShow:false})
          }}
        >
          <UserAddUpdate
            setForm={form=>this.form=form}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    )
  }
};
