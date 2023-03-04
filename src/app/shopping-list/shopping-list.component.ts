import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs-compat';
import { ShoppingListService } from '../services/shopping-list/shopping-list.service';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];

  ingretiendsChangedSubscrition: Subscription
  constructor(private shoppingListService: ShoppingListService) { }


  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients()
    this.ingretiendsChangedSubscrition = this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients
    })
  }

  ngOnDestroy(): void {
    this.ingretiendsChangedSubscrition.unsubscribe()
  }

  onEditItem(id: number){
    this.shoppingListService.startedEditin.next(id)
  }

}
