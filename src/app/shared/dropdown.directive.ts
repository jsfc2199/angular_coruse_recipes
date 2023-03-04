import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor() { }

  //we are going to add certain some css styles that is going to be added with click and also disabled with the click event
  @HostBinding('class.open') isOpen = false //class is an array of all the classes
  
  @HostListener('click') toggleOpen(){
    this.isOpen = !this.isOpen;
  }

}
