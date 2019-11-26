import Home from '../pages/Home'
import Play from '../pages/Play'
import TopList from '../pages/TopList'
import Recommend from '../pages/Home/Recommend'
import Rank from '../pages/Home/Rank'
import Searchs from '../pages/Home/Searchs'
import Login from '../pages/Login'
const routes = [
    {
        path:'/TopList',
        component:TopList
    },
    {
        path:'/Play',
        component:Play
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/',
        component:Home,
        children:[
            {
                path:'/home/recommend',
                component:Recommend
            },
            {
                path:'/home/rank',
                component:Rank
            },
            {
                path:'/home/searchs',
                component:Searchs,
                auth:true
            },
            {
                from:'/',
                to:'/home/recommend'
            }
        ]
    },
    {
        from:'/',
        to:'/'
    }
]

export default routes