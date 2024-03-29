import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

/*
商品路由
 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product/addupdate' component={ProductAddUpdate}/>

        <Route path='/product/detail' component={ProductDetail}/>
        <Route path='/product' component={ProductHome} /> {/*路径完全匹配*/}

        <Redirect to='/product'/>
      </Switch>
    )
  }
}