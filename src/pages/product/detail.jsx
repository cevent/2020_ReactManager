import React, {Component} from 'react';
import {Card,Icon,List} from 'antd';
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from '../../utils/constants';
import {reqCategory} from '../../api';

const Item=List.Item;
/**
 * Product的详情子路由
 */
export default class ProductDetail extends Component {

  //存储分类名称状态
  state={
    categoryName1:'', //一级分类名称
    categoryName2:'', //二级分类名称
  }

  //获取分类，需要添加ajax查询
  async componentDidMount(){
    //得到当前商品的分类id
    const {pCategoryId,categoryId}=this.props.location.state.product;
    if(pCategoryId==='0'){//一级：一个分类名称
      const result=await reqCategory(categoryId);
      const categoryName1=result.data.name;
      this.setState({categoryName1});
    }else{//二级：包含一、二级分类名称
      /*const result1=await reqCategory(pCategoryId);
      const result2=await reqCategory(categoryId);
      const categoryName1=result1.data.name;
      const categoryName2=result2.data.name;*/

      const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)]);
      const categoryName1=results[0].data.name;
      const categoryName2=results[1].data.name;

      this.setState({categoryName1,categoryName2});
    }
  }

  render() {

    //读取state数据:如果传递的为对象{obj}，那么这里的const也需要解构{obj}
    //const product=this.props.location.state;
    const {name,price,desc,detail,imgs}=this.props.location.state.product;
    const {categoryName1,categoryName2}=this.state;
    const title=(
      <span>
        <LinkButton>
              <Icon
                type='arrow-left'
                style={{color:'green',marginRight:15,fontSize:20}}
                onClick={()=>{this.props.history.goBack()}}/>
        </LinkButton>
        <span className="products-title">商品详情</span>
      </span>
    )
    return (
      <Card title={title} className="products-detail" >
        <List>
          <Item>
            <span className="left">商品名称：</span>
            {name}
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            {desc}
          </Item>
          <Item>
            <span className="left">价格：{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            {categoryName1} {categoryName2?' ---> '+categoryName2:''}
          </Item>

          <Item>
            <span className="left">商品图片：
              {/*添加图片标准地址，需要设置常量constants,需要配置serer的file-upload，并且创建upload文件夹，放入img*/}
                {
                  imgs.map(img=>(
                    <img  alt="商品图片" className="product-img"
                          key={img} src={BASE_IMG_URL+img}
                    />
                  ))
                }

            </span>
            <span style={{float:'left'}}>

            </span>
          </Item>

          <Item>
            {/*<span className="left">商品详情<span dangerouslySetInnerHTML={{__html:'<h1 style="color:red">商品详情的内容标题</h1>'}}></span>*/}
            {/*引用标签格式字符串：dangerouslySetInnerHTML={{__html:detail}}*/}
            <span className="left">商品详情<span dangerouslySetInnerHTML={{__html:detail}}></span>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
};
