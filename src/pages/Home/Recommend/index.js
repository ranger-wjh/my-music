import React, { Component } from 'react'
import { Carousel } from 'antd';
import {push} from '../../../Common/API'
export default class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider:[],
            radioList:[]
        }
    }
    
    componentDidMount(){
        //请求推荐页轮播图
        this.$http.get(push).then(res=>{
            this.setState({
                slider:res.data.data.slider,
                radioList:res.data.data.radioList
            })
        })
    }
    render() {
        const banner = this.state.slider.map((item,index)=>{
            return <div key={index}>
                    <img src={item} alt=''/>
                </div>
        })
        const songList = this.state.radioList.map((item,index)=>{
            return <div key={index} className='list'>
                <img src={item.picUrl} alt=""/>
                <p>{item.title}</p>
            </div>
        })
        return (
            <div className="recommend">
                <div className="banner">
                    <Carousel autoplay>
                        {banner}
                    </Carousel>
                </div>

                <div className="radioList">
                    <div className="songlist">
                        <h2>电台</h2>
                        <div className="radio">
                            {songList}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
