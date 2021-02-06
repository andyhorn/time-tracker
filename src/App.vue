<template>
  <div class="container pt-5">
    <h1 class="text-center">Time Tracker</h1>
    <b-input-group class="mb-2">
      <b-form-input v-model="projectName" @keyup="onProjectNameKeyUp" placeholder="New project name..." />
      <b-input-group-append>
        <b-button variant="primary" @click="onNewProject" :disabled="isNewProjectDisabled">Submit</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-button variant="danger" @click="onStop" :disabled="isStopDisabled">Stop All</b-button>
    <project-block v-for="project in projects" :key="project.id" 
      :project="project"
      @selected="onProjectSelected"
      @delete="onProjectDelete"
      @clear="onProjectClear"
      @stop="onProjectStop"
      @change="onProjectChange" />
  </div>
</template>

<script>
const STORAGE_KEY = 'x-time-tracker-x';

import { v4 as uuidv4 } from 'uuid';
import ProjectBlock from './components/ProjectBlock';
import Duration from './models/duration';

export default {
  name: 'App',
  components: {
    'project-block': ProjectBlock,
  },
  data() {
    return {
      projectName: '',
      projects: [],
    }
  },
  mounted() {
    this.load();
  },
  watch: {
    'projects': {
      deep: true,
      handler: function() {
        this.save();
      }
    }
  },
  computed: {
    isNewProjectDisabled() {
      return !this.projectName || !this.projectName.trim();
    },
    hasSelection() {
      return this.projects.some(p => p.isSelected);
    },
    isStopDisabled() {
      return !this.hasSelection;
    }
  },
  methods: {
    onProjectChange(project) {
      console.log('project changed!')
      const index = this.projects.findIndex(p => p.id == project.id);

      if (index == -1) {
        console.log('index of project not found; exiting')
        return;
      }

      console.log(index)
      this.$set(this.projects, index, project);
      this.save();
    },
    onNewProject() {
      const id = uuidv4();
      const newProject = {
        id,
        name: this.projectName,
        durations: [],
        isSelected: false,
      };

      this.projects.push(newProject);
      this.projects = this.projects.sort((a, b) => a.name < b.name ? -1 : 1);
      this.projectName = '';
    },
    onProjectDelete(id) {
      const index = this.projects.findIndex(p => p.id == id);

      if (index == -1) {
        return;
      }

      this.projects.splice(index, 1);
    },
    onProjectClear(id) {
      const index = this.projects.findIndex(p => p.id == id);

      if (index == -1) {
        return;
      }

      this.projects[index].durations = [];
      this.projects[index].isSelected = false;
    },
    onProjectSelected(id) {
      for (const project of this.projects) {
        if (project.id == id) {
          this.selectProject(project);
        } else {
          this.deSelectProject(project);
        }
      }
    },
    selectProject(project) {
      if (project.isSelected) {
        return;
      }

      const duration = new Duration();
      duration.start();

      project.durations.push(duration);
      project.isSelected = true;
    },
    deSelectProject(project) {
      if (project.isSelected) {
        const lastIndex = project.durations.length - 1;
        project.durations[lastIndex].stop();

        project.isSelected = false;
      }
    },
    onProjectNameKeyUp(e) {
      if (e.code == 'Enter') {
        this.onNewProject();
      }
    },
    onProjectStop(id) {
      const project = this.projects.find(p => p.id == id);

      if (project == null) {
        return;
      }

      this.deSelectProject(project);
    },
    onStop() {
      this.projects.forEach(this.deSelectProject);
    },
    save() {
      if (this.projects.length == 0) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const json = JSON.stringify(this.projects);
      localStorage.setItem(STORAGE_KEY, json);
    },
    load() {
      const json = localStorage.getItem(STORAGE_KEY);

      if (json == null) {
        return;
      }

      const projects = JSON.parse(json);

      for (let project of projects) {
        for (let i = 0; i < project.durations.length; i++) {
          const begin = project.durations[i]._begin;
          const end = project.durations[i]._end;

          project.durations[i] = new Duration(begin, end);
        }
      }

      this.projects = projects;
    }
  }
}
</script>

<style>

</style>
