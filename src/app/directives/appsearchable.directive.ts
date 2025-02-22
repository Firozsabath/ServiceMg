import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAppsearchable]'
})
export class AppsearchableDirective {

  @Input() options: string[] = [];
  @Input() filteredOptions: string[] = []; // Reference to the dropdown

  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOptions.length = 0;
    //const filteredOptions = this.options.filter(option => option.toLowerCase().includes(filterValue));
    this.filteredOptions.push(...this.options.filter(option => option.toLowerCase().includes(filterValue)));
  }
}
