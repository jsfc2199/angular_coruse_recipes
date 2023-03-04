import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe/recipe.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],

})
export class RecipesComponent implements OnInit {

  constructor(private recipeService: RecipeService) { }

  selectedRecipe: Recipe;

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    })
  }
}
