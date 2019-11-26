import React, { Component } from 'react'
import {list}  from '../../Common/API'
import {Icon} from 'antd'
import BScroll from 'better-scroll'
export default class TopList extends Component {
    constructor(props) {
        super(props);
        this.state = {
           songList:[],//存放100首歌曲
           songListName:"",
           songUpdateTime:"",
           songtotalSongNum:"",
           el:"",
           pullup:"上拉加载",
           end:20
       }
       this.renderlist = this.renderlist.bind(this)
    }

    componentDidMount(){
      let id = this.props.location.state.id
        //请求歌曲列表
        this.$http.get(list,{params:{id}}).then(res=>{
            this.setState({
                songList:res.data.data.songList,
                songListName:res.data.data.topInfo.listName,
                songUpdateTime:res.data.data.updateTime,
                songtotalSongNum:res.data.data.totalSongNum
            },()=>{
                //请求完成后立即调用
                this.renderlist(0,this.state.end)
                //滚动加载
                let bs = new BScroll(".topList",{
                    probeType:2,
                    click:true
                })

                //绑定滚动事件
                bs.on('scroll',()=>{
                    //滚动到底部
                  if(bs.y < bs.maxScrollY){
                      this.setState({
                          pullup:"释放加载"
                      })
                  }
                })

                //滚动到底部 加载下20首歌曲
                bs.on('scrollEnd',()=>{
                  if(this.state.pullup === "释放加载"){
                    let end = this.state.end
                    this.renderlist(0,end+20)
                  }
                })
            })
        })
    }
    //播放歌曲
    play(songId,songMid){
        this.props.history.push({pathname:'/play',state:{songId:songId,songMid:songMid}})
    }

    //获取100首歌曲
    renderlist(start,end){
        const el = this.state.songList.slice(start,end).map((item,index)=>{
            return (
                    <li key={index}>
                        <span className="songIndex">{index+1}</span>
                        <div className="songInfo">
                            <div className="song" >
                                <p className="songName" onClick={this.play.bind(this,item.songId,item.songMid)}>{item.songName}</p>
                                <p>{
                                        item.singer.map((v,i)=>{
                                        return <span key={i}>{v.singerName}</span>
                                        })
                                    }
                                </p>
                            </div>
                            <div className="icon">
                                 <Icon type="download"  />
                            </div>
                        </div>
                    </li>
            )
        })
        this.setState({
            el,
            end,
            pullup:"上拉加载"
        })
    }


    render() {
      
        return (
            <div className="container topList">
                <div>
                    <div className="songHead">
                        <p className="listName">{this.state.songListName}</p>
                        <p className="listTitle">{this.state.songListName}  第{this.state.songtotalSongNum}天</p>
                        <p className="listUpdateTime">更新时间:  {this.state.songUpdateTime}</p>
                        <p className="playbtn">
                            <Icon type="caret-right" />
                        </p>
                        <p className="listRank">排行榜 共{this.state.songList.length}首</p>
                    </div>
                
                    <ul>
                        {this.state.el}
                    </ul>
                    <p className="pullup">{this.state.pullup}</p>
                </div>
            </div>
        )
    }
}
