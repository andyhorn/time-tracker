<template>
    <div>
        <ul class="list-group my-3">
            <li class="list-group-item text-dark" v-for="(duration, index) in durations" :key="index">
                <div class="d-flex justify-content-between">
                    {{ printDuration(duration) }}
                    <b-icon-pencil v-if="duration.end != 0" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DurationList',
    props: ['durations'],
    data() {
        return {
            display
        }
    },
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