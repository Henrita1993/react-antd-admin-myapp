import React,{Component} from 'react';
import {Form,Input,Tree} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item


export default class AuthForm extends Component{
  authForm=React.createRef()
  state={
    roles:this.props.roles,
    role:this.props.role,
    menus:this.props.role.menus//当前被选中的

  }
  initTree=(menuList)=>{  
    return  menuList.reduce((pre,item) =>{
            if(!item.children){
              pre.push({
                title:item.title,
                key:item.key
              })
              
            }else{
              pre.push(
                {
                  title:item.title,
                  key:item.key,
                  children:this.initTree(item.children)
                }
              )
            }
            return pre
          },[])     
 }

 getMenus=()=>{
    return this.state.menus
 }
 

  render(){
    const {role,roles,menus}=this.state
    console.log("menus,",menus)
    return (
      <Form ref={this.authForm} >
      <Item 
      label='角色名称'
      name="name"
      initialValue={role.name}     
      >
        <Input  disabled/>
      </Item>

      <Item 
      name="menus"
      // initialValue={menus}
      >          
          <Tree
            checkable
            defaultExpandAll
            defaultCheckedKeys={role.menus}
            // checkedKeys={menus}


            // defaultSelectedKeys={menus}
            // defaultCheckedKeys={['0-0-0', '0-0-1']}
            // onSelect={(selected)=>{
            //   const menus=this.state.menus.concat(selected)
            //   // [...this.state.menus,selected]
            //   // this.setState({menus})
            //   // (checkedKeys=>{
            //   //   checkedKeys={menus}

            //   // })
              
            //   console.log("onSelect",menus)
            

            //  }}
            onCheck={(menus)=>{ this.setState({menus})}}

            treeData={
              [
                {
                  title: '平台权限',
                  key: 'all',
                  children: this.initTree(menuList)
                }
              ]
            }
          />
      </Item>
    </Form>   
       )
    }
}