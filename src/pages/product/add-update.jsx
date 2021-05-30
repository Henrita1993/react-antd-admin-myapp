import React,{Component} from 'react';
import { Card ,Form, Input, Button, Cascader,Upload,message} from 'antd';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index.js'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

import { options } from 'less';

const { TextArea } = Input;
export default class addUpdate extends Component{
  //照片墙和富文本编辑器容器
  pw=React.createRef()
  editor=React.createRef()
  form=React.createRef()

  state={
    options:[],//商品分类中的数组
    categoryIds:[],//options里的IDS
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
    
    ],
  }
  //根据ID初始化Options
  getOptions=async(parentId)=>{
    const result = await reqCategorys(parentId)
    if(result.status===0){   
        if(parentId === "0") { //一级分类
          return result.data.reduce((pre,item)=>{
            pre.push(
             {value: item._id,
             label: item.name,
             isLeaf: false,
           }
            ) 
            return pre     
          },[])   
        }else{
          return result.data.reduce((pre,item)=>{ //二级分类
            pre.push(
             {value: item._id,
             label: item.name,
             isLeaf: true,
           }
            ) 
            return pre     
          },[])   

        }
       
    }
   
  }
  // 初始化列表项 修改就形成options 新增就没有options
  initOptions=async()=>{
    // console.log("isUpdate",this.isUpdate)
    //如果是修改
    if(this.isUpdate){
    const options =await this.getOptions("0")
    const{pCategoryId}=this.product

    let targrtOption= options.find(item=>item.value===pCategoryId)
    let childrenOption =await this.getOptions(pCategoryId)
    targrtOption.children=childrenOption

    // console.log("options",options,"targrtOption,",
    // targrtOption,"childrenOption",childrenOption,
    // "this.options",this.state.options
    // )
    this.setState(
      {options}
     )
    }else{
    const options =await this.getOptions("0")
    this.setState(
      {options}
     )
    }
   
  }
  // 商品分类变化
  onChange=(value)=>{
    // console.log("value",value)
    this.setState({categoryIds:value})  

  }
// 动态加载二级options
  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(async() => {
      targetOption.loading = false;
      targetOption.children =await this.getOptions(targetOption.value)
      targetOption.children.forEach(item => {
        item.isLeaf=true
      });

    // console.log("targetOption",targetOption.children)
    this.setState(
      (state)=>{
        return {options:state.options}
      }
    )


      
    }, 500);
  };

  // 提交
  onFinish=async(value)=>{
    
     const { name,desc,price}=value
     const detail=this.editor.current.getDetail()
     const imgs=this.pw.current.getImgs()
     const pCategoryId=this.state.categoryIds[0]
     const categoryId=this.state.categoryIds[1]
     const product={
      name,desc,price,detail,imgs,pCategoryId,categoryId
     }
     const result =await reqAddOrUpdateProduct(product)
     if(result.status===0){
       message.success("添加商品成功！")
       console.log("this.form",this.form)
       this.form.current.resetFields()
       
     }else{
       message.error("添加商品失败！")
     }
     
  }

  componentWillMount(){
    const product=this.props.location.state//取出携带的product
     this.isUpdate = Boolean(product) 
    this.product = product || {}

   
   
    console.log("componentWillMount" , this.product, "sdfege",this.isUpdate)

  }
  componentDidMount(){
    this.initOptions()
    console.log("componentDidMount" , this.product, "sdfege",this.isUpdate)


  }
  
  

  render(){
    const title =( 
      <div>
        <i className={"iconfont icon-arrowLeft-fill"} 
         style={{marginRight: 10, fontSize: 20}} 
         onClick={() => this.props.history.goBack()}></i>
         <span>{this.isUpdate?"修改商品":"添加商品"}</span>
      </div>)
     
     const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 8,
      },
    };

    const {options}=this.state
    const {categoryId,pCategoryId,name,desc,price,detail,imgs}=this.product
    const categoryIds=[pCategoryId,categoryId]
   
    


    // const categryIds=


    // const { loading, imageUrl } = this.state;
    // const uploadButton = (
    //   <div>
    //     {loading ? <i className="iconfont icon-LoadingOutlined" /> : <i  className="iconfont icon-PlusOutlined" />}
    //     <div style={{ marginTop: 8 }}>Upload</div>
    //   </div>
    // );
    
    return (
      <>
      <Card title={title} >
      <Form
      {...layout}
      ref={this.form}
      
      onFinish={this.onFinish}
      // onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="商品名称"
        name="name"
        rules={[{ required: true, message: '请输入商品名' }]}
        initialValue={name}
      
      >
        <Input placeholder="请输入商品名" />
      </Form.Item>

      <Form.Item
        label="商品描述"
        name="desc" 
        rules={[{ required: true, message: '请输入商品描述' }]}
        initialValue={desc}


      >
        <TextArea 
        autosize={{ minRows: 2, maxRows: 6 }}
        allowClear="true"
         placeholder="请输入商品描述" />
      </Form.Item>

      <Form.Item
        label="商品价格"
        name="price"
        rules={[
          {
            validator:async (rule, value) => {
              if(!value){
                throw new Error(' 输入商品名');

              }else if(value<=0){
                throw new Error('价格大于0 ');
              }
            }
          },
        ]}
        initialValue={price}

      >
        <Input type="number"  suffix="元" placeholder="请输入商品名" />
      </Form.Item> 
      
      <Form.Item
        label="商品分类"
        name="categoryIds"
      
      >
      <Cascader
       options={options} 
       loadData={this.loadData}
       onChange={this.onChange} 
       placeholder="请指定商品分类"
       defaultValue={categoryIds}

        />,
        
      </Form.Item>  
        
  <Form.Item
        label="商品图片"
        name="imgs" 
        initialValue={imgs}

      >
        <PicturesWall ref={this.pw}  imgs={imgs}/>
      
      </Form.Item>  

        <Form.Item
        label="商品详情"
        name="detail"   
        initialValue={detail}

      >
        <RichTextEditor ref={this.editor} detail={detail}/>
      </Form.Item> 

     
      <Form.Item >
        <Button type="primary" htmlType="submit" >
          提交
        </Button>
      </Form.Item>
    </Form>

      
      </Card>


      </>
       )
    }
}