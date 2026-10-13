const WEEK_DAYS = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
} as const


export const getIncrementedDate = (previousDate: Date, { year = 0, month = 0, date = 0 }) => {
    const incrementedDate = new Date(
        previousDate.getFullYear() + year,
        previousDate.getMonth() + month,
        previousDate.getDate() + date
    )

    return incrementedDate
}

const getLastDateOfMonth = (currentDate: Date) => {
    const lastDate = getIncrementedDate(currentDate, { month: 1, date: -currentDate.getDate() })
    
    return lastDate
}


export const getCalendarMonthDates = (currentDate: Date) => {
    const dates = []

    // Check if last day of previous month was a saturday
    const lastDateOfPrevMonth = getLastDateOfMonth(getIncrementedDate(currentDate, { month: -1 }))
    const lastDayOfPrevMonth = lastDateOfPrevMonth.getDay()
    if (lastDayOfPrevMonth !== WEEK_DAYS.SATURDAY) {
        // Add prevMonth dates from sunday (included) till lastDayOfPrevMonth
        for (let i = lastDayOfPrevMonth; i >= 0; i--) {
            const date = getIncrementedDate(lastDateOfPrevMonth, { date: -i })
            dates.push(date)
        }
    }

    // Now we can add currentMonthDates
    const lastDateOfCurrentMonth = getLastDateOfMonth(currentDate)
    for (let i = 1; i <= lastDateOfCurrentMonth.getDate(); i++) {
        const date = getIncrementedDate(lastDateOfPrevMonth, { date: i })
        dates.push(date)
    }


    // Now we fill up remaining dayCells with nextMonthDates
    const totalWeeks = Math.ceil(dates.length / 7)
    const remainingDays = (totalWeeks * 7) - dates.length

    for (let i = 1; i <= remainingDays; i++) {
        const date = getIncrementedDate(lastDateOfCurrentMonth, { date: i })
        dates.push(date)
    }

    return dates
}