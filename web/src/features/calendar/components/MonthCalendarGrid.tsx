import clsx from 'clsx'
import { getCalendarMonth, getIncrementedDate, getWeekSaturdayDate, WEEK_DAYS } from '../utils'
import styles from './monthCalendar.module.css'

const WEEK_DAYS_NAMES = Object.keys(WEEK_DAYS)

type Event = {
  startTime: string,
  name: string
}

type MonthCalendarGridProps = {
  events: Event[]
}


const MonthCalendarGrid = ({ events }: MonthCalendarGridProps) => {
  const { dates, weeks, month } = getCalendarMonth(getIncrementedDate(new Date(), { month: 0 }))


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
              <div className={styles.rowOverlayCells}>
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
                      <span className={
                        clsx(
                          styles.date,
                          month === date.getMonth() && styles.currentMonthDate,
                          isMonthStart && styles.monthStartDate
                        )}>
                        {numericDate} {isMonthStart && date.toLocaleDateString('default', { month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
              <section className={styles.eventsSection}>
                {dates.slice(startDateIndex, startDateIndex + 7).map(date => {
                  return (
                    <div className={styles.eventsCell} key={date.getDate()}>
                      {events.map(event => {
                        const startTime = new Date(event.startTime)
                        const endTime = startTime
                        const startDateString = startTime.toLocaleDateString()
                        const endDateString = endTime.toLocaleDateString()
                        const cellDateString = date.toLocaleDateString()

                        const occursToday = new Date(startDateString).getTime() <= new Date(cellDateString).getTime() && new Date(cellDateString).getTime() <= new Date(endDateString).getTime()
                        const isMultiDay = startDateString !== endDateString

                        if (!occursToday) return

                        if (!isMultiDay) {
                          return (
                            <Event name={event.name} />
                          )
                        }

                        if (isMultiDay && startDateString === cellDateString) {
                          const weekDay = date.getDay()
                          const left = `${(weekDay / 7) * 100}%`

                          let width = 100 / 7
                          const weekSaturdayDateString = getWeekSaturdayDate(date).toLocaleDateString()
                          if (new Date(weekSaturdayDateString).getTime() >= new Date(endDateString).getTime()) {
                            width *= (endTime.getDay() - startTime.getDay() + 1)
                          }
                          else width *= (WEEK_DAYS.SATURDAY - startTime.getDay() + 1)

                          return (
                            <>
                              <Event style={{ left, width: `${width}%` }} name={event.name} isMultiDay={isMultiDay} />
                              <Event style={{ visibility: 'hidden' }} name={event.name} />
                            </>

                          )
                        }
                        if (isMultiDay && WEEK_DAYS.SUNDAY === date.getDay()) {
                          let width = 100 / 7
                          const weekSaturdayDateString = getWeekSaturdayDate(date).toLocaleDateString()
                          if (new Date(weekSaturdayDateString).getTime() >= new Date(endDateString).getTime()) {
                            width *= (endTime.getDay() - WEEK_DAYS.SUNDAY + 1)
                          }
                          else width *= (WEEK_DAYS.SATURDAY - WEEK_DAYS.SUNDAY + 1)

                          return (
                            <>
                              <Event style={{ left: 0, width: `${width}%` }} name={event.name} isMultiDay={isMultiDay} />
                              <Event style={{ visibility: 'hidden' }} name={event.name} />
                            </>
                          )
                        }
                        if (isMultiDay) {
                          return (
                            <Event style={{ visibility: 'hidden' }} name={event.name} />
                          )
                        }


                      })}
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
  isMultiDay?: boolean,
  style?: React.CSSProperties,
  name: string
}


const Event = ({ isMultiDay, style, name }: EventProps) => {

  return (
    <div data-multi-day-event={isMultiDay} style={style} className={styles.eventTile}>
      <button className={styles.event}>
        {/* <time dateTime={startTime.toISOString()}>{startTime.toLocaleString('default', { hour12: true, hour: 'numeric', minute: 'numeric' }).toLowerCase()}</time> */}
        <span className={styles.eventName}>{name}</span>
      </button>
    </div>
  )
}