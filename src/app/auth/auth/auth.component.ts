import { Component, ComponentFactoryResolver, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { AuthResponseData, AuthService } from './auth.service';
import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router, private componentFactory: ComponentFactoryResolver) { }


  ngOnInit(): void {
  }

  isLoginMode = true;
  isLoading = false;
  error:string = null;

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    if(!form.valid){
      return
    }
    
    const email = form.value.email
    const password = form.value.password

    let authObservable: Observable <AuthResponseData>;   

    this.isLoading = true

    if(this.isLoginMode){
      authObservable = this.authService.login(email, password)
    }else{
      authObservable = this.authService.signUp(email, password)
    }

    authObservable.subscribe({
      next: (resData) => {
        console.log(resData)
        this.isLoading = false
        this.router.navigate(['/recipes'])
      },
      error: (errorMessage)=>{
        console.log(errorMessage)
        this.error = errorMessage  
        this.showErrorAlert(errorMessage)        
        this.isLoading = false
      }
    });

    form.reset()    
  }

  onHandleError(){
    console.log('si hace click');
    
    this.error = null
  }

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective
  private closeSub: Subscription

  private showErrorAlert(error:string){
    //here we crete the alert
    const alertComponentFactory = this.componentFactory.resolveComponentFactory(AlertComponent) //this retuns just a factory

    //we store a reference of the viewContainerRef in a const (but is not neccessary)
    const hostViewContainer = this.alertHost.viewContainerRef

    //we clear everything that might be rendered before
    hostViewContainer.clear()

    //using the factory to create the alert and w store the component to make then the data and event bindings
    const componentRef = hostViewContainer.createComponent(alertComponentFactory)

    componentRef.instance.message = error //this is working for the message child
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainer.clear(); //clear all the content that has been rendered
    })

  }

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
