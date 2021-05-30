import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import  PropTypes  from 'prop-types';



export default  class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    console.log("props22222222222" ,this.props.detail)
    if(this.props.detail){
      const html = this.props.detail
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }

    }else{
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }
   
  }
 

  

  onEditorStateChange= (editorState) => {
    this.setState({
      editorState,
    });
  };

  getDetail=()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  

  render() {
    console.log("detail",this.props.detail)
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
       
      </div>
    );
  }
}