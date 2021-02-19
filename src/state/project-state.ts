import { Project, ProjectStatus } from '../models/project-model.js';

type Listener<T> = (list: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
export class ProjectState extends State<Project> {
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects = [...this.projects, newProject];
    this.updateListeners();
  }

  movePrjoect(projectID: string, newStatus: ProjectStatus) {
    const movedProject = this.projects.find(
      project => project.id === projectID
    );

    if (movedProject && movedProject.status !== newStatus) {
      movedProject.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  }
}

export const projectState = ProjectState.getInstance();
