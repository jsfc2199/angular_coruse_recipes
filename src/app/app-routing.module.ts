import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }, //this works for old angular versions    
    { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' },
    { path: 'auth', loadChildren: './auth/auth/auth.module#AuthModule' }, //this works for old angular versions    


    /* {
         path: 'recipes',
         loadChildren: () => import('./recipes/recipes.module')
             .then(module => module.RecipesModule)
     } //this works for the new versions*/
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}