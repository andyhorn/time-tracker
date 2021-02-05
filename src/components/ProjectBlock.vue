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
                <h1>{{ project.name }}</h1>
                <p v-if="!hasDurations">Total duration: {{ totalDuration }}</p>
                <p v-else>Not started.</p>
            </div>
            <div class="col-md-6 col-lg-4">
                <duration-list :durations="project.durations" />
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
import DurationList from './DurationList';
import { getDuration } from '../utils/time';

export default {
    name: 'ProjectBlock',
    props: ['project'],
    components: {
        'duration-list': DurationList,
    },
    data() {
        return {
            interval: null,
            startTicks: null,
            ticks: 0,
        }
    },
    watch: {
        'project.isSelected': {
            immediate: true,
            handler: function () {
                if (this.project.isSelected) {
                    this.startTicks = new Date().getTime();

                    const vm = this;
                    this.interval = setInterval(() => {
                        const currentTicks = new Date().getTime();
                        vm.ticks = currentTicks - vm.startTicks;
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

            let totalTicks = 0;
            for (const dur of this.project.durations) {
                totalTicks += dur.totalTicks;
            }

            totalTicks += this.ticks;

            return getDuration(0, totalTicks);
        },
        hasDuration() {
            return this.project.durations.length > 0;
        },
        isClearTimesDisabled() {
            return this.project.durations.length == 0;
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
        }
    }
}
</script>

<style scoped>

</style>