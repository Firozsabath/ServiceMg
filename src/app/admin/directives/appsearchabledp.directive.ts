import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appAppsearchabledp]'
})
export class AppsearchabledpDirective {

  @Input() items: any[] = [];               // Generic array of objects
  @Input() filterProperty: string = 'name';  // The property to filter on (default to 'name')
  @Output() filteredItems: EventEmitter<any[]> = new EventEmitter<any[]>(); // Emit filtered array

  constructor() {}

  // Listen for input events and filter the array
  @HostListener('input', ['$event']) onInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    const filtered = this.items.filter(item => 
      item[this.filterProperty].toLowerCase().includes(searchTerm)
    );
    this.filteredItems.emit(filtered);  // Emit the filtered items to the component
  }

}
