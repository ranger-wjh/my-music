import React, { Component } from 'react'
import {Icon} from 'antd'
import {withRouter} from 'react-router-dom'

class Masks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songList:[]
        }
    }
    
    componentDidMount(){
        this.setState({
            songList:this.props.songList
        })
    }


    render() {
        return (
            <div>
                <div className="masks">
                    <ul>
                      {
                            this.state.songList.map((item,index)=>{
                             return <li key={index}><Icon type="search"/>{item.name} -- {item.singer}</li>
                            })                          
                      }
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Masks)
