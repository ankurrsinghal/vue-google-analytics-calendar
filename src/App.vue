<template>
	<div id="app">
		<Calendar />
	</div>
</template>

<script>
import Calendar from './components/Calendar'

export default {
	name: 'app',
	components: {
		Calendar
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

*,
*::after,
*::before {
	box-sizing: border-box;
}
</style>