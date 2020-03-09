import React, {Component} from 'react';
import {Card,Form,Input,Icon,Button,Cascader,message} from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api';
import UploadPictures from './upload-pictures';
import RichTextEditor from './rich-text-editor';

const {Item}=Form;
const {TextArea}=Input;

class ProductAddOrUpdate extends Component {


  state={
    options:[]
  };

  //图片数据容器：读取上传图片的数据
  constructor(props){
    super(props);
    //1.创建保存ref标识的标签对象的容器
    this.creaters=React.createRef();
    this.editors=React.createRef();
  };

  submit=()=>{
    //进行表单验证，如果通过，接收域对象，并发送请求
    this.props.form.validateFields(async (error,values)=>{
      if(!error){
        console.log('submit():',values);

        //1.收集数据，并封装为product对象
        const {name,desc,price,categoryIds}=values;
        let pCategoryId,categoryId;
        if(categoryIds.length===1){
          pCategoryId='0';
          categoryId=categoryIds[0];
        }else{
          pCategoryId=categoryIds[0];
          categoryId=categoryIds[1];
        }

        const imgs=this.creaters.current.getImgs();
        const detail=this.editors.current.getDetails();

        console.log('creater-imgs ',imgs,'-details: ',detail,categoryId,pCategoryId);
        //封装product对象
        const product={name,desc,price,imgs,detail,pCategoryId,categoryId};
        console.log('pCategoryId',pCategoryId,'categoryId: ',categoryId);

        //如果是更新，需要添加_id
        if(this.isUpdate){
          product._id=this.product._id;
        }

        //2.调用接口请求函数,添加/更新
        const result=await reqAddOrUpdateProduct(product);

        //3.根据结果提示
        if(result.status===0){
          message.success(`${this.isUpdate?'更新':'添加'}商品成功！`);
          this.props.history.goBack();
        }else{
          message.error(`${this.isUpdate?'更新':'添加'}商品失败！`);
        }

      }
    })
  };

  //验证价格
  validatorPrice=(rule,value,callback)=>{
    console.log(value,typeof value);
    if(value*1>0){
      callback();//验证通过
    }else{
      callback('价格必须大于0');//验证通过
    }

  };

  //接收categorys
  initOptions=async (categorys)=>{
    //1.根据categorys生成options数组
    const options=categorys.map(categorysMap=>({
      value:categorysMap._id,
      label:categorysMap.name,
      //这里只有加载后，才能确认true/false
      isLeaf:false
    }));

    //3.如果是二级分类商品的更新
    const {isUpdate,product}=this;
    const {pCategoryId}=product;
    if(isUpdate && pCategoryId!=='0'){
      //4.获取对应的二级分类
      const subCategorys=await this.getCategorys(pCategoryId);
      //生成二级下拉列表
      const childOptions=subCategorys.map(childOPT=>({
        value:childOPT._id,
        label:childOPT.name,
        isLeaf:true
      }));

      //5.关联到对应的一级option
      const targetOption=options.find(options=>options.value===pCategoryId);
      targetOption.children=childOptions;
    }

    //2.更新options状态
    this.setState({
      options
    });
  };

  //异步获取一二级分类列表,async返回Promise对象，Promise结果和值由async函数的结果来决定
  getCategorys=async (parentId)=>{
    const result=await reqCategorys(parentId);
    if(result.status===0){ //{status:0,data:categorys}
      const categorys=result.data;
      //判断区分一二级分类
      if(parentId==='0'){
        this.initOptions(categorys);
      }else{
        //想要返回子分类，必须将loadData变为async，返回二级列表，当前返回的Promise的value=categorys
        return categorys;
      }

    }
  };

  // 模拟请求，异步加载数据
  loadData =async selectedOptions => {
    //const targetOption = selectedOptions[selectedOptions.length - 1];
    const targetOption = selectedOptions[0]; //获取选择项
    targetOption.loading = true;

    //1.根据选中的分类，请求获取子分类
    const subCategorys=await this.getCategorys(targetOption.value); //获取id
    //关闭loading
    targetOption.loading=false;

    //这里是否有二级分类
    if(subCategorys && subCategorys.length>0){
      //2.生成一个二级列表的options
      const childOptions=subCategorys.map(childCategorys=>({
        value:childCategorys._id,
        label:childCategorys.name,
        //这里只有加载后，才能确认true/false
        isLeaf:true
      }))
      //3.关联到当前option
      targetOption.children=childOptions;
    }else{
      //4.当前选中的分类没有二级分类
      targetOption.isLeaf=true;
    }

      //更新数据...arr(三点运算符，重新解构产生新数组)
      this.setState({
        options: [...this.state.options],
      });

  };

  componentDidMount(){
    this.getCategorys('0');
  };

  //willMount在第一次render前执行一次
  componentWillMount(){
    //是否携带data
    const product=this.props.location.state; //添加：no value 修改：value
    //保存一个是否为更新的标识
    this.isUpdate=!!product; //强制转换boolean类型：!!，判断false/true
    //保存商品，如果没有，保存的是空对象
    this.product=product || {}; //如果没有值，则返回空值
  };

  render() {

    const {isUpdate,product}=this;
    const {pCategoryId,categoryId,imgs,detail}=product;
    const categoryIds=[]; //接收级联分类id的数组
    if(isUpdate){
      if(pCategoryId==='0'){
        categoryIds.push(categoryId);
      }else{
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }


    }

    const title=(
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type='arrow-left' style={{color:'green',marginRight:15,fontSize:20}}></Icon>
        </LinkButton>
        <span className="products-title">{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    );

    //设计表单item布局，引入需结构{...obj}，整体宽度24
    const  formItemLayout={
      labelCol:{span:3}, //左侧
      wrapperCol:{span:9} //右侧包装input
    };

    //高阶函数调用
    const {getFieldDecorator}=this.props.form;

    return (
      <Card title={title} >
        <Form {...formItemLayout}>
          {/*label标签默认设置商品名称提示前缀,默认一个item设置两行，需要修改formItemLayout
           getFieldDecorator设置规则，required必须返回，label*
          */}
          <Item label='商品名称：'  >
            {
              getFieldDecorator('name',{
                initialValue:product.name,
                rules:[
                  {required:true,message:'必须输入商品名称'}
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }

          </Item>
          <Item label='商品描述：' >
            {
              getFieldDecorator('desc',{
                initialValue:product.desc,
                rules:[
                  {required:true,message:'必须输入商品描述'}
                ]
              })(
                <TextArea placeholder='请输入商品描述' autoSize={{minRows:2,maxRows:8}}/>
              )
            }

          </Item>
          <Item label='商品价格：' >
            {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {required:true,message:'必须输入商品价格'},
                  {validator:this.validatorPrice}
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
              )
            }

          </Item>
          <Item label='商品分类：' >
            {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {required:true,message:'必须选择商品分类'}
                ]
              })(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options} //需要显示的列表数组
                  loadData={this.loadData} //加载子列表项
                />
              )
            }

          </Item>
          <Item label='商品图片：' >
            <UploadPictures ref={this.creaters} imgs={imgs}/>
          </Item>
          <Item label='商品详情：' labelCol={{span:3}} wrapperCol={{span:18}} >
            <RichTextEditor ref={this.editors} details={detail}/>
          </Item>
          <Item >
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
};

//表单验证需要包装CLASS
export default Form.create()(ProductAddOrUpdate);
/**
 * 标签对象，就是组件对象
 * 1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
 * 2.父组件调用子组件的方法：在父组件中，通过ref得到子组件标签对象(也就是组件对象)，调用其方法
 */
