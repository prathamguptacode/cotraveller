import { useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from '@/hooks/useTheme'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark') {
            document.documentElement.classList.add(savedTheme)
            return savedTheme
        }

        else if (savedTheme === 'light') return savedTheme
        const newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        localStorage.setItem('theme', newTheme)
        if (newTheme === 'dark') {
            document.documentElement.classList.add(newTheme)
            return newTheme
        }
        return newTheme
    })

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
        document.documentElement.classList.toggle('dark')
    }



    const value = { theme, toggleTheme }
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
