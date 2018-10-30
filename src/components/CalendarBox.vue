<template>
    <div class="calendar-box">
        <div class="calendar-month">
            {{ ` ${month} ${year}` }}
        </div>
        <div class="calendar-days-container calendar-week-days-names">
            <div
                class="calender-day-wrapper week-day"
                v-for="(name, index) in weekDaysNames"
                :key="index">
                <div class="calendar-day">{{ name }}</div>
            </div>
        </div>
        <div class="week-divider"></div>
        <div class="calendar-days-container">
            <div
                class="calender-day-wrapper"
                v-for="index in 35"
                :key="index">
                <div
                    v-if="shouldDayBeHere(index)"
                    class="calender-day"
                    :class="computeTheClasses(index)"
                    @click="$emit('onDayClick', (computeDateFromIndex(index)))"
                    @mouseover="$emit('onDayMouseOver', (computeDateFromIndex(index)))">
                    {{ paddedDayFromIndex(index) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from 'lodash'

import {
    firstDayOfTheMonth,
    howManyDaysInThisMonthsDate
} from './utils'

export default {
    props: {
        date: Date,
        activeSelectedDayStart: Date,
        activeSelectedDayEnd: Date,
        currentMouseOveredDay: Date,
        comparitiveStartDate: Date,
        comparitiveEndDate: Date,
        today: Date,
        isRangeSelected: Boolean
    },
	computed: {
		days() {
			return this.getDays(this.date)
		},
		month() {
			return capitalize(this.getMonthName(this.date))
		},
		year() {
			return this.date.getFullYear()
        },
        weekDaysNames() {
            return [
                'M',
                'T',
                'W',
                'T',
                'F',
                'S',
                'S'
            ]
        },
        firstDayOfTheMonth() {
            return firstDayOfTheMonth(this.date)   
        },
        numberOfDaysInThisMonth() {
			return howManyDaysInThisMonthsDate(this.date)
        },
	},
	methods: {
        computeTheClasses(index) {
            //properties
            const {
                currentMouseOveredDay,
                today
            } = this


            //methods
            const {
                computeDateFromIndex,
                ifInComparitiveRange,
                ifDaySelected,
                ifInRange
            } = this


            const dateFromIndex = this.computeDateFromIndex(index)
            return ({
                'comparitive-range': ifInComparitiveRange(dateFromIndex),
                'selected': ifDaySelected(dateFromIndex),
                'in-range': ifInRange(dateFromIndex),
                'mouseover': +currentMouseOveredDay === +dateFromIndex,
                'today': +today === +dateFromIndex
            })
        },
        computeDateFromIndex(index) {
            return this.getDateWithDay(this.paddedDayFromIndex(index))
        },
        paddedDayFromIndex(index) {
            // console.log(index - this.firstDayOfTheMonth + 1)
            return index - this.firstDayOfTheMonth + 1
        },
        shouldDayBeHere(index) {
            const {
                numberOfDaysInThisMonth,
                firstDayOfTheMonth
            } = this
            return (
                index >= firstDayOfTheMonth
                &&
                index <= numberOfDaysInThisMonth + (firstDayOfTheMonth - 1)
            )
        },
        ifInComparitiveRange(date) {
            const {
                comparitiveStartDate,
                comparitiveEndDate
            } = this
            return (
                (this.isValidDate(comparitiveStartDate) && this.isValidDate(comparitiveEndDate))
                &&
                (
                    (date >= comparitiveStartDate && date <= comparitiveEndDate)
                )
            )
        },
        getDateWithDay(day) {
            const year = this.date.getFullYear()
            const month = this.date.getMonth()
            return new Date(year, month, day)
        },
        ifInRange(day) {
            const {
                activeSelectedDayStart,
                activeSelectedDayEnd,
                currentMouseOveredDay,
                isRangeSelected
            } = this
            
            if (isRangeSelected) return false
            
            return (
                (this.isValidDate(activeSelectedDayStart) && this.isValidDate(currentMouseOveredDay))
                &&
                (
                    (day > activeSelectedDayStart && day <= currentMouseOveredDay)
                    ||
                    (day < activeSelectedDayStart && day >= currentMouseOveredDay)
                )
            )
        },
        ifDaySelected(day) {
            const { activeSelectedDayStart, activeSelectedDayEnd } = this
            
            if (this.isRangeSelected) {
                return (
                    (day >= activeSelectedDayStart && day <= activeSelectedDayEnd)
                    ||
                    (day <= activeSelectedDayStart && day >= activeSelectedDayEnd)
                )
            } else {
                return +activeSelectedDayStart === +day
            }
        },
		getMonthName(date) {
			const monthNames = [
				'january',
				'february',
				'march',
				'april',
				'may',
				'june',
				'july',
				'august',
				'september',
				'october',
				'november',
				'december'
			]
			return monthNames[date.getMonth()]
		},
        isValidDate(date) {
            //dates are reference types so we have to compare the value
            if (!date) return false
            return +date !== +this.getLeastDate()
        },
        getLeastDate() {
            return new Date(0)
        }
	}
}
</script>

<style lang="less">
@import url('./variables.less');

.calendar-box {
    width: @totalWidth;
    background: #eeeeee;
    padding: @containerPadding;
}

.calendar-days-container {
    display: grid;
    grid-template-columns: repeat(@numOfColumns, @daySize);
    gap: @daySpacing;
}

.calender-day-wrapper {
    width: @daySize;
    height: @daySize;
    font-weight: 500;    
	background: #fcfcfc;
    font-size: 11px;
    line-height: @daySize;
    text-align: center;
}

.calender-day {
    cursor: pointer;
    transition: background-color .2s, color .2s;

    &:hover {
        color: #fcfcfc;
        background: lighten(blueviolet, 20%);
    }

    &.selected {
        background: blueviolet;
        color: #fcfcfc;
        &.today {
            background: blueviolet;
            color: #fcfcfc;
        }
    }

    &.today {
        background: rosybrown;
        color: #fcfcfc;
    }

    &.in-range {
        color: #fcfcfc;
        background: lighten(blueviolet, 20%);
        &:hover {
            background: blueviolet;
            &.today {
                color: #fcfcfc;
                background: blueviolet;
            }
        }
        &.today {
            color: #fcfcfc;
            background: lighten(blueviolet, 20%);
        }
    }

    &.comparitive-range {
        color: #fcfcfc;
        background: saddlebrown;
    }
}

.calendar-month {
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
}

.week-day {
    border-bottom: 1px solid #333333;
}

.week-divider {
    margin: 2px 0;
}
</style>