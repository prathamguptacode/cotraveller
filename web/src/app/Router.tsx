import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./guards/Protected.Routes"
import Home from "./pages/Home"
import MainLayout from "@/layouts/MainLayout"
import DirectMessagesLayout from "./pages/DirectMessages/DirectMessagesLayout"
import DirectMessagesPage from "./pages/DirectMessages/DirectMessagesPage"
import DirectMessagePage from "./pages/DirectMessages/DirectMessagePage"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
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

                    <Route element={<ProtectedRoutes />}>
                        <Route path="/direct" element={<DirectMessagesLayout />} >
                            <Route index element={<DirectMessagesPage />} />
                            <Route path=":userId" element={<DirectMessagePage />} />
                        </Route>
                    </Route>

                    <Route path="/me" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
