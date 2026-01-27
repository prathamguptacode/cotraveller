import { createRoot } from 'react-dom/client'
import App from './App'
import AuthProvider from './context/AuthProvider'
import ThemeProvider from './context/ThemeProvider'
import SocketProvider from './context/SocketProvider'

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <AuthProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </AuthProvider>
    </ThemeProvider>

)
