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
// import Dur from '../models/duration';
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
            this.project.replaceDuration(id, duration);
            // copy the existing project data
            // const project = Object.assign({}, this.project);
            // const index = project.durations.findIndex(d => d.id == id);

            // if (index == -1) {
            //     return;
            // }

            // copy the list of durations into the new project data
            // project.durations = [...this.project.durations];

            // replace the duration with its updated data
            // project.durations[index] = duration;

            // update the project durations to account for the new
            // start and end times
            // this.updateDurations(project, duration);

            // emit the changed project data to be updated by the
            // parent components
            this.$emit('change', this.project);
        },
        // updateDurations(project, duration) {
        //     const index = project.durations.findIndex(d => d.id == duration.id);

        //     if (index == -1) {
        //         return;
        //     }

        //     // 1) Find and remove any durations that are completely overridden
        //     this.removeOverriddenDurations(project, duration.id);

        //     // 2) Adjusted the start/end times of adjacent durations that are
        //     // partially overridden
        //     this.pushAdjacentDurations(project, duration.id);
        // },
        // removeOverriddenDurations(project, id) {
        //     const begin = project.durations.find(d => d.id == id).begin;
        //     const end = project.durations.find(d => d.id == id).end;

        //     // find any durations that are completely overridden by this
        //     // updated duration, i.e. their start and end times fall within
        //     // this updated duration's start and end time
        //     const toRemove = project.durations
        //         .filter(dur => dur.begin >= begin && dur.end <= end && dur.id != id)
        //         .map(dur => dur.id);
            
        //     // remove any durations that were found to be overridden
        //     const filtered = project.durations
        //         .filter(dur => !toRemove.some(id => id == dur.id));

        //     project.durations = filtered;
        // },
        // pushAdjacentDurations(project, id) {
        //     const index = project.durations.findIndex(d => d.id == id);
        //     const duration = project.durations[index];
        //     const begin = duration.begin;
        //     const end = duration.end;

        //     // find any durations that end after this one begins and
        //     // adjust their end time to be equal to this one's begin
        //     for (let i = index - 1; i >= 0; i--) {
        //         if (project.durations[i].end > begin) {
        //             const adjusted = new Dur(project.durations[i].begin, begin);
        //             project.durations[i] = adjusted;
        //         }
        //     }

        //     // find any durations that begin before this one ends
        //     // and adjust their start time to equal this one's end
        //     for (let i = index + 1; i < project.durations.length; i++) {
        //         if (project.durations[i].begin < end) {
        //             const adjusted = new Dur(end, project.durations[i].end);
        //             project.durations[i] = adjusted;
        //         }
        //     }
        // }
    }
}
</script>

<style scoped>

</style>