import React, {Component} from 'react';
import { Upload, Modal,message } from 'antd';
import {reqImageDelete} from '../../api';
import PropTypes from 'prop-types';
import {BASE_IMG_URL} from "../../utils/constants";
/**
 * 图片上传
 */
export default class UploadPictures extends Component {

  static propTypes={
    imgs:PropTypes.array
  }

  state = {
    previewVisible: false, //预览可见：是否
    previewImage: '', //可见图片的地址
    fileList: [],
  };

  //初始化数据
  constructor(props){
    super(props);
    let fileList=[];

    //如果imgs有值
    const {imgs}=this.props;
    if(imgs && imgs.length>0){
      fileList= imgs.map((img,index)=>({
          uid: -index,
          name: img,
          status: 'done',
          url: BASE_IMG_URL+img
      })
      );
    }

    //指定初始状态
    this.state={
      previewVisible: false, //预览可见：是否
      previewImage: '', //可见图片的地址
      fileList //所有已上传图片的数组
    }
  };

  /**
   * 获取所有已上传图片名的数组：传给add/update
   */
  getImgs=()=>{
    return this.state.fileList.map(file => file.name);
  };

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  //隐藏可见预览
  handleCancel = () => this.setState({ previewVisible: false });

  //显示预览图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*上传图片时
    file:当前操作的图片文件（上传/删除）
    file.status:监视文件的上传进度，为3次：uploading ->uploading ->done
  * fileList:已上传图片文件对象的数组
  * */

  handleChange =async ({ file,fileList }) => {
    console.log('handleChange()',file,file.status,fileList.length,'非指向同一个对象：',file===fileList[fileList.length-1]);

    //1.上传成功，将当前上传的file信息修正(name,url)
    if(file.status==='done'){
      const result=file.response; //{status:0,data:{name:'xxx.jpg',url:'img_url'}}

      if(result.status===0){
      message.success('上传图片成功！');
      const {name,url}=result.data;
      //需要将file指向faleList对象最后一个
      file=fileList[fileList.length-1];
      file.name=name;
      file.url=url;
      console.log('非指向同一个对象2：',file===fileList[fileList.length-1]);
      }else{
        message.error('上传图片失败');
      }

    }else if(file.status==='removed'){//删除图片
      const result=await reqImageDelete(file.name);
      if(result.status===0){
        message.success('删除图片成功');
      }else{
        message.error('删除图片失败');
      }
    }

    //在操作（上传/删除）过程中，更新fileList的status
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
        <div >点击上传</div>
    );
    return (
      <div >
        <Upload
          action="/manager/img/upload" //上传图片的接口地址
          accept="image/*" //指定只接收图片格式
          listType="picture-card"  //图片列表显示的样式： text, picture 和 picture-card
          name="image" //请求参数名：发到后台的文件参数名
          fileList={fileList} //已经上传的文件对象列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/*限制上传数量*/}
          {fileList.length >= 6 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  };
};

