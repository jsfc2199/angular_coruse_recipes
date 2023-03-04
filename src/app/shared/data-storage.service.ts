import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../services/recipe/recipe.service";
import { Recipe } from "src/app/recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://ingredient-project-d3cd0-default-rtdb.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    //the take allows to take just value of this observable, with the 1 we said we want just have the data but only once
    //and this take maes the unscruption immediately
    //the we use exhaustMap in order to use like a lot of subscriptions, and in ths way we can use inside this the get method too
    return this.http
      .get(
        "https://ingredient-project-d3cd0-default-rtdb.firebaseio.com/recipes.json"
      )
      .pipe(
        map((recipes: Recipe[]) => {
          return recipes.map((recipe) => {
            console.log(recipe);

            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            }; //if there is not ingredients y set them to an empty array
          });
        }),
        tap((recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        })
      );

    /*return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        //we return a new observable, this stat with the user observable and once this finished, the inner observable is the one that turns in the current
        //observable
        return this.http.get(
          "https://ingredient-project-d3cd0-default-rtdb.firebaseio.com/recipes.json", 
          {
            params: new HttpParams().set('auth',user.token)
          }
        );
      }),
      map((recipes: Recipe[]) => {
        return recipes.map((recipe) => {
            console.log(recipe);
            
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          }; //if there is not ingredients y set them to an empty array
        });
      }),
      tap((recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      })
    );*/

    /*return this.http.get('https://ingredient-project-d3cd0-default-rtdb.firebaseio.com/recipes.json')
        .pipe(map((recipes: Recipe[]) => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []}//if there is not ingredients y set them to an empty array
            })
        }), tap((recipes: Recipe[]) => {
            this.recipeService.setRecipes(recipes);
        }))*/

    /**.subscribe((recipes: Recipe[]) => {
           
        })*/
  }
}
