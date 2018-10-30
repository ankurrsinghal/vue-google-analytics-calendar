export const getRelativeLastYearDate = date => new Date(date.getFullYear() - 1, date.getMonth(), date.getDate())

export const decrementMonth = date => {
    const fullYear = date.getFullYear()
    const month = date.getMonth()

    if (month === 0) {
        return new Date(fullYear - 1, 11, 1)
    }

    return new Date(fullYear, month - 1, 1)
}

export const incrementMonth = date => {
    const fullYear = date.getFullYear()
    const month = date.getMonth()

    if (month === 11) {
        return new Date(fullYear + 1, 0, 1)
    }

    return new Date(fullYear, month + 1, 1)
}

export const firstDayOfTheMonth = date => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
}

const DAYS_MONTH_MAP = {
    0: 31,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
}

export const howManyDaysInThisMonthsDate = date => {
    const month = date.getMonth()
    const year = date.getYear()

    if (month === 1) {
        return year % 4 === 0 ? 29 : 28
    } else {
        return DAYS_MONTH_MAP[month]
    }
}

export const endDateOfThisMonthsDate = date => {
    const month = date.getMonth()
    const year = date.getFullYear()
    const daysInThisMonthsDate = howManyDaysInThisMonthsDate(date)
    return new Date(year, month, daysInThisMonthsDate)
}

export const getOnlyDayDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    
    return new Date(year, month, day)
}