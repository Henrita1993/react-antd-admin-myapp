import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  message
} from 'antd'


import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


const Item = Form.Item // 不能写在import之前


/*
登陆的路由组件
 */
class Login extends Component {
  form=React.createRef()
   onFinish = async(values) => {
    // console.log('Success:', values);
    
        // console.log('提交登陆的ajax请求', values)
        // 请求登陆
        const {username, password} = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        // console.log('请求成功', result)
        if (result.status===0) { // 登陆成功
          // 提示登陆成功
          message.success('登陆成功')

          // 保存user
          const user = result.data
          console.log("user",user)

          
          memoryUtils.user = user // 保存在内存中

          storageUtils.saveUser(user) // 保存到local中

          // 跳转到管理界面 (不需要再回退回到登陆)
          this.props.history.replace('/')

        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }

      } 

  

   onFinishFailed = (errorInfo) => {
    console.log('校验失败');
  };
 
  validatePwd = async (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
      if(!value) {
        throw new Error('密码必须输入')
      } else if (value.length<4) {
         throw new Error('密码长度不能小于4位')
      } else if (value.length>12) {
         throw new Error('密码长度不能大于12位')
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
         throw new Error('密码必须是英文、数字或下划线组成')
      } 
    
  }
    
  

 

 
  

  render () {
  
    
    // 如果用户已经登陆, 自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }

   

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>

{/* 用户名 */}
          <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} ref={this.form} onSubmit={this.handleSubmit} className="login-form">
          <Item       
          name="username"
          rules={ [
            { required: true, whitespace: true, message: '用户名必须输入' },
            { min: 4, message: '用户名至少4位' },
            { max: 12, message: '用户名最多12位' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
          ]}

      >
        <Input
            prefix={ <i className="iconfont icon-yonghu" style={{ color: 'rgba(0,0,0,.25)' }} ></i>}
            placeholder="用户名"
          />
      </Item>
    {/* 密码 */}
      <Item       
          name="password"
          rules= {
           [{
            validator:this.validatePwd
           }
            ]
          }

      >
        <Input
                    prefix={ <i className="iconfont icon-suo" style={{ color: 'rgba(0,0,0,.25)' }} ></i>}
                    type="password"
                    placeholder="密码"
                  />
      </Item>
{/* 登录框 */}
      <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
      </Item>

      </Form>




         
        </section>
      </div>
    )
  }
}


// const WrapLogin = Form.create()(Login)
export default Login
/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */