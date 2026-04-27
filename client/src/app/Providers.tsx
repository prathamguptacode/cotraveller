import AuthProvider from '@/providers/AuthProvider'
import SocketProvider from '@/providers/SocketProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EventSourceProvider from '@/providers/EventSourceProvider'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

const queryClient = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary:{
                main: '#8bb5f8',
                dark: '#8bb5f8'
                // main: '#8bb5f8'
            }
        },
    });


    return (
        <ThemeProvider>
            <MuiThemeProvider theme={darkTheme}>
                <QueryClientProvider client={queryClient} >
                    <AuthProvider>
                        <EventSourceProvider>
                            <SocketProvider>
                                {children}
                            </SocketProvider>
                        </EventSourceProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </MuiThemeProvider>
        </ThemeProvider>
    )
}

export default Providers
