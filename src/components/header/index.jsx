import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'

import LinkButton from '../link-button'
// import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import Item from 'antd/lib/list/Item'

/*
左侧导航的组件
 */
class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    // dayPictureUrl: '', // 天气图片url
    // weather: '', // 天气的文本
  }

  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  // getWeather = async () => {
  //   // 调用接口请求异步获取数据
  //   const {dayPictureUrl, weather} = await reqWeather('北京')
  //   // 更新状态
  //   this.setState({dayPictureUrl, weather})
  // }

  // getTitle = () => {
  //   // 得到当前请求路径
  //   const path = this.props.location.pathname
  //   console.log("path",path)
  //   let title
  //   menuList.forEach(item => {
  //     if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
  //       title = item.title
  //     } else if (item.children) {
  //       // 在所有子item中查找匹配的
  //       const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
  //       // 如果有值才说明有匹配的
  //       if(cItem) {
  //         // 取出它的title
  //         title = cItem.title
  //       }
  //     }
  //   })
  //   console.log("title",title)

  //   return title
  // }
  getTitle=(list)=>{
    list=list || menuList
    const path = this.props.location.pathname
    list.forEach(item=>{
      if(!item.children){
          if(item.key === path){
            
            this.title=item.title
          }
        }else{
           this.getTitle(item.children)
  
        }
    }) 
    // console.log("title111",this.title)

    return "aa"
  }

  /*
  退出登陆
   */
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }

  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    // 获取当前天气
    // this.getWeather()
  }
  /*
  // 不能这么做: 不会更新显示
  componentWillMount () {
    this.title = this.getTitle()
  }*/

  /*
  当前组件卸载之前调用
   */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }


  render() {
    let a =this.getTitle()
    let title = this.title


    const {currentTime, dayPictureUrl, weather} = this.state

    const username = memoryUtils.user.username

    // 得到当前需要显示的title
    // const title = this.title
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img alt="weather"/>
            <span>天气</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)