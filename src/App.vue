<template>
  <div class="container pt-5">
    <b-button v-b-modal="'help-modal'" class="help-button"><b-icon-question /></b-button>
    <h1 class="text-center">Time Tracker</h1>
    <total-duration class="text-center" :projects="projects" />
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
    <b-modal id="help-modal" title="Help" hide-header-close ok-only :content-class="['bg-dark']">
      <b-container>
        <h2>Welcome to Time Tracker!</h2>
        <p>This tool is useful for tracking how much time you spend on various projects throughout your day.</p>
        <p>There are two controls to get familiar with: <br/>
        <strong>Blocks</strong> and <strong>Durations</strong>.</p>

        <h2>Blocks</h2>
        <p>Each project is tracked within a <strong>Project Block</strong>, containing the project's name 
        and the series of <strong>Durations</strong> associated with it. To create a new <strong>Project Block</strong>, 
        enter its name in the textbox and click "Submit" (or press the Enter key).</p>

        <img src="img/project_block.png" class="img-thumbnail" />

        <p>Once you have created a <strong>Project Block</strong>, all you need to do is click it to begin 
        tracking your time.</p>

        <img src="img/active_project.png" class="img-thumbnail" />

        <p><strong>Note:</strong> Only one project can be active at any time. Clicking on a <strong>Project 
        Block</strong> will de-activate any others.</p>

        <h2>Durations</h2>
        <p>Each <strong>Project Block</strong> will hold a list of <strong>Durations</strong> representing how 
        long you have worked on that project. Clicking to activate a project will mark the start time; 
        Stopping a project, by activating another project or by clicking the <strong>Stop</strong> button, 
        will mark the end time.</p>
        <p>Each pair of <strong>start</strong> and <strong>stop</strong> times will be added to the 
        <strong>Duration</strong> list.</p>

        <img src="img/pencil_icon.png" class="img-thumbnail" />

        <p>Clicking the pencil icon on a <strong>Duration</strong> will allow you to edit (or remove) that 
        duration, in case you need to make any adjustments.</p>

        <img src="img/edit_options.png" class="img-thumbnail" />
      </b-container>
    </b-modal>
  </div>
</template>

<script>
const STORAGE_KEY = 'x-time-tracker-x';

import ProjectBlock from './components/ProjectBlock';
import Project from './models/project';
import TotalDuration from './components/TotalDuration';

export default {
  name: 'App',
  components: {
    'project-block': ProjectBlock,
    'total-duration': TotalDuration,
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
.help-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
</style>
