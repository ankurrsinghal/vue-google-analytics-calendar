<template>
    <div>
        <div class="calendar-boxes-wrapper">
            <CalendarBox
                :date="getLastMonth(date)"
                :activeSelectedDayStart= activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick = onDayClick
                @onDayMouseOver = onDayMouseOver />
            <CalendarBox
                :date="date"
                :activeSelectedDayStart = activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick="onDayClick"
                @onDayMouseOver="onDayMouseOver" />
            <CalendarBox
                :date="getNextMonth(date)"
                :activeSelectedDayStart = activeSelectedDayStart
                :activeSelectedDayEnd = activeSelectedDayEnd
                :currentMouseOveredDay = currentMouseOveredDay
                :isRangeSelected = isRangeSelected
                @onDayClick="onDayClick"
                @onDayMouseOver="onDayMouseOver" />
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
                    Start Date: {{ comparitiveStartDate }}
                </p>
                <p>
                    End Date: {{ comparitiveEndDate }}
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
        printablePreviousYearStartDate() {
            const {
                activeSelectedDayStart,
                isValidDate
            } = this

            if (isValidDate(activeSelectedDayStart)) {
                const year = activeSelectedDayStart.getFullYear()
                const month = activeSelectedDayStart.getMonth()
                const day = activeSelectedDayStart.getDate()
                
                return new Date(year - 1, month, day).toDateString()
            }

            return ''
        },
        printablePreviousYearEndDate() {
            const {
                activeSelectedDayEnd,
                isValidDate
            } = this
            
            if (isValidDate(activeSelectedDayEnd)) {
                const year = activeSelectedDayEnd.getFullYear()
                const month = activeSelectedDayEnd.getMonth()
                const day = activeSelectedDayEnd.getDate()
                
                return new Date(year - 1, month, day).toDateString()
            }

            return ''
        },
        printablePreviousPeriodStartDate() {
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
                
                return new Date(year, month, day - 1 - differenceInDays).toDateString()
            }

            return ''
        },
        printablePreviousPeriodEndDate() {
            const {
                activeSelectedDayStart,
                isValidDate
            } = this
            
            if (isValidDate(activeSelectedDayStart)) {
                const year = activeSelectedDayStart.getFullYear()
                const month = activeSelectedDayStart.getMonth()
                const day = activeSelectedDayStart.getDate()
                
                return new Date(year, month, day - 1).toDateString()
            }

            return ''
        },
        comparitiveStartDate() {
            const { comparisonWith, printablePreviousYearStartDate, printablePreviousPeriodStartDate } = this
            if (comparisonWith === PREVIOUS_YEAR) {
                return printablePreviousYearStartDate
            } else if (comparisonWith === PREVIOUS_PERIOD) {
                return printablePreviousPeriodStartDate
            } else {
                return ''
            }
        },
        comparitiveEndDate() {
            const { comparisonWith, printablePreviousYearEndDate, printablePreviousPeriodEndDate } = this
            if (comparisonWith === PREVIOUS_YEAR) {
                return printablePreviousYearEndDate
            } else if (comparisonWith === PREVIOUS_PERIOD) {
                return printablePreviousPeriodEndDate
            } else {
                return ''
            }
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
                this.activeSelectedDayEnd = day
                this.currentMouseOveredDay = this.getLeastDate()

            } else {
                // handle first click
                this.activeSelectedDayStart = day
            }
        },
        getLastMonth() {
            const fullYear = this.date.getFullYear()
            const month = this.date.getMonth()

            if (fullYear === 0) {
                return new Date(fullYear - 1, 0, 1)
            }
            return new Date(fullYear, month - 1, 1)
        },
        getNextMonth() {
            const fullYear = this.date.getFullYear()
            const month = this.date.getMonth()

            if (fullYear === 11) {
                return new Date(fullYear + 1, 0, 1)
            }
            return new Date(fullYear, month + 1, 1)
        },
        isValidDate(date) {
            //dates are reference types so we have to compare the value
            return +date !== +this.getLeastDate()
        },
        getLeastDate() {
            return new Date(0)
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
</style>