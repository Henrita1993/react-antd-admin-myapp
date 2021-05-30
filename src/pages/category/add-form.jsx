import React,{Component} from 'react';
// import {reqCategorys} from '../../api/index'
import PropTypes from 'prop-types'
import { Select ,Form,Input} from 'antd';


const { Option } = Select;


export default class AddForm extends Component{
  form=React.createRef()
  static propTypes={
    setForm:PropTypes.func.isRequired,
    ZeroCategorys:PropTypes.array.isRequired
  }
  componentWillMount(){
    this.props.setForm(this.form)
    console.log("ZeroCategorys",this.props.ZeroCategorys)

  }
  componentDidMount(){
  }
  
//得到一级分类option
  getNodes=()=>{
    return(
      this.props.ZeroCategorys.reduce((pre,item)=>{
        pre.push(
        <Option value={item._id}>{item.name}</Option>
        )
        return pre
      },[])

    )
     
  }
  

  render(){

    return (
      <Form ref={this.form}>
         <Form.Item
          name="parentId" 
          initialValue="0"
          rules={[{ required: true }]}>
            <Select>
              <Option value="0">一级分类</Option>
              {
                this.getNodes()
              }
            </Select>
         </Form.Item>

         <Form.Item
          name="categoryName" 
          
          rules={[{ required: true ,message:"请输入分类名称"}]}>
           <Input 
           placeholder="请输入分类名称"
           />
         </Form.Item>
      

      </Form>
       )
    }
}