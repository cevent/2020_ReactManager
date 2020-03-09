import React, {Component} from 'react';
import {Card,Table,Button,Icon,message,Modal} from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';
/**
 * 商品分类路由
 */
export default class Category extends Component {

  state={
    categorys:[], //一级分类列表
    subCategorys:[], //二级分类列表
    loading:false, //请求中
    parentId:'0', //当前需要显示的父级分类列表parent id
    parentName:'', //显示父级列表名
    showStatus:0, //标识添加/更新确认框： 0不显示 1添加 2更新

  }

  //初始化table所有列的数组
  initColumns=()=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', //指定显示数据对应的属性名
      },
      {
        title: '操作',
        width:300,
        //render中可以传递参数
        render:(category)=>( //返回需要显示的界面标签
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
            {/*<LinkButton onClick={this.showSubCategorys(category)}>查看子分类(这样写渲染的时候调用，需要点击才能调用)</LinkButton>*/}
            {/*如何向事件回调函数传递参数：1.定义一个匿名箭头函数 2.在函数中调用处理的函数，并传入数据
              onClick={()=>{this.showSubCategorys(category)}} 可省略外部大括号onClick={()=>this.showSubCategorys(category)}
            */}
            {this.state.parentId==='0'?<LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>:null}

          </span>
        )
      }
    ]
  };

  //异步获取一/二级分类列表显示:parentId,如果没有指定，根据状态中的parentId请求，如果指定，就根据parentId请求
  getCategorys=async (parentId)=>{
    //在发请求前，显示loading
    this.setState({loading:true});
    parentId=parentId || this.state.parentId;
    console.log('parentId-v:',parentId)
    //发异步ajax请求 获取数据
    const result=await reqCategorys(parentId);
    //请求之后，隐藏loading
    this.setState({loading:false});
    //判断是否存在
    if(result.status===0){
      //取出分类数组（一级/二级）
      const categorys= result.data;

      if(parentId==='0'){
        //更新一级分类状态
        console.log('sub第1次：',parentId==='5e513c09ec5b28bbb5a7adc3');
        this.setState({
          //categorys:categorys
          categorys:categorys
        })
      }else{
        //更新二级分类状态
        console.log('sub第3次：',parentId==='5e513c09ec5b28bbb5a7adc3');
        this.setState({
          subCategorys:categorys
        })
        console.log('第4次',this.state.subCategorys,this.state.categorys);
        console.log('对比5',this.state.subCategorys===this.state.categorys);
      }

    }else{
      message.error('获取分类列表失败');
    }
  };

  //显示指定一级分类对象的二级子列表
  showSubCategorys=(category)=>{
    //1.更新状态
    this.setState({
      parentId:category._id,
      parentName:category.name
    },()=>{//callback:回调函数在状态更新且重新render()之后执行
      //在setSate之后，不能立即获取最新状态，因为setState是异步更新状态
      console.log('sub第2次：',this.state.parentId==='5e513c09ec5b28bbb5a7adc3');
      console.log('showSubCategorys():',typeof this.state.parentId===typeof this.state.parentName);
      //2.获取二级分类列表
      this.getCategorys()
    })

  };

  //更新状态：显示一级分类列表
  showCategorys=()=>{
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[]
    })
  };

  //隐藏确认框
  handleCancel=()=>{
    //清除输入数据
    this.form.resetFields();
    //执行隐藏
    this.setState({
      showStatus:0
    })
  }

  //1.显示添加
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }

  //1.1添加分类
  addCategory=()=>{
    console.log('addCategory()1');

    //表单验证
    this.form.validateFields(async (err,values)=>{
      if(!err){
        console.log('addCategory()2');
        //1.2隐藏确认框
        this.setState({
          showStatus:0
        })

        //1.3收集数据
        //const {parentId,categoryName}=this.form.getFieldsValue()

        //解构values
        const {parentId,categoryName}=values;

        //1.4清除数据
        this.form.resetFields();
        //1.5发送请求:根据ajax请求发送的前后参数顺序写入
        const result=await reqAddCategory(categoryName,parentId)
        if(result.status===0){

          //添加的分类=当前分类。如果parentId=当前状态的id
          if(parentId===this.state.parentId){
            //重新获取分类列表
            this.getCategorys();
          }
          //在二级分类下添加一级分类项，重新获取一级分类列表，但不需要显示一级列表
          else if(parentId==='0'){
            this.getCategorys('0');
          }
        }
      }
    });
  };

  //2.显示更新
  showUpdate=(category)=>{

    //保存分类对象
    this.category=category;
    //更新状态
    this.setState({
      showStatus:2
    })
  }

  //2.1更新分类 ,引用validateFields，需要将async也调用使用await的上一个函数左边
  //updateCategory=async ()=>{
  updateCategory= ()=>{
    console.log('updateCategory()');

    //2.0表单验证通过
    this.form.validateFields(async (err,values)=>{
      if(!err){
        //2.1隐藏确认框
        this.setState({
          showStatus:0
        })

        //2.2准备数据
        const categoryId=this.category._id;
        //validateFields(values)中包含categoryName
        //const categoryName=this.form.getFieldValue('categoryName');
        const {categoryName}=values; //函数结构调用categoryName

        //清湖数据:resetFields()重置所有字段/表单项
        this.form.resetFields();

        //2.2发送请求更新分类
        const result=await reqUpdateCategory({categoryId,categoryName});

        if(result.status===0){
          //2.3重新显示列表
          this.getCategorys();
        }
      }
    });

  }

  //willMount为第一次render准备数据
  componentWillMount(){
    this.initColumns();
  }

  //didMount发送获取列表请求,执行异步任务：发异步ajax请求
  componentDidMount(){
    //获取一级分类列表
    this.getCategorys();
  }

  render() {

    //读取状态数据
    const {categorys,subCategorys,parentId,parentName,showStatus,loading}=this.state

    //读取指定的分类
    const category=this.category || {} //没有指定则是空对象

    //card左侧标题
    const title=parentId==='0'?'一级分类列表':(
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight:10}}></Icon>
        <span>{parentName}</span>
      </span>
    );
    //card右侧标题
    const extra=(
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra} >
        {/*bordered={true} =bordered 必须指定rowKey pagination分页设置  showQuickJumper:true快速跳转 loading:设置加载中 loading={true}*/}
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0'?categorys:subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize:5,showQuickJumper:true}}
          />;

        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categorys={categorys} parentId={parentId} setForm={(form)=>{this.form=form}}/>
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          {/*申明UpateForm需要接收的属性 传入form对象*/}
          <UpdateForm categoryName={category.name} setForm={(form)=>{this.form=form}}/>
        </Modal>
      </Card>

    )
  }
};

//可并入class，统一暴露
//export default App;

