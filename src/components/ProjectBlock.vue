<template>
    <div class="container-fluid border rounded border-light p-2 pl-4 my-3"
        :class="[{ 'bg-light': project.isSelected }, { 'text-dark': project.isSelected }]"
        @click.prevent.stop="onSelected">
        <div class="row">
            <div class="col text-right">
                <b-button variant="danger" @click.prevent.stop="onDelete">Delete</b-button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h1>{{ project.name }}</h1>
                <p>{{ totalDuration }}</p>
            </div>
            <div class="col-md-6 col-lg-4">
                <duration-list :durations="project.durations" />
            </div>
        </div>
        <div class="row">
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
    computed: {
        totalDuration() {
            if (this.project.durations.length == 0) {
                return 'Not started.';
            }

            let totalTicks = 0;
            for (const dur of this.project.durations) {
                totalTicks += dur.totalTicks;
            }

            return getDuration(0, totalTicks);
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
        }
    }
}
</script>

<style scoped>

</style>