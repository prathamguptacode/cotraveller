import { type ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import GoogleMapApi from './GoogleMapApi'

const Providers = ({ children }: { children: ReactNode }) => {

    return (
        <QueryProvider>
            <GoogleMapApi>
                <AuthProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </AuthProvider>
            </GoogleMapApi>
        </QueryProvider>
    )
}

export default Providers
