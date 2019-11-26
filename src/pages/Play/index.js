import React, { Component } from 'react'
import {play,lyric} from '../../Common/API'
import {Icon} from 'antd'
export default class Play extends Component {
    constructor(props){
        super(props)
        this.state = {
            lyric:"",
            playurl:"",
            listArr:[],
            el:"",
            i:"",
            time:0,
            flag:true, //播放与暂停,
            like:true,
            duration:0,//当前音乐总时长
            currentTime:0, //当前播放时长
            left:""
        }
        this.getLyric = this.getLyric.bind(this)
        this.getUrl = this.getUrl.bind(this)
        this.renderList = this.renderList.bind(this)
        this.interval = this.interval.bind(this)
    }

    componentDidMount(){
      this.getUrl();
      this.getLyric();
       
    }

    componentWillUnmount(){
        clearInterval(this.timer)
        this.timer = null
    }



    //获取歌曲播放链接
    getUrl(){
        const mid = this.props.location.state.songMid
        this.$http.get(play,{ params:{mid}}).then(res=>{
                this.setState({
                    playurl:res.data
                })
                //获取当前音频
                const audio = this.refs.audio
                //audio的oncanplaythrough事件 代表当前音乐缓存完成
                //audio.duration属性返回音乐总时长  数值形式 单位:秒
                audio.oncanplaythrough = () =>{
                    const duration = audio.duration  //获取当前音乐的总时长  必须在音乐缓存完后执行(在oncanplaythrough时间内)
                    this.setState({
                        duration:this.timeFormat(duration)   //当前音乐总时长 数组形式 单位:秒
                    })
                }

                //audio.ontimeupdate事件  当前音乐时间发生变化 也就是播放状态
                //audio.currentTime属性  返回当前播放时间 数值单位  秒
                audio.ontimeupdate = () => {
                   const currentTime = audio.currentTime   //当前的播放时长
                  this.setState({
                      currentTime:this.timeFormat(currentTime)
                  })

                //让小球移动  改变小球的left值   当前时长=小球的left值
                //当前时间 / 总时长 = 当前进度 / 进度条总长度
                
                const boxwidth = this.refs.progressBox.clientWidth  //进度条总宽度
                const scale = currentTime / audio.duration  //当前时间/总时长

                
                const width = boxwidth * scale  

                //设置小球的left值
                this.refs.circle.style.left = width - 3 + "px"
                //设置进度条的加载宽度
                this.refs.bar.style.width = width + "px"
                }
        })
    }

    //时间转换  秒-->  00:00
    timeFormat(second){
        //225.041 --> 00:00
        const min = Math.floor(parseInt(second) / 60)
        const sec = Math.floor(second % 60) >=10 ? Math.floor(second % 60) : "0" + Math.floor(second % 60)
        return min + ":" + sec
    }

    //获取歌词
    getLyric(){
        let songId = this.props.location.state.songId
        //请求对应歌曲的歌词接口
        this.$http.get(lyric,{
            params:{songid:songId}}).then(res=>{
                this.setState({
                    lyric:res.data.data.lyric
                })
                let lyric = this.state.lyric
                let lyricArr = lyric.split('[换行]').slice(5)
                let arr = [] 
                lyricArr.forEach((item,index)=>{
                    let lstr = item.split(']')[1]   //每一句歌词
                    let ltime = item.split(']')[0].slice(1,6)  //每句歌词的分钟和秒钟时间(省略毫秒)  00:00:00
                    function ltimeFormat(ltime){
                        let arr = ltime.split(":")
                        return  arr[0]*60 + parseInt(arr[1])
                    }

                    let obj = {
                        lstr,
                        ltime: ltimeFormat(ltime)   //每句歌词对应的秒数
                    }

                    arr.push(obj)   //存储歌词及当前秒数的数组
                })

                this.setState({
                    listArr:arr
                },()=>{
                    this.renderList()
                })
        })
    }

    //渲染歌词
    renderList(){
        const el = this.state.listArr.map((item, index) => {
            return <p key={index} className={["lyric-item", this.state.i === index ? "active" : ""].join(" ")}>{item.lstr}</p>
        })
        this.setState({
            el
        })
    }

    //定时器修改当前歌词的位置及样式
    interval(){
        var t = this.state.time // 单位为秒
        this.timer = setInterval(() => {
            this.state.listArr.forEach((item, index) => {
                if (t === item.ltime) {
                    this.setState({
                        i: index
                    },() => {
                        this.renderList()
                        const box = this.refs.box;
                        box.style.top = - index * 35 + 150 +  'px'
                    })
                }
            })
            t++;
            this.setState({
                time: t
            })
        }, 1000)
    }

    //播放或暂停
    play(){
        let audio = this.refs.audio
        if(audio.paused){
            audio.play()
            this.interval()
            this.setState({
                flag:false
            })
        }else{
            audio.pause()
            clearInterval(this.timer)
            this.timer = null
            this.setState({
                flag:true
            })
        }
    }

    //收藏
    like(){
        this.setState({
            like:!this.state.like
        })
    }

    //手动移动小球  移动,进度条加载宽度
    move(e){
        //暂停音乐播放
        this.refs.audio.pause()
        let left = e.touches[0].clientX - 50
        if(left <= 0){
            left = 0 
        }
        if(left >= this.refs.progressBox.clientWidth){
            left = this.refs.progressBox.clientWidth
        }
        
        this.refs.circle.style.left = left - 3 + "px"
        this.refs.bar.style.width = left + "px"

        this.setState({
            left  //保存拖动结束后进度条的left值
        })
    }

    //小球拖动结束 
    end(){
         //开始播放
         this.refs.audio.play()

         //用当前进度条宽度 / 总宽度 * 总时长 = 当前时长
         let scale = this.state.left / this.refs.progressBox.clientWidth
         let currentTime = this.refs.audio.duration * scale
         this.refs.audio.currentTime = currentTime  //设置滚动条拖动结束后的当前音乐播放时长
        this.setState({
            currentTime:this.timeFormat(currentTime)
        })
        console.log(this.state.listArr)
        //歌词到对应的位置  找到小球当前对应位置的时间 和 数组中第一个符合条件的时间进行比较 返回下标
        let i = this.state.listArr.findIndex(item=>{
            return item.ltime > currentTime
        })

        console.log(i)  //当前下标在数组中对应的歌词

        this.setState({
            i,
            time:this.state.listArr[i].ltime
        },()=>{
            this.renderList()
            const box = this.refs.box;
            box.style.top = - i * 35 + 150 + 'px'
            clearInterval(this.timer)
            this.timer = null;
            this.interval()  //每次拖动进度条都要清除定时器 并且重新开启一个新的定时器
        })

        //改变为暂停键
        this.setState({
            flag:false
        })

    }


    skip(e){
          //暂停音乐播放
          this.refs.audio.play()
          let left = e.touches[0].clientX - 50
          if(left <= 0){
              left = 0 
          }
          if(left >= this.refs.progressBox.clientWidth){
              left = this.refs.progressBox.clientWidth
          }
          
          this.refs.circle.style.left = left - 3 + "px"
          this.refs.bar.style.width = left + "px"
  
          this.setState({
              left  //保存拖动结束后进度条的left值
          })
    }

    cliend(){
        this.end()
    }

    render() {
        return (
            <div className="container play">
                <div className="lyric-box">
                    <div className="box" ref="box">
                        {this.state.el}
                    </div>
                </div>

                <div className="progress-box">
                    <span>{this.state.currentTime}</span>
                    <div className="progress" ref="progressBox" onTouchStart = {this.skip.bind(this)} onTouchEnd = {this.cliend.bind(this)}> 
                        <div className="current" ref="bar"></div>
                        <div className="circle" ref="circle" onTouchMove = {this.move.bind(this)}  onTouchEnd = {this.end.bind(this)} ></div>
                    </div>
                    <span>{this.state.duration}</span>
                </div>

                <div className="btns"> 
                    <audio src={this.state.playurl} ref="audio"/>
                    <span>MV</span>
                    <span onClick = {this.play.bind(this)}>
                     {
                         this.state.flag ? <Icon type="caret-right"  /> : <Icon type="pause" />
                     }
                    </span>
                    <span onClick = {this.like.bind(this)}>
                         {
                             this.state.like ? <Icon type="heart" />  : <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                         }
                    </span>
                </div>
                <p className="download">下载歌曲 </p>
            </div>
        )
    }
}
