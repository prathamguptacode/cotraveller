import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'
import AntiProtectedRoutes from './AntiProtectedRoutes'
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>


                <Route element={<AntiProtectedRoutes />} >

                </Route>




                <Route element={<ProtectedRoutes />}>

                </Route>


            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
