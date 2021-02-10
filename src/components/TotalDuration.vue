<template>
    <p>Total Time: {{ totalDuration }}</p>
</template>

<script>
import dayjs from 'dayjs';
const durationPlugin = require('dayjs/plugin/duration');
dayjs.extend(durationPlugin);

export default {
    name: 'TotalDuration',
    props: ['projects'],
    data() {
        return {
            interval: null,
        }
    },
    computed: {
        totalTicks() {
            return this.projects.reduce((sum, cur) => sum += cur.durations.reduce((t, c) => t += c.totalTicks, 0), 0);
        },
        totalDuration() {
            const duration = dayjs.duration(this.totalTicks);

            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            return `${days} ${days == 1 ? 'day' : 'days'}, 
                ${hours} ${hours == 1 ? 'hour' : 'hours'}, 
                ${minutes} ${minutes == 1 ? 'minute' : 'minutes'}, 
                ${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;
        },
    },
}
</script>