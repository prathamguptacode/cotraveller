import clsx from 'clsx'
import { getCalendarMonth, getIncrementedDate, getWeekSaturdayDate, WEEK_DAYS } from '../utils'
import styles from './monthCalendar.module.css'
import { Link } from 'react-router-dom'

const WEEK_DAYS_NAMES = Object.keys(WEEK_DAYS)

type Event = {
  startTime: Date,
  endTime: Date,
  name: string,
}

const events: Event[] = [
  {
    startTime: new Date(),
    endTime: getIncrementedDate(new Date(), { date: 5, hour: -2 }),
    name: "Train to Lucknow",
  },
  {
    startTime: new Date(),
    endTime: getIncrementedDate(new Date(), { date: 17 }),
    name: "Navratri",
  },
  {
    startTime: new Date(),
    endTime: getIncrementedDate(new Date(), { hour: 1 }),
    name: "MAI-101",
  }
]


const MonthCalendarGrid = () => {
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
                      {events.map(event => {
                        const startDateString = event.startTime.toLocaleDateString()
                        const endDateString = event.endTime.toLocaleDateString()
                        const cellDateString = date.toLocaleDateString()

                        const occursToday = new Date(startDateString).getTime() <= new Date(cellDateString).getTime() && new Date(cellDateString).getTime() <= new Date(endDateString).getTime()
                        const isMultiDay = startDateString !== endDateString

                        if (!occursToday) return

                        if (!isMultiDay) {
                          return (
                            <Event name={event.name} endTime={event.endTime} startTime={event.startTime} />
                          )
                        }

                        if (isMultiDay && startDateString === cellDateString) {
                          const weekDay = date.getDay()
                          const left = `${(weekDay / 7) * 100}%`

                          let width = 100 / 7
                          const weekSaturdayDateString = getWeekSaturdayDate(date).toLocaleDateString()
                          if (new Date(weekSaturdayDateString).getTime() >= new Date(endDateString).getTime()) {
                            width *= (event.endTime.getDay() - event.startTime.getDay() + 1)
                          }
                          else width *= (WEEK_DAYS.SATURDAY - event.startTime.getDay() + 1)

                          return (
                            <>
                              <Event style={{ left, width: `${width}%` }} name={event.name} endTime={event.endTime} startTime={event.startTime} isMultiDay={isMultiDay} />
                              <Event style={{ visibility: 'hidden' }} name={event.name} endTime={event.endTime} startTime={event.startTime} />
                            </>

                          )
                        }
                        if (isMultiDay && WEEK_DAYS.SUNDAY === date.getDay()) {
                          let width = 100 / 7
                          const weekSaturdayDateString = getWeekSaturdayDate(date).toLocaleDateString()
                          if (new Date(weekSaturdayDateString).getTime() >= new Date(endDateString).getTime()) {
                            width *= (event.endTime.getDay() - WEEK_DAYS.SUNDAY + 1)
                          }
                          else width *= (WEEK_DAYS.SATURDAY - WEEK_DAYS.SUNDAY + 1)

                          return (
                            <>
                              <Event style={{ left: 0, width: `${width}%` }} name={event.name} endTime={event.endTime} startTime={event.startTime} isMultiDay={isMultiDay} />
                              <Event style={{ visibility: 'hidden' }} name={event.name} endTime={event.endTime} startTime={event.startTime} />
                            </>
                          )
                        }
                        if (isMultiDay) {
                          return (
                            <Event style={{ visibility: 'hidden' }} name={event.name} endTime={event.endTime} startTime={event.startTime} />
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




type EventProps = Event & {
  isMultiDay?: boolean,
  style?: React.CSSProperties
}


const Event = ({ isMultiDay, style, startTime, name }: EventProps) => {

  return (
    <div style={style} className={styles.eventTile}>
      <button className={clsx(styles.event, isMultiDay && styles.multiDayEvent)}>
        {!isMultiDay &&
          <>
            <div className={styles.eventColorCircle}></div>
            <time dateTime={startTime.toISOString()}>{startTime.toLocaleString('default', { hour12: true, hour: 'numeric', minute: 'numeric' }).toLowerCase()}</time>
          </>
        }
        <span className={styles.eventName}>{name}</span>
      </button>
    </div>
  )
}