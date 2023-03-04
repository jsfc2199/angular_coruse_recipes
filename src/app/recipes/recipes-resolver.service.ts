import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RecipeService } from "../services/recipe/recipe.service";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService){}

    //the resolver susbscribes automaticly once there is information to set
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipeService.getRecipes()
        if(recipes.length === 0){
            return this.dataStorageService.fetchRecipes()
        }else{
            return recipes
        }        
    }    
}