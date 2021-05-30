import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

/*
更新分类的form组件
 */
class UpdateForm extends Component {
  form = React.createRef()

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount () {
    // console.log("update",this.form)
    // 将form对象通过setForm()传递父组件
    this.props.setForm(this.form)
  }

  render() {

    const {categoryName} = this.props

    return (
      <Form ref={this.form}>
        <Item
        name="categoryName"
        initialValue={categoryName}
        rules={[
          {required: true, message: '分类名称必须输入'}


        ]}
        
        // initialValue = parentId
      >
       <Input placeholder='请输入分类名称'/>

      </Item>


     
      </Form>
    )
  }
}

export default UpdateForm