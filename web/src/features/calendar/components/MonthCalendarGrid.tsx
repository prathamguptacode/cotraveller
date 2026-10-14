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
                            <div aria-hidden className={styles.rowOverlayCells}>
                                {dates.slice(startDateIndex, startDateIndex + 7).map(date => {
                                    return (
                                        <div key={date.getDate()} className={styles.rowOverlayCell}>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.dates}>
                                {dates.slice(startDateIndex, startDateIndex + 7).map(date => {
                                    const numericDate = date.getDate()
                                    const isMonthStart = numericDate === 1

                                    return (
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
                                    )
                                })}
                            </div>
                            <section className={styles.eventsSection}>
                                {dates.slice(startDateIndex, startDateIndex + 7).map(date => {
                                    return (
                                        <div className={styles.eventsCell} key={date.getDate()}>
                                            <Event isAllDay />
                                            <Event isAllDay />
                                            <Event />
                                        </div>
                                    )
                                })}
                            </section>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default MonthCalendarGrid




type EventProps = {
    isAllDay?: boolean
}


const Event = ({ isAllDay }: EventProps) => {

    return (
        <div className={styles.eventTile}>
            <button className={clsx(styles.event, isAllDay && styles.allDayEvent)}>
                {!isAllDay &&
                    <>
                        <div className={styles.eventColorCircle}></div>
                        <span>5:30 pm</span>
                    </>
                }
                <span className={styles.eventName}>Birthday Celebration</span>
            </button>
        </div>
    )
}