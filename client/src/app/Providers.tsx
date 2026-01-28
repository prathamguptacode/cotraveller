import AuthProvider from './providers/AuthProvider'
import SocketProvider from './providers/SocketProvider'
import ThemeProvider from './providers/ThemeProvider'
import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient} >
                <AuthProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default Providers
