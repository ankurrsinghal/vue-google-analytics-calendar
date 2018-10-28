<template>
    <div class="calendar-box">
        <div class="calendar-month">
            {{ ` ${month} ${year}` }}
        </div>
        <div class="calendar-days-container">
            <div
                class="calender-day"
                v-for="day in days"
                :key="day"
                :class="{
                    'selected': ifDaySelected(getDateWithDay(day)),
                    'in-range': ifInRange(getDateWithDay(day)),
                    'mouseover': currentMouseOveredDay === getDateWithDay(day)
                }"
                @click="$emit('onDayClick', (getDateWithDay(day)))"
                @mouseover="$emit('onDayMouseOver', (getDateWithDay(day)))">
                {{ day }}
            </div>
        </div>
    </div>
</template>

<script>
import { capitalize } from 'lodash'

export default {
    props: {
        date: Date,
        activeSelectedDayStart: Date,
        activeSelectedDayEnd: Date,
        currentMouseOveredDay: Date,
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
        }
	},
	methods: {
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
                return activeSelectedDayStart === day
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
		getDays(date) {
			const daysMonthMap = {
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

			const month = date.getMonth()
			const year = date.getYear()

			if (month === 1) {
				return year % 4 === 0 ? 29 : 28
			} else {
				return daysMonthMap[month]
			}
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

@numOfColumns: 7;
@daySize: 30px;
@daySpacing: 6px;
@containerPadding: 8px;
@totalWidth: @daySize*@numOfColumns + @daySpacing*((@numOfColumns)-1) + @containerPadding*2;


.calendar-box {
    width: @totalWidth;
    background: #eeeeee;
    padding: @containerPadding;
}

.calendar-days-container {
    display: grid;
    grid-template-columns: repeat(@numOfColumns, 30px);
    gap: @daySpacing;
}

.calender-day {
	width: @daySize;
    height: @daySize;
    font-weight: 500;    
	background: #fcfcfc;
    font-size: 12px;
    line-height: @daySize;
    text-align: center;
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
}

.calendar-month {
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
}
</style>