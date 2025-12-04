import React, { useCallback, useEffect, useState } from 'react'
import { ThemeContext } from '../hooks/useTheme'

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null)
    const toggleTheme = () => {
        setTheme(prev => {
            console.log(theme)
            //LocalStorage is only for persistence over refreshes
            console.log(prev)
            localStorage.setItem('theme', prev === 'light' ? 'dark' : 'light')
            // console.log(prev==='light'?'dark': 'light')

            //Setting class is the real game changer for actual base css
            document.documentElement.classList.toggle('dark')
            return prev === 'light' ? 'dark' : 'light'

        })
    }

    useEffect(() => {
        //If theme is already user selected, then don't check/toggle
        const initialTheme = localStorage.getItem('theme')

        if (initialTheme === 'dark') {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
            setTheme('dark')
            return
        }
        else if (initialTheme === 'light') {
            localStorage.setItem('theme', 'light')
            setTheme('light')
            return
        }


        //Setting default theme for first time user
        if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
            setTheme('dark')
        }
        //toggling since initial value is dark
        else {
            localStorage.setItem('theme', 'light')
            setTheme('light')
        }
    }, [])



    const value = { theme, toggleTheme }
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
