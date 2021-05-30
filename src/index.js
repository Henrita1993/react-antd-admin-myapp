import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// 如果 local 中保存了 user, 将 user 保存到内存中
const user = storageUtils.getUser()
if(user && user._id) {
memoryUtils.user = user
}

ReactDOM.render(
  
    <App />
 ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
