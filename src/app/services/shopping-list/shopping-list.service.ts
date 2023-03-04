import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditin = new Subject<number>();

  constructor() { }

  private ingredients: Ingredient[] = [
    new Ingredient("strawberry", 20),
    new Ingredient("banana", 30)
  ]

  getIngredient(id: number){
    return this.ingredients[id]
  }

  getIngredients(){
    return this.ingredients.slice()
  }

  addIngredients(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredientsSL(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  updateIngredient(id:number , newIngredient: Ingredient){
    this.ingredients[id]  = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(id:number){
    this.ingredients.splice(id,1);
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
