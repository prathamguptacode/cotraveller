import MonthCalendarGrid from './components/MonthCalendarGrid'
import styles from './styles.module.css'


const Calendar = () => {


    return (
        <div className={styles.wrapper}>
            <span>Calendar</span>
            <MonthCalendarGrid />
        </div>
    )
}

export default Calendar
