import { Component, Input } from '@angular/core';

@Component({
	selector: 'av-button',
	templateUrl: './av-button.component.html',
	styles: ['button{margin: 0.5rem!important;}']
})
export class AvButtonComponent {
  @Input() label: string;
  @Input() type: string;
  @Input() icon: string;
	@Input() disabled = false;

	constructor() { }

}
