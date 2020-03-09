import React, {Component} from 'react';
import {Card,Select,Input,Button,Icon,Table,message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

const Option=Select.Option;
export default class ProductHome extends Component {

  state={
    total:0,//商品总数量
    products:[],//商品的数组
    loading:false, //加载
    searchName:'', //输入搜索的关键字
    searchType:'productName', //根据字段搜索
  }

  //初始化表格列数组
  initColumns=()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price)=>'￥'+price //指定人民币:指定对应的属性，传入对应的属性值
      },
      {
        width:100,
        title: '状态',
        // dataIndex: 'status', //这里不需要指定status，将render参数变为product
        render:(product)=> {
          const {status,_id}=product;
          const newStatus=status===1?2:1;
          return (
            <span>
              {/*his.updateProductStatus在点击时调用，需要外部包函数*/}
              <Button
                type='primary'
                onClick={()=>this.updateProductStatus(_id,newStatus)}
              >
                {status===1?'在售':'上架'}
                </Button>
              <span>{status===1?'在售':'已下架'}</span>
            </span>
          )
        }
      },
      {
        width:200,
        title: '操作',
        render:(product)=>{
          return(
            <span>
              {/*将product对象使用state传递给目标路由组件{obj}*/}
              <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>查看详情</LinkButton>
              <LinkButton onClick={()=>this.props.history.push('/product/add-update',product)}>修改</LinkButton>
            </span>
            )
        }
      },

    ];
  };

  //获取指定页面的商品列表
  getProducts=async (pageNum)=>{
    //保存pageNum，使得在更新商品状态时，传入当前页码
    this.pageNum=pageNum;

    this.setState({loading:true});
    //判断是否为搜索分页
    const {searchName,searchType}=this.state;
    //如果seatchName不为空，则进行搜索分页
    let result;
    if(searchName){
      result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType});

    }else {
      //一般分页
      result=await reqProducts(pageNum,PAGE_SIZE);
    }

    this.setState({loading:false});
    if(result.status===0){
      //取出分页数据，更新状态，显示分页列表
      const {total,list}=result.data;
      this.setState({
        total,
        products:list
      });
    }
  };

  //更新商品的状态
  updateProductStatus=async (productId,status)=>{
    const result=await reqUpdateStatus(productId,status);
    if(result.status===0){
      if(status===1){
        message.success('更新商品状态成功！可以销售了');
      }else{
        message.success('更新商品状态成功！已禁止销售');
      }
      //更新获取商品请求时，需要传入当前页，更改getProducts请求，保存pageNum
      this.getProducts(this.pageNum);
    }
  };

  //列数据
  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getProducts(1)
  }

  render() {

    //状态数据
    const {products,total,loading,searchType,searchName}=this.state;

    const title=(
      <span>
        {/*onChange实现队select事件选择option-value监听*/}
        <Select value={searchType} style={{width:150}}
                onChange={value=>{this.setState({searchType:value})}}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>

        <Input value={searchName} placeholder='关键字' style={{width:200,margin:'0 15px'}}
               onChange={event=>this.setState({searchName:event.target.value})}
        />
        {/*利用同一个方法，并且传入index分页值=1*/}
        <Button type='primary' onClick={()=>{this.getProducts(1)}}>搜索</Button>

      </span>
    )
    const extra=(
      <Button type='primary' onClick={()=>this.props.history.push('/product/add-update')}>
        <Icon type='plus'/>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered //边框
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={
            {total,
              defaultPageSize:PAGE_SIZE,
              showQuickJumper:true,
              //onChange默认传递pageNum参数，只需要直接调用获取商品的方法
              //onChange:(pageNum)=>{this.getProducts(pageNum)}
              onChange:this.getProducts,
              current:this.pageNum //指定搜索后的当前页码
            }
          }
        />
      </Card>
    )
  }
};
