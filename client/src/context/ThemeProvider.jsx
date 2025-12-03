import React, { useCallback, useState } from 'react'
import { ThemeContext } from '../hooks/useTheme'

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark')
    const toggleTheme = useCallback(
        () => {
            setTheme(prev => {
                //LocalStorage is only for persistence over refreshes
                localStorage.setItem('theme', prev === 'light' ? 'dark' : 'light')

                //Setting class is the real game changer for actual base css
                document.documentElement.classList.toggle('dark')
                console.log(prev)
                return prev === 'light' ? 'dark' : 'light'

            })
        },
        [],
    )


    const value = { theme, toggleTheme }
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
