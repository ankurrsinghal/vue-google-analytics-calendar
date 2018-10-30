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
                    :class="{
                        'comparitive-range': ifInComparitiveRange(computeDateFromIndex(index)),
                        'selected': ifDaySelected(computeDateFromIndex(index)),
                        'in-range': ifInRange(computeDateFromIndex(index)),
                        'mouseover': currentMouseOveredDay === computeDateFromIndex(index)
                    }"
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

const firstDayOfTheMonth = date => {
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

const howManyDaysInThisMonthsDate = date => {
    const month = date.getMonth()
    const year = date.getYear()

    if (month === 1) {
        return year % 4 === 0 ? 29 : 28
    } else {
        return DAYS_MONTH_MAP[month]
    }
}

export default {
    props: {
        date: Date,
        activeSelectedDayStart: Date,
        activeSelectedDayEnd: Date,
        currentMouseOveredDay: Date,
        comparitiveStartDate: Date,
        comparitiveEndDate: Date,
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
        computeDateFromIndex(index) {
            return this.getDateWithDay(this.paddedDayFromIndex(index))
        },
        paddedDayFromIndex(index) {
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
                index <= numberOfDaysInThisMonth
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

@numOfColumns: 7;
@daySize: 25px;
@daySpacing: 2px;
@containerPadding: 8px;
@totalWidth: @daySize*@numOfColumns + @daySpacing*((@numOfColumns)-1) + @containerPadding*2;


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
    }

    &.in-range {
        color: #fcfcfc;
        background: lighten(blueviolet, 20%);
        &:hover {
            background: blueviolet;
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