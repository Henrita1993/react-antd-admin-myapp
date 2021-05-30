import { Upload, Modal,message } from 'antd';
import React from 'react'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


export default  class PicturesWall extends React.Component {
// 初始化
  constructor(props){
    super(props)
    let fileList=[]
    let {imgs}=this.props
    // console.log("object",imgs)
    if(imgs && imgs.length>0){
      fileList=imgs.map((img,index)=>(
        {
          uid: -index,
          name: img,
          status: 'done',
          url:BASE_IMG_URL+img ,
        }
      )
       
      )
    }

    this.state={
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }

  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
      // {
      //   uid: '-1',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
     
     
    ],
  };


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange=({file,fileList})=> {
    // console.log("handleChange",file.status, fileList);

    this.setState({fileList:fileList})
     if (file.status === 'done') {
      const length=fileList.length
      if(file.response.status===0){
        const name= file.response.data.name
        fileList[length-1].name=name

      }
      
      message.success("文件上传成功")

      console.log("done",fileList);
     }else if(file.status === 'removed'){
    //  console.log("handleChange",file, fileList);

      message.success("文件已删除")

     }else if(file.status === 'error'){
       message.error("出错了！")
     }
  }
//得到图片ID
 getImgs=()=>{
   return this.state.fileList.map(file=>file.name)
 }
  render() {
    console.log("imgs",this.props.imgs)
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <i className="iconfont icon-PlusOutlined"/>
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          name='image'
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
