import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import MapRoute from './routes/MapRoute'
import routes from './routes/routes.config'
import 'antd/dist/antd.css';
import './index.less'

import axios from 'axios'
Component.prototype.$http = axios
ReactDOM.render((
    <Router>
        <MapRoute routes={routes}></MapRoute>
    </Router>
), document.getElementById('root'));


