<template>
	<div class="actions">
		<button
			@click="decrementMonth">
			Previous
		</button>
		<div class="calendar-month-year">
			{{ ` ${month} ${year}` }}
		</div>
		<button
			@click="incrementMonth">
			Next
		</button>
	</div>
</template>