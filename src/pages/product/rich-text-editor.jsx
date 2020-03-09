import React, {Component} from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

/**
 * 商品详情：富文本编辑器
 */
export default class RichTextEditor extends Component {

  //接收父组件属性
  static propTypes={
    details:PropTypes.string
  }

  state = {
    //创建一个空的数据状态对象
    editorState: EditorState.createEmpty(),
  }

  constructor(props) {
    super(props);
    const html = this.props.details;

    if(html){
      //1.如果有值，根据html字符串创建文本块
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
          editorState,
      };
    }else{
      this.state={
        //创建一个空的数据状态对象
        editorState: EditorState.createEmpty(),
      }
    }

  }

  /**
   * 输入过程中，实时回调，传入最新的editorState对象，并且存储最新的状态值
   * @param editorState
   */
  onEditorStateChange= (editorState) => {
    console.log('onEditorStateChange()',editorState);
    this.setState({
      editorState,
    });
  };

  //返回输入标签html格式的文本
  getDetails=()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  //图片上传
  uploadImageCallBack=(file)=> {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manager/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          //得到图片地址
          const url=response.data.url;
          console.log('response url: ',url);
          resolve({data:{link:url}});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          console.log('上传失败');
          reject(error);
        });
      }
    )
  }

  render() {
    const { editorState } = this.state;
    return (
      /*图片上传:toolbar*/
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid black',minHeight:200,paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: { present: true, mandatory: true },
              inputAccept: 'image/png,image/jpg,image/jpeg,image/svg,img/gif',
              },
          }}
        />
    );
  }
}
