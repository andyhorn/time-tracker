import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';

const INTERVAL_DURATION_MS = 500;

export default class Duration {
    constructor(begin = null, end = null) {
        this._begin = begin;
        this._end = end;
        this._id = uuidv4();
        this._interval = null;
        this._totalTicks = 0;
        this._isCounting = false;

        if (this._begin != null && this._end != null) {
            this._totalTicks = this._end - this._begin;
        } else if (this._begin != null && this._end == null) {
            this._startInterval();
        }
    }

    get id() {
        return this._id;
    }

    get begin() {
        return this._begin || 0;
    }

    set begin(ticks) {
        this._begin = ticks;

        if (this._begin > this._end) {
            this._end = this._begin;
        }
    }

    get end() {
        return this._end || 0;
    }

    set end(ticks) {
        if (this._interval != null) {
            this.stop();
        }

        this._end = ticks;

        if (this._end < this._begin) {
            this._begin = this._end;
        }
    }

    get totalTicks() {
        return this._totalTicks;
    }

    get isCounting() {
        return this._isCounting;
    }

    _tickTock() {
        const ticks = new Date().getTime();
        Vue.set(this, '_totalTicks', ticks - this._begin);
    }

    _startInterval() {
        if (this._interval != null) {
            return;
        }

        this._interval = setInterval(() => 
            this._tickTock(), INTERVAL_DURATION_MS);
        this._isCounting = true;
    }

    _stopInterval() {
        if (this._interval == null) {
            return;
        }

        clearInterval(this._interval);
        this._interval = null;
        this._isCounting = false;
    }

    start() {
        this._begin = new Date().getTime();
        this._startInterval();
    }

    stop() {
        this._stopInterval();
        this._end = new Date().getTime();
        this._totalTicks = this._end - this._begin;
    }
}