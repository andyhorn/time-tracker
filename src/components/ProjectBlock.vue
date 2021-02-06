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
                        :duration="duration" @change="onDurationChange" />
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
import Dur from '../models/duration';
import { getDuration } from '../utils/time';

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
            console.log('duration changed:')
            console.log(duration)
            const project = Object.assign({}, this.project);
            const index = project.durations.findIndex(d => d.id == id);
            console.log(`index of duration being changed: ${index}`)

            if (index == -1) {
                return;
            }

            project.durations = [...this.project.durations];
            project.durations[index] = duration;

            this.updateDurations(project, duration);

            this.$emit('change', project);
        },
        updateDurations(project, duration) {
            const index = project.durations.findIndex(d => d.id == duration.id);

            if (index == -1) {
                return;
            }

            // 1) Find and remove any durations that are completely overridden
            this.removeOverriddenDurations(project, duration.id);

            // 2) Adjusted the start/end times of adjacent durations that are
            // partially overridden
            this.pushAdjacentDurations(project, duration.id);
        },
        removeOverriddenDurations(project, id) {
            console.log('removing overridden durations...')
            const begin = project.durations.find(d => d.id == id).begin;
            const end = project.durations.find(d => d.id == id).end;

            console.log(`begin: ${begin}`)
            console.log(`end: ${end}`)

            const toRemove = project.durations
                .filter(dur => dur.begin >= begin && dur.end <= end && dur.id != id)
                .map(dur => dur.id);

            console.log('to remove:')
            console.log(toRemove);
            
            const filtered = project.durations
                .filter(dur => !toRemove.some(id => id == dur.id));
            console.log('filtered: ')
            console.log(filtered)

            project.durations = filtered;
        },
        pushAdjacentDurations(project, id) {
            console.log('pushing adjacent durations...')
            const index = project.durations.findIndex(d => d.id == id);
            console.log(`index: ${index}`)
            const duration = project.durations[index];
            const begin = duration.begin;
            const end = duration.end;

            // if (index != 0) {
                console.log('pushing prior durations...')
                for (let i = index - 1; i >= 0; i--) {
                    if (project.durations[i].end > begin) {
                        console.log('found adjacent duration that ends after this begins')
                        console.log(project.durations[i])

                        console.log('adjusted times:')
                        const adjusted = new Dur(project.durations[i].begin, begin);
                        console.log(adjusted)

                        console.log('updating...')
                        project.durations[i] = adjusted;
                    }
                }
            // }

            // if (index != project.durations.length - 1) {
                console.log('pushing durations that start before this ends...')
                for (let i = index + 1; i < project.durations.length; i++) {
                    console.log(`end: ${end} - current begin: ${project.durations[i].begin}`)
                    if (project.durations[i].begin < end) {
                        console.log('found duration:')
                        console.log(project.durations[i])

                        console.log('adjusting times')
                        const adjusted = new Dur(end, project.durations[i].end);
                        console.log(adjusted)

                        console.log('updating...')
                        project.durations[i] = adjusted;
                    }
                }
            // }
        }
    }
}
</script>

<style scoped>

</style>