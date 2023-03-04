import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  constructor(private dataStorage: DataStorageService, private authService: AuthService){}
   
  private userSubscription: Subscription
  isAuthenticated: boolean = false

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;      
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

  onSaveRecipes(){
    this.dataStorage.storeRecipes()
  }

  onFetchRecipes(){
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }
  
}
