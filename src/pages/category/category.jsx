import React,{Component} from 'react';
import { Card ,Button,Table,Space, message,Modal } from 'antd';
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api/index'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import UpdateForm from "./update-form"
import AddForm from './add-form'

export default class Category extends Component{
  state={
    loading:false,//是否加载中
    categorys:[],//当前显示的列表
    parentId:'0',//当前显示列表的父ID
    modelShow:0,//0不显示1显示修改2显示添加
    // selectd:null
    ZeroCategorys:[],//一级分类列表
    currentPage:2//当前显示页
  }

  columns=()=>{
    return [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <Space >
            <LinkButton onClick={()=>{this.showApdate(category)}}>修改分类 </LinkButton>
           {
             this.state.parentId==="0"?<LinkButton onClick={()=>{this.showChildren(category)}}>查看子分类</LinkButton>:null
           } 
          </Space>
        ),
      },
     
    ]
     
  }
  
  //查看子分类
  showChildren=(category)=>{
    const parentId = category._id
    this.categoryName=category.name
    this.getCategorys(parentId)
    // 将显示的parentID跟新
    this.setState({
      parentId
    })

     
  }

  // 根据指定parentID获取品类列表 将结果放入state.categorys
  getCategorys=async(parentId)=>{

    this.setState({
      loading:true
    })
    const result = await reqCategorys(parentId)
    this.setState({
      loading:false
    })
    

    if(result.status===0){
      if(parentId === "0"){
        this.ZeroCategorys=result.data
      console.log("ZeroCategorys",this.ZeroCategorys)

      }
      console.log("result",result)
      this.setState({
        categorys:result.data
      })

    }else{
      message.error("获取列表失败")
    }
     
  }
//取消对话框
  handleCancel=()=>{

    // 关闭对话框
     this.setState(
      {
        modelShow:0,
      }
     )
    //  将对话框清空
    // this.form.current.resetFields()

  }
  //显示修改分类
  categoryName=""
  showApdate=(category)=>{
    // console.log("selectd",this.form.current)
    this.category=category //当前选中的分类
    this.categoryName = category.name || ""  //当前选中的分类名
    this.setState({
      modelShow:1,

    })    
  }

  // 修改分类操作
  updateCategory=()=>{
    // 验证表单
    this.form.current.validateFields()
    .then(async(values) => {
     const {categoryName}=values
     const  categoryId = this.category._id
     const result = await reqUpdateCategory({categoryId, categoryName})
     if(result.status===0){
       message.success("修改分类成功！")
      this.getCategorys(this.state.parentId)
     }
    })
    // 修改框消失
    this.setState({
      modelShow:0
    })
    
     
  }
  // 添加品类
  showAdd=()=>{
     this.setState({
      modelShow:2
     })
  }
  addCategory=()=>{
     this.form.current.validateFields()
     .then(async(values) => {
       console.log("values",values)
       const {categoryName,parentId}=values
       const result =await reqAddCategory(categoryName,parentId)
       if(result.status===0){
        message.success("新增成功")
        this.getCategorys(this.state.parentId)


       }else{
         message.error("新增失败")
       }
       this.setState({
         modelShow:0
       })

     })
  }



  // 回到一级列表
  backToFirst=()=>{
    this.getCategorys("0")
     this.setState({
       parentId:"0"
     })
  }


// 跳转分液器
  onChange=(page)=>{
    this.setState({
      currentPage:page
    })
     
  }



  // 初始化列表选项
  componentWillMount(){
    this.columns()

   

  }
  componentDidMount(){
    this.getCategorys("0")
   
  }

  render(){
    const{categorys,modelShow,parentId,currentPage}=this.state
    const ZeroCategorys = this.ZeroCategorys
    const title = parentId==="0"?<span>一级分类</span>:
    (<div>
       <LinkButton onClick={this.backToFirst }>一级分类</LinkButton>
       <i className="iconfont icon-ArrowRight" style={{marginRight:15}} ></i>
       <span>{this.categoryName}</span>
    </div>
    )
    const extra = <Button type="primary" onClick={this.showAdd}> 
      <i className="iconfont icon-plus" style={{fontSize:15,marginRight:5}}></i>
      添加
    </Button>
    const columns=this.columns()
    return (
      <div>
        <Card 
       title= {title}
       extra={extra} >
      <Table
      bordered
      // loading
      tableLayou="fixed"
      columns={columns} 
      dataSource={categorys}
      rowKey="_id"
      pagination={{
        showQuickJumper:true,
        // defaultCurrent:{currentPage},
        // current:{currentPage},
        // total={total},
        // onChange:this.onChange,
        pageSize:PAGE_SIZE

      }
        
      }
      />
      </Card>
{/* 修改显示框 */}
      <Modal title="修改分类"
       visible={modelShow===1?true:false} 
       onOk={this.updateCategory} 
       onCancel={this.handleCancel}>
         <UpdateForm
         categoryName={this.categoryName}
         setForm = {form=>this.form = form}

         />
       
      </Modal>

{/* 新添框显示 */}
<Modal title="添加分类"
       visible={modelShow===2?true:false} 
       onOk={this.addCategory} 
       onCancel={this.handleCancel}>
        <AddForm
        setForm={(form)=>this.form=form}
        ZeroCategorys={ZeroCategorys}
        />
       
      </Modal>




      </div>
   

       )
    }
}