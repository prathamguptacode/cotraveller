import { type ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'

const Providers = ({ children }: { children: ReactNode }) => {

    return (
        <QueryProvider>
            <AuthProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </AuthProvider>
        </QueryProvider>
    )
}

export default Providers
