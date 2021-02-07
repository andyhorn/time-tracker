import { v4 as uuidv4 } from 'uuid';
import Duration from './duration';

export default class Project {
    constructor(name) {
        this._name = name;
        this._id = uuidv4();
        this._durations = [];
        this.isSelected = false;
    }

    get durations() {
        return this._durations;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    clear() {
        this._durations = [];
    }

    addDuration(duration) {
        this._durations.push(duration);
    }

    removeDuration(id) {
        const index = this._findIndex(id);

        if (index == -1) {
            return;
        }

        this._durations.splice(index, 1);
    }

    getDuration(id) {
        return this._findDuration(id);
    }

    replaceDuration(id, duration) {
        const index = this._findIndex(id);

        if (index == -1) {
            return;
        }

        this._durations[index] = duration;
        this._updateDurations();
    }

    setSelected() {
        if (this.isSelected) {
            return;
        }

        const duration = new Duration();
        duration.start();

        this.addDuration(duration);
        this.isSelected = true;
    }

    setDeselected() {
        const index = this._durations.length - 1;
        this._durations[index].stop();

        this.isSelected = false;
    }

    static parse(json) {
        const projects = [];
        const projectData = JSON.parse(json);

        for (let project of projectData) {
            const newProject = new Project(project.name);

            for (let i = 0; i < project.durations; i++) {
                const begin = project.durations[i].begin;
                const end = project.durations[i].end;

                const newDuration = new Duration(begin, end);

                newProject._durations.push(newDuration);
            }

            projects.push(newProject);
        }

        return projects;
    }

    _prune(id) {
        const index = this._findIndex(id);
        const duration = this._durations[index];
        const begin = duration.begin;
        const end = duration.end;

        const toRemove = this._durations
            .filter(d => d.begin >= begin && d.end <= end && d.id != id)
            .map(d => d.id);

        if (toRemove.length == 0) {
            return;
        }
        
        const filtered = this._durations
            .filter(d => toRemove.every(id => id != d.id));

        this._durations = filtered;
    }

    _adjust(id) {
        const index = this._findIndex(id);
        const duration = this._durations[index];
        const begin = duration.begin;
        const end = duration.end;

        for (let i = index - 1; i >= 0; i--) {
            if (this._durations[i].end > begin) {
                this._durations[i].end = begin;
            }
        }

        for (let i = index + 1; i < this._durations.length; i++) {
            if (this._durations[i].begin < end) {
                this._durations[i].begin = end;
            }
        }
    }

    _findIndex(id) {
        return this._durations.findIndex(d => d.id == id);
    }

    _findDuration(id) {
        const index = this._findIndex(id);

        if (index == -1) {
            return null;
        }

        return this._durations[index];
    }
}