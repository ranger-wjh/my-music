import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router-dom'

export default class MapRoute extends Component {
    render() {
        return (
            <Switch>
                {
                    this.props.routes.map(item=>{
                        return item.path ? (
                            <Route 
                                key={item.path}
                                path={item.path}
                                render={(props)=>{
                                    return  item.auth ? (
                                        localStorage.getItem('id') ? (
                                            <item.component   {...props} routes={item.children}  />
                                        ) : (
                                            <Redirect to="/login" />
                                        )
                                    ) : (
                                        <item.component   {...props} routes={item.children}  />
                                    )
                                    
                                }}
                            ></Route>
                        ):(
                            <Redirect key={item.from} to={item.to}></Redirect>
                        )
                    })
                }
            </Switch>
        )
    }
}
