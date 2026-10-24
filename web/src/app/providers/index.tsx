import { type ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import GoogleMapApi from './GoogleMapApi'
import { CookiesProvider } from 'react-cookie';

const Providers = ({ children }: { children: ReactNode }) => {

    return (
        <QueryProvider>
            <CookiesProvider defaultSetOptions={{ path: '/' }}>
                <GoogleMapApi>
                    <AuthProvider>
                        <SocketProvider>
                            {children}
                        </SocketProvider>
                    </AuthProvider>
                </GoogleMapApi>
            </CookiesProvider>
        </QueryProvider>
    )
}

export default Providers
