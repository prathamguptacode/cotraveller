import { BrowserRouter, Route, Routes } from "react-router-dom"
import DM from "./pages/DM"
import ProtectedRoutes from "./guards/Protected.Routes"
import Home from "./pages/Home"
import MainLayout from "@/layouts/MainLayout"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route path="/rooms/:roomId" element={<DM />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/dms" element={<Home />} />
                    <Route path="/trips" element={<Home />} />
                    <Route path="/trips/create" element={<Home />} />
                    <Route path="/search" element={<Home />} />
                    <Route path="/me" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
