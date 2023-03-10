import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number
  editMode = false;
  recipeForm: FormGroup

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.editMode = params['id'] != null //if is not null we are in edit mode so editMode = true
      this.initForm();
    })
  }


  private initForm() {    
    let recipeName = ''
    let imageUrl = ''
    let recipeDescription = ''
    let recipeIngredients = new FormArray([])

    if(this.editMode){
      const recipe = this.recipeService.getRecipeById(this.id)
      recipeName = recipe.name
      imageUrl = recipe.imagePath
      recipeDescription = recipe.description

      //si hay ingredientes en un recipe los mapeamos en el form array recipeIngredients
      if(recipe['ingredients']){
        recipe.ingredients.map(x=>{
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(x.name,  Validators.required),
            'amount': new FormControl(x.amount,  [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
        })
      }
    }
    
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imageUrl,  Validators.required),
      'description': new FormControl(recipeDescription,  Validators.required),
      'ingredients': recipeIngredients
    })
  }

  onSubmit(){
    /*const newRecipe = new Recipe(
      this.recipeForm.value.name, 
      this.recipeForm.value.description, 
      this.recipeForm.value.imagePath, 
      this.recipeForm.value.ingredients
      )*/

    if(this.editMode){
      this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    }else{
      this.recipeService.addRecipe(this.recipeForm.value)
    }
    this.onCancel()
    
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    )
  }

  get ingredientControls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls
  }

  onCancel(){
    this.router.navigate(['../'],{relativeTo: this.route})
  }

  onDeleteIngredient(index:number){
     (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }

}
