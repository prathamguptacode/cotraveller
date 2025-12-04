import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
import Home from '../pages/Home/Home'
import Auth from '../pages/Auth/Auth'
import GroupProfile from '../pages/GroupProfile/GroupProfile'
import ViewGroup from '../pages/Group/ViewGroup'
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>



                <Route path='/' element={<Home />} />
                <Route path='/viewgroup' element={<ViewGroup />} />


                <Route element={<AntiProtectedRoutes />} >
                    <Route path='/auth' element={<Auth />} />
                </Route>




                <Route element={<ProtectedRoutes />}>
                    <Route path='/group' element={<GroupProfile />} />
                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
