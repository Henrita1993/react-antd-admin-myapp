import React,{Component} from 'react';
import { Card ,Button,Table,Modal, message } from 'antd';
import {formateDate} from '../../utils/dateUtils'
import {reqRoles,reqUsers,reqAddOrUpdateUser,reqDeleteUser} from '../../api/index'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import UserForm from './user-form';




export default class User extends Component{
  UserForm=React.createRef()
  state={
    roles:{},//角色列表id-name
    roleList:{},//所有角色列表
    users:[],
    isShow:false,//是否弹框
    user:{},//当前选中的user
  }
  // 表格头初始化
  initColums=()=>{
    this.columns= [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '手机号码',
       
        dataIndex: 'phone',
        
      },
     
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render:(role_id)=>this.state.roles[role_id]
        
      },
      {
        title: '操作',
        width:200,
        render: user => (
          <>
            <LinkButton onClick={()=>{this.update(user)}}  >修改</LinkButton>
            <LinkButton onClick={()=>{this.delete(user)}} >删除</LinkButton>
          </>
        ),
      },
    ];
     
  }
  // role形成ID用户名的对象
  getRoles=async()=>{
    let result = await reqRoles()
    if(result.status===0){
      const roleList = result.data
      const roles=roleList.reduce((pre,item)=>{
        pre[item._id]=item.name
        return pre
      },{})
      this.setState({roles,roleList})
    }
 
  }


  //创建用户
  addUser=()=>{
    this.setState({isShow:true})
 
  }
  //修改用户
  update=(user)=>{
    // console.log("object",user)
    this.setState({
      user:user
    })
    this.setState({isShow:true})//选中用户保存起来
  
  }
  delete=(user)=>{
  const { confirm } = Modal;
  confirm({
    content: <h5>确定删除吗？</h5>,
    onOk:async()=> {
      const result = await reqDeleteUser(user._id)
      if(result.status===0){
        message.success("删除用户成功！")
        this.getUsers()
      }else{
        message.error("删除用户失败！")

      }
    },
    onCancel() {
      console.log('Cancel');
    },
  });


    
     
  }
  // 获取用户列表
  getUsers=async()=>{
    const result = await reqUsers()
    if(result.status===0){
      const users=result.data.users
      this.setState({
        users
      })
    }
     
  }
  //添加用户提交
  handleOk=()=>{
   this.form = this.UserForm.current.form.current
   this.form.validateFields()
   .then(async(value)=> {
     const result =  await reqAddOrUpdateUser(value)
     if(result.status===0){
       message.success("添加用户成功")
       this.form.resetFields()

     }else{
        message.error(result.msg)
     }
    }
   )
   this.setState({isShow:false})
    
  }
  //添加用户取消
  handleCancel=()=>{
   this.form = this.UserForm.current.form.current
   this.form.resetFields()
   this.setState({
     isShow:false,
     user:{}})
 
  }
  componentWillMount(){
    this.initColums()
    this.getRoles()
  }
  componentDidMount(){
    this.getUsers()
  }
  render(){
    // console.log("this.role",this.state.roles)
    const {users,isShow,roleList,user}=this.state

    return (
      <div>
      <Card 
      title={<Button type="primary" onClick={this.addUser}>创建用户</Button>} 
      >
      <Table 
      // width=""
      rowKey="_id"
      dataSource={users} 
      columns={this.columns} 
      pagination={{showSizeChanger:true,pageSize:PAGE_SIZE}}
      />
      </Card>
      <Modal 
      title="添加用户" 
      visible={isShow} 
      onOk={this.handleOk} 
      onCancel={this.handleCancel}>
        <UserForm roleList={roleList} ref={this.UserForm} user={user}></UserForm>
        
      </Modal>
      </div>
     

       )
    }
}