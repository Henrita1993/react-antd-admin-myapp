import React,{Component} from 'react';
import { Row, Col , Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import './home.less'



export default class Home extends Component{
  option = {
    title: {
        text: '折线图堆叠'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};
  render(){
    return (
      
        <Row style={{marginTop:50}}>
      <Col
        style={{marginRight:100,marginLeft:50 }}
        flex="2"

      >
        <Card 
        size="small" title="Small size card" 
        extra={ <i className='iconfont icon-yiwen'></i> }
        >
          <p style={{fontSize:20,fontWeight:500,}}>1,128,163<span style={{fontSize:10,fontWeight:100,}}>个</span> </p>
          <p>Card content</p>
          <p>Card content</p>
          </Card>
          </Col>
      <Col
        flex="5"

       >
      <ReactECharts option={this.option} style={{width:600 ,height:200}} />
        
      </Col>
    </Row>
        

          
       
        
      
     
       )
    }
}