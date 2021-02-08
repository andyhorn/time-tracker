<template>
  <div class="container pt-5">
    <h1 class="text-center">Time Tracker</h1>
    <b-input-group class="mb-2">
      <b-form-input v-model="projectName" @keyup="onProjectNameKeyUp" placeholder="New project name..." />
      <b-input-group-append>
        <b-button variant="primary" @click="onNewProject" :disabled="isNewProjectDisabled">Submit</b-button>
      </b-input-group-append>
    </b-input-group>
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

import ProjectBlock from './components/ProjectBlock';
import Project from './models/project';

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
  },
  methods: {
    onProjectChange(project) {
      const index = this.projects.findIndex(p => p.id == project.id);

      if (index == -1) {
        return;
      }

      this.$set(this.projects, index, project);
      this.save();
    },
    onNewProject() {
      const newProject = new Project(this.projectName);

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

      this.projects[index].clear();
      this.projects[index].isSelected = false;
    },
    onProjectSelected(id) {
      for (const project of this.projects) {
        if (project.id == id) {
          project.setSelected();
        } else {
          project.setDeselected();
        }
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

      project.setDeselected();
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

      const projects = Project.parse(json);

      this.projects = projects;
    }
  }
}
</script>

<style>

</style>
