import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
    declarations: [AuthComponent],
    imports: [
        FormsModule, 
        CommonModule,
        RouterModule.forChild([
            {path: '', component: AuthComponent}
        ]),
        SharedModule
    ]
})
export class AuthModule{ }