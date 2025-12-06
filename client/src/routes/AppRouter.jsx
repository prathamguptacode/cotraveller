import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
import Home from '../pages/Home/Home'
import ViewGroup from '../pages/Group/ViewGroup'
import AuthLayout from '../layouts/Auth/AuthLayout'
import Signup from '../pages/Auth/Signup'
import Login from '../pages/Auth/Login'
import VerifyOtp from '../pages/Auth/VerifyOtp'
import CreateGroup from '../pages/CreateGroup/CreateGroup'
import MainLayout from '../layouts/Main/MainLayout'
import SuccessPage from '../pages/success/SuccessPage'
import MoreInfo from '../pages/moreinfo/moreinfo'
import SecondaryLayout from '../layouts/Secondary/SecondaryLayout'
import Chats from '../pages/Group/Chats/Chats'


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>



                <Route path='/' element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path='viewgroup' element={<ViewGroup />} />
                </Route>

                <Route path='/moreinfo' element={<MoreInfo />} />
                
                <Route path='/groups/:groupId/' element={<SecondaryLayout />} >
                    <Route path='chats' element={<Chats />} />
                </Route>




                <Route element={<AntiProtectedRoutes />} >
                    <Route element={<AuthLayout />} >
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup/verify' element={<VerifyOtp />} />
                    </Route>
                </Route>




                <Route element={<ProtectedRoutes />}>
                    <Route path='/creategroup' element={<CreateGroup />} />
                    <Route path='/success' element={<SuccessPage />} />
                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
