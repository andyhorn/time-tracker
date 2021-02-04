<template>
    <div>
        <ul class="list-group my-3">
            <li class="list-group-item text-dark" v-for="(duration, index) in durations" :key="index">
                {{ printDuration(duration) }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DurationList',
    props: ['durations'],
    methods: {
        printDuration(duration) {
            const begin = new Date(duration.begin).toLocaleTimeString();

            if (duration.end == 0) {
                return `${begin} - Present`;
            }

            const end = new Date(duration.end).toLocaleTimeString();
            return `${begin} - ${end}`;
        }
    }
}
</script>