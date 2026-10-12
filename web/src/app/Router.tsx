import { BrowserRouter, Route, Routes } from "react-router-dom"
import DM from "./pages/DM"
import ProtectedRoutes from "./guards/Protected.Routes"
import Home from "./pages/Home"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/users/:userId" element={<DM />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
