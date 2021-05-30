import React,{Component} from 'react';
import { Card ,Select,Button,Input, Table} from 'antd';
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts} from '../../api/index.js'
import {PAGE_SIZE} from '../../utils/constants.js'
const { Option } = Select;



export default class ProductHome extends Component{
  state={
    products:[],//当前显示产品列表
    searchType:"",//搜索类型
    searchWord:"",// 搜索关键词
    isSearch:false,//按条件搜索
    total:0,//产品总数量

  }
  componentWillMount(){
    this.initColumn()
  }
  componentDidMount(){
    this.getProducts(1)
    // console.log("object213" ,this.state)

  }
  
  // 初始化表头
  initColumn = ()=>{
     this.columns= [
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
        width:100,
        dataIndex: 'price',
        render:price=>"￥"+ price
      },
     
      {
        title: '状态',
        width:100,
        dataIndex: 'status',
        render: (status) => (
          <div> 
          <Button type="primary">{status===1?"下架":"在售"}</Button>
          <div>{status===1?"在售":"下架"}</div>

          </div>
         
        ),
      },
      {
        title: '操作',
        width:100,
        render: product => (
          <>
            <LinkButton onClick={ ()=>{
                this.props.history.push("/product/detail", product)             
              }} >详情</LinkButton>
            <LinkButton onClick={ ()=>{
                this.props.history.push("/product/addupdate", product)             
              }} >修改</LinkButton>
          </>
        ),
      },
    ];
    
  }

  // 根据指定页面获得产品列表
  getProducts=async(pageNum)=>{
    const {searchType,searchWord,isSearch}=this.state 
    console.log("result",searchType ,searchWord,isSearch)


    let result
    if (isSearch) {
      if(searchType==="searchName"){
       result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE,productName: searchWord})   
      // console.log("result",{pageNum, pageSize:PAGE_SIZE,productName: searchWord})
      }else{
       result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE,productDesc: searchWord})        
      }


    }else{
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    // console.log("result",result.data)
    this.setState({
      products:result.data.list,
      total:result.data.total
    })    
  }

  sousuo=()=>{
     this.setState({isSearch:true},
      ()=>{
      this.getProducts(1)
      }
     )

  }
 
  render(){
    const {products,total}=this.state
    const title=(
      <div>
      <Select style={{width:120,marginRight:5}}
      // name="select"
      onChange={(value)=>{this.setState({
        searchType:value
      })}}
      // value="searchName"
      
    >
      <Option value="searchName">按名称搜索</Option>
      <Option value="searchDes">按描述搜索</Option>
      </Select>
      <Input placeholder="关键字" 
        style={{width:120,marginRight:5}}
        onChange = {(e)=>{this.setState({
          searchWord:e.target.value
        }) }}
       />

      <Button type="primary"
       onClick={this.sousuo} >搜索</Button>
      </div>)

    const extra =(<Button type="primary"  onClick={()=>{this.props.history.push("/product/addupdate")}}>
        <i className="iconfont icon-plus"style={{marginRight:5}} ></i>
        添加商品
      </Button>)

    return (
      <Card size="small" 
      title={title}
      extra={extra} >
        <Table 
        columns={this.columns} 
        rowKey="_id"
        dataSource={products} 
        pagination={{
            // current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />


      
    </Card>
       )
    }
}