import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './routes/Protected.Routes'
import AntiProtectedRoutes from './routes/AntiProtected.Routes'
import Home from '@/app/pages/Home/Home'
import ViewGroup from '@/app/pages/Group/ViewGroup'
import AuthLayout from '@/app/layouts/Auth/AuthLayout'
import Signup from '@/app/pages/auth/Signup'
import Login from '@/app/pages/auth/Login'
import VerifyOtp from '@/app/pages/auth/VerifyOtp'
import CreateGroup from '@/app/pages/CreateGroup/CreateGroup'
import MainLayout from '@/app/layouts/Main/MainLayout'
import SuccessPage from '@/app/pages/success/SuccessPage'
import MoreInfo from '@/app/pages/moreinfo/MoreInfo'
import SecondaryLayout from '@/app/layouts/Secondary/SecondaryLayout'
import Chats from '@/app/pages/Group/Chats/Chats'
import NotFound from '@/app/pages/NotFound/NotFound'
import FeedbackPage from '@/app/pages/Feedback/FeedbackPage'
import EditGroup from '@/app/pages/EditGroup/EditGroup'






const Router = () => {
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

                //feedback form
                <Route path='/feedback' element={<FeedbackPage />} />

                //error route
                <Route path='*' element={<NotFound />} />



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
                    <Route path='/edit' element={<EditGroup />} />
                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default Router
