import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./guards/Protected.Routes"
import Home from "./pages/Home"
import MainLayout from "@/layouts/MainLayout"
import DirectMessagesLayout from "./pages/DirectMessages/DirectMessagesLayout"
import DirectMessagesPage from "./pages/DirectMessages/DirectMessagesPage"
import DirectMessagePage from "./pages/DirectMessages/DirectMessagePage"
import SearchLayout from "./pages/Search/SearchLayout"
import TripsLayout from "./pages/Trips/TripsLayout"
import TripsMainContent from "./pages/Trips/TripsMainContent"
import SearchIndexPage from "./pages/Search/SearchIndexPage"
import SearchResultsPage from "./pages/Search/SearchResultsPage"
import TripChatPage from "./pages/Trips/TripChatPage"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />

                    {/* Replace Home element with Trip Layout Below with outlet inside to render blank or index page */}
                    <Route path="/trips" element={<TripsLayout />}>
                        <Route index element={<>cotraveller</>} />
                        <Route path=":tripId">
                            <Route index element={<TripsMainContent />} />
                            <Route path="chats" element={<TripChatPage />} />
                        </Route>
                        <Route path="create" element={<Home />} />
                    </Route>

                    <Route path="/search" element={<SearchLayout />} >
                        <Route index element={<SearchIndexPage />} />
                        <Route path=":city/:placeId" element={<SearchResultsPage />} />
                    </Route>



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
