import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeSubscription: Subscription

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipeSubscription = this.recipeService.recipesChanges.subscribe((recipe:Recipe[])=>{
      this.recipes = recipe;
    })
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route}) //we can use the relative route because we are now in the /recipes
  }

    
  ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }
}
