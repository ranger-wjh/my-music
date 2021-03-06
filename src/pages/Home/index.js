import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import MapRoute from '../../routes/MapRoute'

export default class Home extends Component {
    render() {
        return (
            <div className='container'>
               <div className="header">
                   <NavLink to='/home/recommend'>推荐</NavLink>
                   <NavLink to='/home/rank'>排行</NavLink>
                   <NavLink to='/home/searchs'>搜索</NavLink>
               </div>
               <div className="main">
                    <MapRoute routes={this.props.routes}></MapRoute>
               </div>
            </div>
        )
    }
}
