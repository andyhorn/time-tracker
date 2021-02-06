<template>
    <li class="list-group-item text-dark" @click.stop.prevent>
        <div v-if="displayEdit" class="d-flex justify-content-between align-items-center p-2">
            <b-form-timepicker size="sm" show-seconds v-model="startTime" />
            <span> - </span>
            <b-form-timepicker size="sm" show-seconds v-model="endTime" />
            <div class="d-flex flex-column align-items-between justify-content-center m-2">
                <b-icon-check-circle class="my-2 text-success icon-btn" @click.prevent.stop="onSave"/>
                <b-icon-x-circle class="my-2 text-danger icon-btn" @click.prevent.stop="onCancel"/>
            </div>
        </div>
        <div v-else class="d-flex justify-content-between">
            {{ printDuration(duration) }}
            <b-icon-pencil v-if="duration.end != 0" class="icon-btn" @click.prevent.stop="onEdit" />
        </div>
    </li>
</template>

<script>
import Duration from '../models/duration';
import { hour24ToDate, ticksTo24Hour } from '../utils/time';

export default {
    name: 'Duration',
    props: ['duration'],
    data() {
        return {
            displayEdit: false,
            startTime: null,
            endTime: null,
        }
    },
    watch: {
        'duration.begin': {
            immediate: true,
            handler: function() {
                if (this.duration.begin == 0) {
                    this.startTime = null;
                } else {
                    this.startTime = ticksTo24Hour(this.duration.begin);
                }
            }
        },
        'duration.end': {
            immediate: true,
            handler: function() {
                if (this.duration.end == 0) {
                    this.endTime = 0;
                } else {
                    this.endTime = ticksTo24Hour(this.duration.end);
                }
            }
        },
        'startTime'() {
            const start = hour24ToDate(this.startTime);
            const end = hour24ToDate(this.endTime);

            if (start > end) {
                this.endTime = this.startTime;
            }
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
        },
        onEdit() {
            this.displayEdit = true;
        },
        onSave() {
            const start = hour24ToDate(this.startTime);
            const end = hour24ToDate(this.endTime);
            const duration = new Duration(start.getTime(), end.getTime());

            this.displayEdit = false;
            this.$emit('change', this.duration.id, duration);
        },
        onCancel() {
            this.startTime = ticksTo24Hour(this.duration.begin);
            this.endTime = ticksTo24Hour(this.duration.end);
            this.displayEdit = false;
        },
    }
}
</script>

<style scoped>
.icon-btn:hover {
    cursor: pointer;
}
</style>