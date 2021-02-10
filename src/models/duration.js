import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue';

export default class Duration {
    constructor(begin = null, end = null) {
        this._begin = begin;
        this._end = end;
        this._id = uuidv4();
        this._interval = null;
        this._totalTicks = 0;
        this._isCounting = false;
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

    start() {
        this._begin = new Date().getTime();
        this._interval = setInterval(() => {
            const ticks = new Date().getTime();
            Vue.set(this, '_totalTicks', ticks - this._begin);
        }, 500);
    }

    stop() {
        this._end = new Date().getTime();
        clearInterval(this._interval);
        this._interval = null;
        this._totalTicks = this._end - this._begin;
    }
}