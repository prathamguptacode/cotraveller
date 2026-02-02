import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './routes/Protected.Routes'
import AntiProtectedRoutes from './routes/AntiProtected.Routes'
import Home from './pages/Home/Home'
import ViewGroup from './pages/Group/ViewGroup'
import AuthLayout from './layouts/Auth/AuthLayout'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyOTP from './pages/VerifyOTP'
import CreateGroup from './pages/CreateGroup/CreateGroup'
import MainLayout from './layouts/Main/MainLayout'
import SuccessPage from './pages/success/SuccessPage'
import MoreInfo from './pages/moreinfo/MoreInfo'
import SecondaryLayout from './layouts/Secondary/SecondaryLayout'
import Chats from './pages/Chats'
import NotFound from './pages/NotFound/NotFound'
import FeedbackPage from './pages/Feedback/FeedbackPage'
import EditGroup from './pages/EditGroup/EditGroup'






const Router = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path='viewgroup' element={<ViewGroup />} />
                </Route>

                <Route path='/groups/:groupId/' element={<SecondaryLayout />} >
                    <Route path='chats' element={<Chats />} />
                </Route>
                {/* 

                <Route path='/moreinfo' element={<MoreInfo />} />






              



                <Route element={<ProtectedRoutes />}>
                    <Route path='/creategroup' element={<CreateGroup />} />
                    <Route path='/success' element={<SuccessPage />} />
                    <Route path='/edit' element={<EditGroup />} />
                </Route> */}
                <Route element={<AntiProtectedRoutes />} >
                    <Route element={<AuthLayout />} >
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup/verify' element={<VerifyOTP />} />
                    </Route>
                </Route>
                <Route path='/feedback' element={<FeedbackPage />} />
                <Route path='*' element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    )
}

export default Router
