import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
import Home from '../pages/Home/Home'
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>


                <Route element={<AntiProtectedRoutes />} >
                    <Route path='/' element={<Home />} />
                </Route>




                <Route element={<ProtectedRoutes />}>

                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
