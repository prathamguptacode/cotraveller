import { BrowserRouter, Route, Routes } from "react-router-dom"
import TestMapPage from "./pages/TestMapPage"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<>Hi, Mom</>} />
                <Route path="/test" element={<TestMapPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
