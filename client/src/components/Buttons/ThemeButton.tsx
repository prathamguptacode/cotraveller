import styles from './buttons.module.css'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
const ThemeButton = () => {
    const { theme, toggleTheme } = useTheme()
    return (
        <button style={{display: 'none'}} aria-label={"Switch mode to " + (theme === 'dark' ? 'light' : 'dark')} onClick={toggleTheme} className={styles.themeButton}>
            {theme === 'dark' ?
                <Moon size={20} />
                :
                <Sun size={20} />
            }
        </button>

    )
}

export default ThemeButton
