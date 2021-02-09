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
import dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

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
                    this.startTime = dayjs(this.duration.begin).format('HH:mm:ss');
                }
            }
        },
        'duration.end': {
            immediate: true,
            handler: function() {
                if (this.duration.end == 0) {
                    this.endTime = 0;
                } else {
                    this.endTime = dayjs(this.duration.end).format('HH:mm:ss');
                }
            }
        },
        'startTime'() {
            const start = dayjs(this.startTime, 'HH:mm:ss').unix();
            const end = dayjs(this.endTime, 'HH:mm:ss').unix();

            if (start > end) {
                this.endTime = this.startTime;
            }
        },
        'endTime'() {
            const start = dayjs(this.startTime, 'HH:mm:ss').unix();
            const end = dayjs(this.endTime, 'HH:mm:ss').unix();

            if (end < start) {
                this.startTime = this.endTime;
            }
        }
    },
    methods: {
        printDuration(duration) {
            const begin = dayjs(duration.begin).format('h:mm:ss A');

            if (duration.end == 0) {
                return `${begin} - Present`;
            }

            const end = dayjs(duration.end).format('h:mm:ss A');
            return `${begin} - ${end}`;
        },
        onEdit() {
            this.displayEdit = true;
        },
        onSave() {
            const start = dayjs(this.startTime, 'HH:mm:ss');
            const end = dayjs(this.endTime, 'HH:mm:ss');

            const duration = new Duration(start.unix(), end.unix());

            this.displayEdit = false;
            this.$emit('change', this.duration.id, duration);
        },
        onCancel() {
            this.startTime = dayjs(this.duration.begin).format('HH:mm:ss');
            this.endTime = dayjs(this.duration.end).format('HH:mm:ss');
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