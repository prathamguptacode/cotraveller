import { type ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'
import GoogleMapApi from './GoogleMapApi'
import { CookiesProvider } from 'react-cookie';
import { LoadingBarContainer } from "react-top-loading-bar";
import { Toaster } from "sonner"

const Providers = ({ children }: { children: ReactNode }) => {

    return (
        <QueryProvider>
            <CookiesProvider defaultSetOptions={{ path: '/' }}>
                <GoogleMapApi>
                    <AuthProvider>
                        <SocketProvider>
                            <LoadingBarContainer props={{ color: `#2f6dd0`, height: 2, }}>
                                {children}
                                <Toaster toastOptions={{ style: { background: "#0A0B0F", color: "#f5f5f5DD" } }} />
                            </LoadingBarContainer>
                        </SocketProvider>
                    </AuthProvider>
                </GoogleMapApi>
            </CookiesProvider>
        </QueryProvider>
    )
}

export default Providers
