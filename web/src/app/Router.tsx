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
                    {/* Replace Home element with Trip Layout Below with outlet inside to render blank or index page */}
                    <Route path="/trips" element={<Home />}>
                        <Route path=":tripId">
                            <Route index />
                            <Route path="chats" />
                        </Route>
                        <Route path="create" element={<Home />} />
                    </Route>
                    <Route path="/search" element={<Home />} />
                    <Route path="/direct/:roomId" element={<Home />} />
                    <Route path="/me" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
