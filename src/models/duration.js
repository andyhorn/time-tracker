import { getDuration } from '../utils/time';
import { v4 as uuidv4 } from 'uuid';

export default class Duration {
    constructor(begin = null, end = null) {
        this._begin = begin;
        this._end = end;
        this._id = uuidv4();
    }

    get id() {
        return this._id;
    }

    get begin() {
        return this._begin || 0;
    }

    get end() {
        return this._end || 0;
    }

    get duration() {
        return getDuration(this._begin, this._end);
    }

    get totalTicks() {
        if (!this._begin || !this._end) {
            return 0;
        }

        return this.end - this.begin;
    }

    start() {
        this._begin = new Date().getTime();
    }

    stop() {
        this._end = new Date().getTime();
    }
}