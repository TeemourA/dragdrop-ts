import Component from './base-component';
import { Project } from '../models/project-model';
import { Autobind } from '../decorators/autobind';
import { Draggable } from '../models/dd-interfaces';
export default class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;
  get persons() {
    return this.project.people === 1
      ? '1 person assigned'
      : `${this.project.people} persons assigned`;
  }

  constructor(hostID: string, project: Project) {
    super('single-project', hostID, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(_: DragEvent) {
    console.log('dragend');
  }

  configure() {
    this.element.setAttribute('draggable', 'true');
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
