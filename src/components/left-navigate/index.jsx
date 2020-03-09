import React, {Component} from 'react';
import './index.less';
import logo from '../../assets/imgs/亚盟.png';
import {Link,withRouter} from 'react-router-dom';//高阶组件withRouter，包装leftNav
import {Menu,Icon} from 'antd';

//默认暴露的模块可以写任意名字
import menuList from '../../config/menuConfig';
import memoryUtils from "../../utils/memoryUtils";

const SubMenu=Menu.SubMenu;//引入Menu的子菜单SubMenu
/**
 * 左侧导航栏组件
 */
class LeftNav extends Component {

  /**根据menu的数据数组，生成对应的标签数组
   * item=
   * const menuList = [
        {
         title: '首页', // 菜单标题名称
         key: '/home', // 对应的path
         icon: 'home', // 图标名称
         isPublic: true, // 公开的
         children:[], //menu子项

       },

   返回1：
   <Menu.Item key="/home">
   <Link to='/home'>
   <Icon type="pie-chart" />
   <span>首页</span>
   </Link>
   </Menu.Item>

   返回2：
   <SubMenu
   key="sub1"
   title={
              <span>
                <Icon type="mail" />
                <span>商品</span>
              </span>
            }
   >
   确保每个key都不同，将key值设置为to值
   <Menu.Item key="/category">
   <Link to='/category'>
   <Icon type="mail" />
   <span>品类管理</span>
   </Link>
   </Menu.Item>

   使用map+递归调用：{this.getMenuNodes(item.children)}
   * */
  //判断当前登录user对item是否有权限
  hasRoleAuthorized=(item)=>{
    //查询localStorage中的user_key
    const {key,isPublic}=item;
    const menus=memoryUtils.user.role.menus;
    const username=memoryUtils.user.username;
  //1.如果当前用户是admin，通过
    //2.当前用户有item的权限，key匹配menus
      //3.如果当前item是公开的
  if(username==='admin' || isPublic || menus.indexOf(key)!==-1){//找不到menus=-1
    return true;
  }else if(item.children){
    //4.如果当前用户有某个子item的权限，！！强制转换boolean值
    return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
  }
    return false;

  }
  getMenuNodes=(menuList)=>{

    //获取当前请求的路由路径
    const path=this.props.location.pathname;

    return menuList.reduce((pre,item)=>{

      //如果当前用户，有item对应的权限，则需要显示对应的菜单项
      if(this.hasRoleAuthorized(item)){
        if(!item.children){
          //向pre添加Menu.Item
          pre.push( (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else{

          //判断当前的子项是否等于当前请求路径
          //const childItem=item.children.find(childItem=>childItem.key===path)
          const childItem=item.children.find(childItem=>path.indexOf(childItem.key)===0)//判断是否以/product开头
          //如果存在，说明当前item对应的子列表需要展开
          if(childItem){
            this.openKey=item.key;
          }

          //向pre添加<SubMenu>
          pre.push( (
            <SubMenu
              key={item.key}
              title={
                <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
              }
            >
              {this.getMenuNodes(item.children)}

            </SubMenu>
          ))
        }
      }

        return pre;
    },[]);
  }

  //在第一次render()之前，执行一次。为第一个render渲染做数据准备（同步）
  //提示：UNSAFE_componentWillMount
  componentWillMount(){
    this.menuNodes=this.getMenuNodes(menuList);
  }

  render() {

    //获取当前请求的路由路径
    let path=this.props.location.pathname;
    console.log('leftNav-render()',path);

    //创建详情页后，解决菜单未选中,未找到匹配的字串（/product/....）为-1,找到匹配的字串（/product/detail）下标0/1/2(a/b/c)...
    if(path.indexOf('/product')===0){//当前请求的是商品或其子路由界面
      path='/product'
    }

    //得到需要打开菜单项的openKey
    const openKey=this.openKey;

    return (
      <div className="left-nav">
          <Link to='/' className="left-nav-header">
            <img src={logo} alt="logo"/>
            <h1>数据后台</h1>
          </Link>

        {/*antd-menu*/}
        {/*设置首页默认选中(只确认一次，非动态) defaultSelectedKeys={[path]}
        defaultOpenKeys={['/charts']} 动态打开包含子选项的模块
        */}
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }

          {/*<Menu.Item key="/home">
            <Link to='/home'>
              <Icon type="pie-chart" />
              <span>首页</span>
            </Link>
          </Menu.Item>

          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品</span>
              </span>
            }
          >
            确保每个key都不同，将key值设置为to值
            <Menu.Item key="/category">
              <Link to='/category'>
                <Icon type="mail" />
                <span>品类管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/product">
              <Link to='/product'>
                <Icon type="mail" />
                <span>商品管理</span>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/user">
            <Link to='/user'>
              <Icon type="pie-chart" />
              <span>用户管理</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/role">
            <Link to='/role'>
              <Icon type="pie-chart" />
              <span>角色管理</span>
            </Link>
          </Menu.Item>*/}

          {/*调用config的menuList*/}

        </Menu>

      </div>

    )
  }
};

/**
 * 高阶组件：包装非路由组件，返回一个新组件。新的路由组件向非路由组件传递3个属性：history/location/math
 */
export default withRouter(LeftNav);


