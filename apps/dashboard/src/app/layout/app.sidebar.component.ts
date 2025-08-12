import { Component, ElementRef } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    constructor(public layoutService: LayoutService, public el: ElementRef, public router: Router) { }
     isCollapsed = false;
     id =localStorage.getItem('userId');
          studentId =localStorage.getItem('studentId');

     get isSidebarVisible() {
  if (this.layoutService.isDesktop()) {
    return !this.layoutService.state.staticMenuDesktopInactive;
  } else {
    return this.layoutService.state.staticMenuMobileActive;
  }}
         toggleSidebarState() {
    this.isCollapsed = !this.isCollapsed;
  } 
   logout(){
    localStorage.clear();
    window.location.href = '/login';
  }
  goToDashboard() {
  this.router.navigate(['/student-dashboard/', this.id]);
}
showRedeem() {
  this.router.navigate(['/refer-earn']);
}
ProfileMenu() {
  this.router.navigate(['/profile/', this.studentId]);
}
goToPlanGrow() {
  this.router.navigate(['/assessment/plans-grow', this.id]);
}

}

