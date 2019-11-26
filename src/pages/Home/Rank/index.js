import React, { Component } from 'react'
import {Icon} from 'antd'
import {top} from '../../../Common/API'

export default class Rank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        this.$http.get(top).then(res => {
            this.setState({
                list: res.data.data
            })
        })
    }

    skip(id){
        this.props.history.push({pathname:'/Toplist',state:{id:id}})
    }
    
    render() {
        const list = this.state.list.map((item, index) => {
            return (
                <li key={index} onClick = {this.skip.bind(this,item.id)}>
                    <img src={item.picUrl} alt="" />
                    <div className='list-item'>
                        <div className='song-title'>
                            <p>{item.title}</p>
                            <div>
                                {

                                    item.songList.map((song, i) => {
                                        return (
                                            <p key={i} className="song-p">
                                                <span>{song.number}</span>
                                                <span className="title">{song.songName}</span>
                                                <span>-</span>
                                                <span>{song.singerName}</span>
                                            </p>
                                        )
                                    })

                                }
                            </div>
                        </div>
                        <div className='icon-div'>
                            <Icon type="right" />
                        </div>
                    </div>
                </li>
            )

        })
        return (
            <div className='rank'>
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}