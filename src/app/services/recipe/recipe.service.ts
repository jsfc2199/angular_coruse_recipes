import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from 'src/app/recipes/recipe.model';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanges = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) { }

  private recipes: Recipe[] = []

  recipeSelected = new Subject<Recipe>();

  //in otder to override the onces that we have for the onces that are in the back
  setRecipes(recipes:Recipe[]){
    this.recipes = recipes;
    this.recipesChanges.next(this.recipes.slice())
  }

  getRecipes(){
    return this.recipes.slice(); //this returns a new array which is an exact copy of the on in this service file
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]){
    this.shoppingListService.addIngredientsSL(ingredients)
  }

  getRecipeById(id: number){
    return this.recipes[id]
  }

  addRecipe(recipes:Recipe){
    this.recipes.push(recipes);
    this.recipesChanges.next(this.recipes.slice())
  }

  updateRecipe(id:number, newRecipe:Recipe){
    this.recipes[id] = newRecipe
    this.recipesChanges.next(this.recipes.slice())
  }

  deleteRecipe(id:number){
    this.recipes.splice(id,1)
    this.recipesChanges.next(this.recipes.slice())
  }


}
