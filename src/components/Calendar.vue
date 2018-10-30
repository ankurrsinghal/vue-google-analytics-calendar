<template>
    <div>
        <div class="calendar-boxes-wrapper">
            <div class="calendar-action previous">
                <button @click="decrementMonth">Previous</button>
            </div>
            <CalendarBox
                :date="getLastMonth(date)"
                :activeSelectedDayStart= activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :comparitiveStartDate = comparitiveStartDate
                :comparitiveEndDate = comparitiveEndDate
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick = onDayClick
                @onDayMouseOver = onDayMouseOver />
            <CalendarBox
                :date="date"
                :activeSelectedDayStart = activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :comparitiveStartDate = comparitiveStartDate
                :comparitiveEndDate = comparitiveEndDate
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick="onDayClick"
                @onDayMouseOver="onDayMouseOver" />
            <CalendarBox
                :date="getNextMonth(date)"
                :activeSelectedDayStart = activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :comparitiveStartDate = comparitiveStartDate
                :comparitiveEndDate = comparitiveEndDate
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick="onDayClick"
                @onDayMouseOver="onDayMouseOver" />
            <div class="calendar-action next">
                <button @click="incrementMonth">Next</button>
            </div>
            <div class="macros">
                
            </div>
        </div>
        <div class="values">
            <div>
                <p>
                    Start Date: {{ printableStartDate }}
                </p>
                <p>
                    End Date: {{ printableEndDate }}
                </p>
            </div>
            <p>
                vs
                <select v-model="comparisonWith">
                    <option value="PREVIOUS_PERIOD">Previous Period</option>
                    <option value="PREVIOUS_YEAR">Previous Year</option>
                </select>
            </p>
            <div>
                <p>
                    Start Date: {{ printableComparitiveStartDate }}
                </p>
                <p>
                    End Date: {{ printableComparitiveEndDate }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from 'lodash'
import CalendarBox from './CalendarBox'

const PREVIOUS_PERIOD = "PREVIOUS_PERIOD"
const PREVIOUS_YEAR = "PREVIOUS_YEAR"

const getRelativeLastYearDate = date => new Date(date.getFullYear() - 1, date.getMonth(), date.getDate())
const decrementMonth = date => {
    const fullYear = date.getFullYear()
    const month = date.getMonth()

    if (month === 0) {
        return new Date(fullYear - 1, 11, 1)
    }

    return new Date(fullYear, month - 1, 1)
}
const incrementMonth = date => {
    const fullYear = date.getFullYear()
    const month = date.getMonth()

    if (month === 11) {
        return new Date(fullYear + 1, 0, 1)
    }

    return new Date(fullYear, month + 1, 1)
}

export default {
	data() {
		return {
            date: new Date(),
            activeSelectedDayStart: this.getLeastDate(),
            currentMouseOveredDay: this.getLeastDate(),
            activeSelectedDayEnd: this.getLeastDate(),
            comparisonWith: PREVIOUS_YEAR
		}
    },
    components: {
        CalendarBox
    },
	computed: {
        isRangeSelected() {
            const {
                activeSelectedDayStart,
                activeSelectedDayEnd,
                isValidDate
            } = this
            return isValidDate(activeSelectedDayStart) && isValidDate(activeSelectedDayEnd)
        },
        previousYearStartDate() {
            const {
                activeSelectedDayStart,
                isValidDate
            } = this

            if (isValidDate(activeSelectedDayStart)) {
                return getRelativeLastYearDate(activeSelectedDayStart)
            }
        },
        previousYearEndDate() {
            const {
                activeSelectedDayEnd,
                isValidDate
            } = this

            if (isValidDate(activeSelectedDayEnd)) {
                return getRelativeLastYearDate(activeSelectedDayEnd)
            }
        },
        previousPeriodStartDate() {
            const {
                activeSelectedDayStart,
                activeSelectedDayEnd,
                isValidDate
            } = this

            if (isValidDate(activeSelectedDayEnd) && isValidDate(activeSelectedDayStart)) {
                const differenceMilliSeconds = activeSelectedDayEnd - activeSelectedDayStart
                const differenceInDays = differenceMilliSeconds / (3600*1000*24)

                const year = activeSelectedDayStart.getFullYear()
                const month = activeSelectedDayStart.getMonth()
                const day = activeSelectedDayStart.getDate()
                
                return new Date(year, month, day - 1 - differenceInDays)
            }
        },
        previousPeriodEndDate() {
            const {
                activeSelectedDayStart,
                isValidDate
            } = this
            
            if (isValidDate(activeSelectedDayStart)) {
                const year = activeSelectedDayStart.getFullYear()
                const month = activeSelectedDayStart.getMonth()
                const day = activeSelectedDayStart.getDate()
                
                return new Date(year, month, day - 1)
            }
        },
        comparitiveStartDate() {
            const { comparisonWith, previousYearStartDate, previousPeriodStartDate } = this
            if (comparisonWith === PREVIOUS_YEAR) {
                return previousYearStartDate
            } else if (comparisonWith === PREVIOUS_PERIOD) {
                return previousPeriodStartDate
            }
        },
        comparitiveEndDate() {
            const { comparisonWith, previousYearEndDate, previousPeriodEndDate } = this
            if (comparisonWith === PREVIOUS_YEAR) {
                return previousYearEndDate
            } else if (comparisonWith === PREVIOUS_PERIOD) {
                return previousPeriodEndDate
            }
        },
        printableStartDate() {
            const {
                activeSelectedDayStart,
                isValidDate
            } = this
            return (isValidDate(activeSelectedDayStart) && activeSelectedDayStart.toDateString()) || ''
        },
        printableEndDate() {
            const {
                activeSelectedDayEnd,
                isValidDate
            } = this
            return (isValidDate(activeSelectedDayEnd) && activeSelectedDayEnd.toDateString()) || ''
        },
        printableComparitiveStartDate() {
            const { comparitiveStartDate } = this
            return comparitiveStartDate ? comparitiveStartDate.toDateString() : ''
        },
        printableComparitiveEndDate() {
            const { comparitiveEndDate } = this
            return comparitiveEndDate ? comparitiveEndDate.toDateString() : ''
        }
	},
	methods: {
        
        onDayMouseOver(day) {
            if (this.isRangeSelected) return
            this.currentMouseOveredDay = day
        },
        onDayClick(day) {
            const { activeSelectedDayStart, isRangeSelected } = this
            
            if (isRangeSelected) {
                this.activeSelectedDayStart = day

                // reset data
                this.activeSelectedDayEnd = this.getLeastDate()
                this.currentMouseOveredDay = this.getLeastDate()

            } else if (this.isValidDate(activeSelectedDayStart)) {
                // handle second click
                
                if (day < activeSelectedDayStart) {
                    this.activeSelectedDayEnd = activeSelectedDayStart
                    this.activeSelectedDayStart = day
                } else {
                    this.activeSelectedDayEnd = day
                }

                this.currentMouseOveredDay = this.getLeastDate()

            } else {
                // handle first click
                this.activeSelectedDayStart = day
            }
        },
        getLastMonth() {
            return decrementMonth(this.date)
        },
        getNextMonth() {
            return incrementMonth(this.date)
        },
        isValidDate(date) {
            //dates are reference types so we have to compare the value
            return +date !== +this.getLeastDate()
        },
        getLeastDate() {
            return new Date(0)
        },
        decrementMonth() {
            this.date = decrementMonth(this.date)
        },
        incrementMonth() {
            this.date = incrementMonth(this.date)
        }
	}
}
</script>

<style lang="less">
.calendar-boxes-wrapper {
    display: flex;
    padding: 1em;
    background: #fafafa;

    .calendar-box {
        margin-right: .5em;
        &:last-child {
            margin-right: 0;            
        }
    }
}

.calendar-action {
    
}
</style>