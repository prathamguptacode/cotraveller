import AuthProvider from '@/providers/AuthProvider'
import SocketProvider from '@/providers/SocketProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { type ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default Providers
