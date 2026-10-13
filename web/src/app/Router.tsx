import Calendar from "@/features/calendar"
import { BrowserRouter, Route, Routes } from "react-router-dom"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<>Hi, Mom</>} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
