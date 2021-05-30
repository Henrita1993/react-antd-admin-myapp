import React,{Component} from 'react';
import { Card,Button, message } from 'antd';
import { Table, Radio, Divider,Modal,Input,Form } from 'antd';
import { RichUtils } from 'draft-js';
import {formateDate} from '../../utils/dateUtils'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'


export default class Role extends Component{
  addForm=React.createRef()
  authForm=React.createRef()

  
  state={
    roles:[],//展示的角色列表
    total:1,//role总数
    isShow:false,//是否弹框
    role:{},//被选中的角色
    isShowAuth:false,//是否显示角色权限设置

  }

  initColumms=()=>{
     this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render:(create_time)=> formateDate(create_time)

      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:(auth_time)=> formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ];
     
  }
  //得到角色列表
  getRoles=async()=>{
    const result = await reqRoles()
    if(result.status===0){
      const roles = result.data
      const total =roles.length
    this.setState({roles,total})


    } 
  }
  //确定添加取消
  handleCancel=()=>{
    // console.log("object",this.addForm.current)
     this.addForm.current.resetFields()
     this.setState({isShow:false})
  }

  //确定添加
  handleOk=async()=>{
   const roleName = this.addForm.current.getFieldsValue().name
  //  console.log("roleName",roleName)

    const result = await reqAddRole(roleName)
    if(result.status===0){
      message.success("添加角色成功！")
      this.getRoles()
      this.setState({isShow:false})
    }
     
  }

  //确定修改权限
  handleAuth=async()=>{
    const {_id}=this.state.role
    const menus=this.authForm.current.getMenus()
    const auth_time=Date.now()
    const auth_name =memoryUtils.user.username
    const result = await reqUpdateRole({_id,menus,auth_time,auth_name})
    if(result.status===0){
      message.success("修改权限成功！")
      console.log("auth_name",auth_name)
      this.setState({isShowAuth:false})
      this.getRoles()
    }else{
      message.error("修改权限失败！")
    }
  }
  //确定修改取消
  handleCancelAuth=()=>{
    this.authForm.current.authForm.current.resetFields()
     this.setState({isShowAuth:false})
  }



  componentWillMount(){
    this.initColumms()

  }
  componentDidMount(){
    this.getRoles()

  }
  render(){
    const {roles,total,isShow,role,isShowAuth}=this.state

    const title=(
      <div>
      <Button type="primary" style={{marginRight:10}} onClick={()=>{
        if( this.addForm.current){this.addForm.current.resetFields()}
        
        this.setState({isShow:true})}} >创建角色</Button>
      <Button type="primary" disabled={!role._id} onClick={()=>{this.setState({isShowAuth:true})}} >设置角色权限</Button>
      </div>
    )
    
    return (
      <div>
        <Card 
        title={title} 
        >
            <Table
            rowKey="_id"
            rowSelection={{
              type: "radio",
              onSelect:(role)=>{this.setState({role})},
              selectedRowKeys:[role._id] //默认选中的
            }}
            onRow={(role)=>{
              return {
                onClick:()=>{this.setState({role})}
              }
              }}
            columns={this.columns}
            dataSource={roles}
            pagination={{
              showSizeChanger:true,
              showQuickJumper:true,
              showTotal:(total)=>{return `Total ${total} items`},
              total:{total},
              pageSize:PAGE_SIZE,
            }

            }

          />

      <Modal 
      title="添加角色" 
      visible={isShow} 
      onOk={this.handleOk} 
      onCancel={this.handleCancel}
      >
        <Form ref={this.addForm}>
        <Form.Item 
        label="角色名称"
        name="name"
        initialValue=""
        // {...tailLayout}
        rules={[
          {
            required: true,
            message: '请输入角色名称',
          },
        ]}
        
        >
          <Input></Input>

        </Form.Item>

        </Form>
      </Modal>

      <Modal 
      title="设置角色权限" 
      visible={isShowAuth} 
      onOk={this.handleAuth} 
      onCancel={this.handleCancelAuth}
      >
        <AuthForm roles={roles} role={role} ref={this.authForm} />
        
      </Modal>

     
    </Card>

      </div>
       )
    }
}