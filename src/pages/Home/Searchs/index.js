import React, { Component } from 'react'
import { Input } from 'antd';
import {search} from '../../../Common/API'
import Masks from '../../../Component/masks'
const { Search } = Input;

export default class Searchs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songList:[],
            flag:false   //搜索结果框的显示或隐藏
        }
    }
    
    //搜索
    searchs(value){
        if(value == ""){
            return false;
        }
        this.$http.get(search,{params:{
            keyword:value
        }}).then(res=>{
            console.log(res)
            this.setState({
                songList:res.data.data.song.itemlist,//搜索对应歌曲返回的数组
                flag:true
            })
        })
    }
    
    //取消
    cancel(){
        this.setState({
            flag:false
        })
       console.log(this.refs)
    }

    render() {
        return (
            <div className="search">
                <div className="search-info">
                    <Search
                        placeholder="搜索歌曲、歌手、专辑"
                        onSearch={value => this.searchs(value)}
                        style={{ width: 260,height:40 }}
                        allowClear
                        />
                        <span className="cancel" onClick = {this.cancel.bind(this)}>取消</span>
                </div>
                
              
                {
                    this.state.flag ?  <Masks songList = {this.state.songList}/> : ""
                 }
                   
            </div>
        )
    }
}
