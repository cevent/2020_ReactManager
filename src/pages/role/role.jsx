import React, {Component} from 'react';
import {Card,Button,Table,Modal,message} from 'antd';
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRoles,reqUpdateAuthorizedRoles} from '../../api';
import AddForm from './add-form';
import AuthorizedForm from './authorized-form';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from '../../utils/storageUtils';
import {formateDate} from '../../utils/dateUtils';

/**
 * 角色管理
 */
export default class Role extends Component {

  state={
    roles:[], //角色列表
    role:{}, //选中的role
    isShowAddRoles:false, //显示添加界面
    isShowTreeAuthorized:false, //显示设置权限界面
  }

  constructor(props){
    super(props);
    //将创建的容器对象，交给Modal组件
    this.authorized=React.createRef();
  }

  initColumns=()=>{
    this.columns=[
      {
        title:'角色名称',
        dataIndex:'name'
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time)=>formateDate(create_time) //回调函数：可以直接省略函数参数，直接默认指定create_time
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name'
      }
    ]
  };

  getRoleList=async ()=>{
    const result=await reqRoles();
    if(result.status===0){
      const roles=result.data;
      this.setState({
        roles
      })
    }
  };

  onRows=(role)=>{
    return {
      onClick:event=>{
        //点击行
        console.log('onRows()--> ',role);
        this.setState({
          role
        });
      },
    }
  };

  //添加角色
  addRoles=()=>{

    //0.进行表单验证
    this.form.validateFields(async (error,values)=>{
      if(!error){

        //隐藏确认框
        this.setState({
          isShowAddRoles:false
        });

        //1.收集输入数据
        const {roleName}=values;
        //清除/重置输入的数据,取消后显示元数据，ok不显示，如果点击cancel也不要下次继续显示元数据，需要在modal中加入
        this.form.resetFields();

        //2.请求添加
        const result=await reqAddRoles(roleName);
        if(result.status===0){
          //3.根据结果更新列表显示
          message.success('添加角色成功');
          //this.getRoleList();

          //4.新产生的角色
          const role=result.data;
          //更新roles状态
          //const roles=this.state.roles;
          //尽量不要直接更新状态数据，需要先产生新的状态数据，不建议用push直接添加
          /* //const roles=[...this.state.roles];
          roles.push(role);
          this.setState({
            roles
          });*/

          //函数语法的简洁对象语法：基于函数的状态更新
          this.setState(state=>({
            roles:[...state.roles,role]
          }))
        }else{
          message.error('添加角色失败');
        }

      }
    })

  };

  //更新角色
  updateAuthorized=async ()=>{

    //隐藏确认框
    this.setState({
      isShowTreeAuthorized:false
    });

    const role=this.state.role;
    //得到子组件新的state中的menus
    const menus=this.authorized.current.getAuthorizedMenus();
    role.menus=menus;
    role.auth_time=Date.now();
    role.auth_name=memoryUtils.user.username;

    //请求更新
    const result=await reqUpdateAuthorizedRoles(role);

    if(result.status===0){

      //this.getRoleList();

      //如果当前用户为自己角色的权限，强制退出
      if(role._id===memoryUtils.user.role_id){
        //清理数据
        memoryUtils.user={};
        storageUtils.removeUser();
        //跳转
        this.props.history.replace('./login');
        message.success('当前用户角色已修改，请重新登录！');
      }else{
        message.success('设置角色权限成功！');
        this.setState({
          roles:[...this.state.roles]
        })
      }

    }else{
      message.error('设置角色失败！');
    }
  };

  //初始化数据
  componentWillMount(){
    this.initColumns();
  };

  //发送请求
  componentDidMount(){
    this.getRoleList();
  };

  render() {

    const {roles,role,isShowAddRoles,isShowTreeAuthorized}=this.state

    const title=(
      <span>
        <Button type='primary' style={{marginRight:20}} onClick={()=>this.setState({isShowAddRoles:true})}>创建角色</Button>
        {/*role_id=obj=true   role_id=null=false*/}
        <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowTreeAuthorized:true})}>设置角色权限</Button>
      </span>
    );

    return (
      <Card title={title}>
        {/*bordered={true} =bordered 必须指定rowKey pagination分页设置  showQuickJumper:true快速跳转-分页跳 loading:设置加载中 loading={true}*/}
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
          rowSelection={
            {type:'radio',
              selectedRowKeys:[role._id],
              onSelect:(role)=>{ //选择某个radio
                this.setState({
                  role
                })
              }
            }
          }
          onRow={this.onRows}
        />

        <Modal
          title='添加角色'
          visible={isShowAddRoles}
          onOk={this.addRoles}
          onCancel={()=>{
            this.setState({
              isShowAddRoles:false
            })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form)=>{this.form=form}}
          />
        </Modal>

          <Modal
            title='设置角色权限'
            visible={isShowTreeAuthorized}
            onOk={this.updateAuthorized}
            onCancel={()=>{
              this.setState({
                isShowTreeAuthorized:false
              })

            }}
          >
            <AuthorizedForm
              role={role}
              ref={this.authorized}
            />

        </Modal>

      </Card>
    )
  }
};

