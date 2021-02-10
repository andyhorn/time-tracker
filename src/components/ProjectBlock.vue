<template>
    <div class="container-fluid border rounded border-light p-2 my-3"
        :class="[{ 'bg-light': project.isSelected }, { 'text-dark': project.isSelected }]"
        @click.prevent.stop="onSelected">
        <div class="row">
            <div class="col text-right">
                <b-button variant="danger" @click.prevent.stop="onDelete">Delete</b-button>
            </div>
        </div>
        <div class="row">
            <div class="col ml-3">
                <div class="d-flex align-items-baseline">
                    <h1>{{ project.name }}</h1>
                    <p class="ml-2"><small>({{ status }})</small></p>
                </div>
                <p v-if="hasDurations">Total duration: {{ totalDuration }}</p>
                <p v-else>Not started.</p>
            </div>
            <div class="col-md-6 col-lg-5">
                <ul class="list-group my-3">
                    <duration v-for="duration in project.durations" :key="duration.id"
                        :duration="duration" @change="onDurationChange" @delete="onDurationDelete" />
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <b-button variant="danger" @click.prevent.stop="onStop">Stop</b-button>
            </div>
            <div class="col text-right">
                <b-button variant="info" @click.prevent.stop="onClearTimes" :disabled="isClearTimesDisabled">Clear Times</b-button>
            </div>
        </div>
    </div>
</template>

<script>
import Duration from './Duration';
import dayjs from 'dayjs';
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

export default {
    name: 'ProjectBlock',
    props: ['project'],
    components: {
        'duration': Duration,
    },
    data() {
        return {
            interval: null,
            startTicks: null,
            ticks: 0,
            seconds: 0,
        }
    },
    watch: {
        'project.isSelected': {
            immediate: true,
            handler: function () {
                if (this.project.isSelected) {
                    const endIndex = this.project.durations.length - 1;
                    this.startTicks = this.project.durations[endIndex].begin;

                    const start = dayjs(this.startTicks);

                    const vm = this;
                    this.interval = setInterval(() => {
                        const currentTime = dayjs();
                        const diff = currentTime.diff(start);

                        vm.ticks = diff;
                    }, 100);
                } else {
                    clearInterval(this.interval);
                    this.ticks = 0;
                }
            }
        }
    },
    computed: {
        totalDuration() {
            if (this.project.durations.length == 0) {
                return 'Not started.';
            }

            let duration = dayjs.duration(0);
            for (const dur of this.project.durations) {
                duration = duration.add(dur.totalTicks, 'milliseconds');
            }

            duration = duration.add(this.ticks, 'milliseconds');

            if (duration.days > 0) {
                return duration.format('D:H:mm:ss');
            }

            return duration.format('H:mm:ss');
        },
        hasDurations() {
            return this.project.durations.length > 0;
        },
        isClearTimesDisabled() {
            return this.project.durations.length == 0;
        },
        status() {
            return this.project.isSelected
                ? 'active'
                : 'inactive';
        }
    },
    methods: {
        onDelete() {
            this.$emit('delete', this.project.id);
        },
        onClearTimes() {
            this.$emit('clear', this.project.id);
        },
        onSelected() {
            this.$emit('selected', this.project.id);
        },
        onStop() {
            this.$emit('stop', this.project.id);
        },
        onDurationChange(id, duration) {
            // replace the existing duration with a new duration
            // containing the changed times
            this.project.replaceDuration(id, duration);
            this.$emit('change', this.project);
        },
        onDurationDelete(id) {
            this.project.removeDuration(id);
        }
    }
}
</script>

<style scoped>

</style>