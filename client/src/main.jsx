import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import SocketProvider from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <AuthProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </AuthProvider>
    </ThemeProvider>

)
