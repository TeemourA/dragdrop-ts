import Component from './base-component';
import { validate, Validatable } from '../utils/validation';
import { projectState } from '../state/project-state';
import { Autobind } from '../decorators/autobind';

export default class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescrpition = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidation: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidation: Validatable = {
      value: enteredDescrpition,
      required: true,
      minLength: 5,
    };

    const peopleValidation: Validatable = {
      value: Number(enteredPeople),
      required: true,
      min: 1,
      max: 5,
    };

    if (
      validate(titleValidation) &&
      validate(descriptionValidation) &&
      validate(peopleValidation)
    ) {
      return [enteredTitle, enteredDescrpition, Number(enteredPeople)];
    } else {
      alert('Please fill all form fields!');
      return;
    }
  }

  private clearForm() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearForm();
    }
  }
}
