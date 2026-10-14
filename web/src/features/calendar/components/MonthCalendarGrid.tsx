import clsx from 'clsx'
import { getCalendarMonth, WEEK_DAYS } from '../utils'
import styles from './monthCalendar.module.css'
import { Link } from 'react-router-dom'

const WEEK_DAYS_NAMES = Object.keys(WEEK_DAYS)

const MonthCalendarGrid = () => {
    const { dates, weeks, month } = getCalendarMonth(new Date())

    return (
        <div className={styles.wrapper}>
            <div className={styles.days}>
                {WEEK_DAYS_NAMES.map(day => {
                    return (
                        <div key={day} className={styles.day}>
                            {day.slice(0, 3)}
                        </div>
                    )
                })}
            </div>
            <div className={styles.datesGrid}>
                {weeks.map((week) => {
                    const startDateIndex = (week - 1) * 7
                    return (
                        <div key={week} className={styles.datesRow}>
                            {dates.slice(startDateIndex, startDateIndex + 7).map(date => {
                                return (
                                    <DateCell key={date.getDate()} month={month} date={date} />
                                )
                            })}

                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default MonthCalendarGrid


type DateCellProps = {
    date: Date,
    month: number
}

const DateCell = ({ date, month }: DateCellProps) => {
    const numericDate = date.getDate()
    const isMonthStart = numericDate === 1
    return (
        <div className={styles.dateCell}>
            <div className={styles.dateWrapper}>
                <Link to={'/'} className={
                    clsx(
                        styles.date,
                        month === date.getMonth() && styles.currentMonthDate,
                        isMonthStart && styles.monthStartDate
                    )}>
                    {numericDate} {isMonthStart && date.toLocaleDateString('default', { month: 'short' })}
                </Link>
            </div>

        </div>
    )
}
