import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from 'src/app/services/shopping-list/shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  constructor(private shoppingListService: ShoppingListService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  @ViewChild('form') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  edditedItem: Ingredient;

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditin.subscribe((id: number)=>{
      this.editMode = true;
      this.editedItemIndex = id;
      this.edditedItem = this.shoppingListService.getIngredient(id);
      this.shoppingListForm.setValue({
        name: this.edditedItem.name,
        amount: this.edditedItem.amount
      })
    });
  }

  onSubmit(form: NgForm){
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount) 
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      
    }else{
      this.shoppingListService.addIngredients(newIngredient)
    }   
    this.editMode = false;
    form.resetForm()
  }

  onClear(){
    this.editMode = false;
    this.shoppingListForm.resetForm()
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex),
    this.onClear();    
  }

}
