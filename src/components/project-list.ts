import Component from './base-component.js';
import ProjectItem from './project-item.js';
import { Project, ProjectStatus } from '../models/project-model.js';
import { projectState } from '../state/project-state.js';
import { Autobind } from '../decorators/autobind.js';
import { DragTarget } from '../models/dd-interfaces.js';
export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.hostElement = document.getElementById('app') as HTMLDivElement;
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const list = this.element.querySelector('ul')!;
      list.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const projectID = event.dataTransfer!.getData('text/plain');
    projectState.movePrjoect(
      projectID,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const list = this.element.querySelector('ul')!;
    list.classList.remove('droppable');
  }

  private renderProjects() {
    const list = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    list.innerHTML = '';
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter(project => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }

        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProject;
      this.renderProjects();
    });
  }
}
