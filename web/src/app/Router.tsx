import { BrowserRouter, Route, Routes } from "react-router-dom"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<>Hi, Mom</>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
