import React from 'react'
import styles from './buttons.module.css'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
const ThemeButton = () => {
    const { theme, toggleTheme } = useTheme()
    return (
        <button onClick={toggleTheme} className={styles.themeButton}>
            {theme === 'dark' ?
                <Moon strokeWidth={1.4}  />
                :
                <Sun strokeWidth={1.4} size={28} />
            }
        </button>
    )
}

export default ThemeButton
