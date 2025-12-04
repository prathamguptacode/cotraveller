import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
import Home from '../pages/Home/Home'
import GroupProfile from '../pages/GroupProfile/GroupProfile'
import AuthLayout from '../layouts/Auth/AuthLayout'
import Signup from '../pages/Auth/Signup'
import Login from '../pages/Auth/Login'
import VerifyOtp from '../pages/Auth/VerifyOtp'
import Groups from '../components/homepage/Sidebar/Groups'
import Inbox from '../components/homepage/Sidebar/Inbox'


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>



                <Route path='/' element={<Home />} >
                    <Route path='groups' element={<Groups />} />
                    <Route path='inbox' element={<Inbox />} />
                </Route>


                <Route element={<AntiProtectedRoutes />} >
                    <Route element={<AuthLayout />} >
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup/verify' element={<VerifyOtp />} />
                    </Route>
                </Route>




                <Route element={<ProtectedRoutes />}>
                    <Route path='/group' element={<GroupProfile />} />
                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
