import React,{Component} from 'react';
import PropTypes from 'prop-types'
import { Input ,Form} from 'antd';


export default class UpdateForm extends Component{
  form = React.createRef()
 static propTypes ={
  categoryName:PropTypes.string.isRequired,
  setForm:PropTypes.func.isRequired
 }
 componentWillMount(){
   this.props.setForm(this.form)  
 }
  render(){
    const categoryName=this.props.categoryName
    return (
      <Form ref={this.form}  >
      <Form.Item
        name="categoryName"
        initialValue={categoryName}
        rules={[
          {
            required: true,message:"分类名必须输入"
          },
        ]}
      >
        <Input />
      </Form.Item>
      </Form>

     
       )
    }
}