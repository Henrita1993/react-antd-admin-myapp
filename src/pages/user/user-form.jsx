import React,{Component} from 'react';
import {Form,Input,Select} from 'antd'
const { Option } = Select;


export default class UserForm extends Component{
 
  form=React.createRef()
  componentWillMount(){
    console.log("object",this.props.user)
  }
 
  
  render(){
    const {roleList,user} = this.props
    const layout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div>
      <Form
      {...layout}
      ref={this.form}
      
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
        initialValue={user.username}
      
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password" 
        rules={[{ required: true, message: '请输入密码' }]}
        initialValue={user.password}

      >
        <Input type="password" />
       
      </Form.Item>

      <Form.Item
        label="手机号"
        name="phone"
        rules={[{ required: true, message: '请输入手机号' }]}
        initialValue={user.phone}

      >
        <Input />
      </Form.Item> 
      
      <Form.Item
        label="邮箱"
        name="email"
        rules={[{ required: true, message: '请输入邮箱' }]}
        initialValue={user.email}
   
      >
        <Input/>
      </Form.Item> 
        
      <Form.Item
        label="角色"
        name="role_id" 
        initialValue={user.role_id}

      >  
       <Select
      >
        {
          roleList.map(item=><Option key={item._id} value={item._id}>{item.name}</Option>)

        }
      </Select>


      </Form.Item>  

      </Form> 
      </div> 
       )
    }
}