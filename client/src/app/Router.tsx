import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoutes from './routes/Protected.Routes'
import AntiProtectedRoutes from './routes/AntiProtected.Routes'
import AuthLayout from './layouts/Auth/AuthLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import NotFound from './pages/Extras/NotFound'
import LoadingPage from './pages/Extras/LoadingPage'
import Login from './pages/Login'


const Home = lazy(() => import("./pages/Home"))
const ViewGroup = lazy(() => import("./pages/Group/ViewGroup"))
const Signup = lazy(() => import("./pages/Signup"))
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"))
const CreateGroup = lazy(() => import("./pages/CreateGroup"))
const SuccessPage = lazy(() => import("./pages/Extras/SuccessPage"))
const Chats = lazy(() => import("./pages/Chats"))
const FeedbackPage = lazy(() => import("./pages/Feedback/FeedbackPage"))
const EditGroup = lazy(() => import("./pages/EditGroup"))
const GroupInfo = lazy(() => import("./pages/GroupInfo"))
const Explore = lazy(() => import("./pages/Explore/Explore"))








const Router = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<MainLayout />}>
                    <Route index element={<Suspense fallback={<LoadingPage />}><Home /></Suspense>} />
                    <Route path='viewgroup' element={<Suspense fallback={<LoadingPage />}><ViewGroup /></Suspense>} />
                    <Route path='explore' element={<Suspense fallback={<LoadingPage />}><Explore /></Suspense>} />

                    <Route path='/groups'>
                        <Route path=':groupId'>
                            <Route index element={<Suspense fallback={<LoadingPage />}><GroupInfo /></Suspense>} />

                            <Route element={<ProtectedRoutes />}>
                                <Route path='edit' element={<Suspense fallback={<LoadingPage />}><EditGroup /></Suspense>} />
                                <Route path='chats' element={<Suspense fallback={<LoadingPage />}><Chats /></Suspense>} />
                            </Route>
                        </Route>

                        <Route element={<ProtectedRoutes />}>
                            <Route path='create' element={<Suspense fallback={<LoadingPage />}><CreateGroup /></Suspense>} />
                            <Route path='success' element={<Suspense fallback={<LoadingPage />}><SuccessPage /></Suspense>} />
                        </Route>
                    </Route>
                </Route>





                <Route element={<AntiProtectedRoutes />} >
                    <Route element={<AuthLayout />} >
                        <Route path='/signup' element={<Suspense fallback={<LoadingPage />}><Signup /></Suspense>} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup/verify' element={<Suspense fallback={<LoadingPage />}><VerifyOTP /></Suspense>} />
                    </Route>
                </Route>

                <Route path='/feedback' element={<Suspense fallback={<LoadingPage />}><FeedbackPage /></Suspense>} />
                <Route path='*' element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    )
}

export default Router
