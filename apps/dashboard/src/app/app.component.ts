// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Component, HostListener, OnDestroy, Renderer2, ViewChild } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { filter, Subscription } from 'rxjs';
// import { LayoutService } from "./layout/service/app.layout.service";
// import { AppSidebarComponent } from './layout/app.sidebar.component';
// import { AppTopBarComponent } from './layout/app.topbar.component';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })

// export class AppComponent implements OnDestroy {

    
//   title = 'dashboard';

//   overlayMenuOpenSubscription: Subscription;

//   menuOutsideClickListener: any;

//   profileMenuOutsideClickListener: any;

//   @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

//   @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

//   constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router) {
//     sessionStorage.setItem("activeSession", "true");

//       this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
//           if (!this.menuOutsideClickListener) {
//               this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
//                   const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target) 
//                       || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
                  
//                   if (isOutsideClicked) {
//                       this.hideMenu();
//                   }
//               });
//           }

//           if (!this.profileMenuOutsideClickListener) {
//               this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
//                   const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
//                       || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

//                   if (isOutsideClicked) {
//                       this.hideProfileMenu();
//                   }
//               });
//           }

//           if (this.layoutService.state.staticMenuMobileActive) {
//               this.blockBodyScroll();
//           }
//       });

//       this.router.events.pipe(filter(event => event instanceof NavigationEnd))
//           .subscribe(() => {
//               this.hideMenu();
//               this.hideProfileMenu();
//           });
//   }
//  isSidebarOpen =false;
//   showLayout = true;

//   toggleSidebar() {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }
//   hideMenu() {
//       this.layoutService.state.overlayMenuActive = false;
//       this.layoutService.state.staticMenuMobileActive = false;
//       this.layoutService.state.menuHoverActive = false;
//       if (this.menuOutsideClickListener) {
//           this.menuOutsideClickListener();
//           this.menuOutsideClickListener = null;
//       }
//       this.unblockBodyScroll();
//   }

//   hideProfileMenu() {
//       this.layoutService.state.profileSidebarVisible = false;
//       if (this.profileMenuOutsideClickListener) {
//           this.profileMenuOutsideClickListener();
//           this.profileMenuOutsideClickListener = null;
//       }
//   }

//   blockBodyScroll(): void {
//       if (document.body.classList) {
//           document.body.classList.add('blocked-scroll');
//       }
//       else {
//           document.body.className += ' blocked-scroll';
//       }
//   }

//   unblockBodyScroll(): void {
//       if (document.body.classList) {
//           document.body.classList.remove('blocked-scroll');
//       }
//       else {
//           document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
//               'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
//       }
//   }

//   get containerClass() {
//       return {
//           'layout-theme-light': this.layoutService.config().colorScheme === 'light',
//           'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
//           'layout-overlay': this.layoutService.config().menuMode === 'overlay',
//           'layout-static': this.layoutService.config().menuMode === 'static',
//           'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
//           'layout-overlay-active': this.layoutService.state.overlayMenuActive,
//           'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
//           'p-input-filled': this.layoutService.config().inputStyle === 'filled',
//           'p-ripple-disabled': !this.layoutService.config().ripple
//       }
//   }
  

//   //code for hiding the layout when on login and register page
//   ngOnInit(): void {
//   this.router.events
//     .pipe(filter(event => event instanceof NavigationEnd))
//     .subscribe((event: NavigationEnd) => {
//       const currentUrl = event.urlAfterRedirects;

//       const hideFullLayout =
//         currentUrl.includes('/login') ||
//         currentUrl.includes('/register') ||
//         currentUrl.includes('/forget-password') ||
//       //  currentUrl.includes('assessment/payment') ||
//        this.isAssessmentDetailPage(currentUrl);

//       this.showLayout = !hideFullLayout;
//     });
// }

//   private isAssessmentDetailPage(url: string): boolean {
//   // Matches URLs like /assessment/{UUID}
//   const regex = /^\/assessment\/[0-9a-fA-F\-]{36}$/;
//   return regex.test(url);
// }
//   ngOnDestroy() {
//       if (this.overlayMenuOpenSubscription) {
//           this.overlayMenuOpenSubscription.unsubscribe();
//       }

//       if (this.menuOutsideClickListener) {
//           this.menuOutsideClickListener();
//       }
//   }
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from "./layout/service/app.layout.service";
import { AppSidebarComponent } from './layout/app.sidebar.component';
import { AppTopBarComponent } from './layout/app.topbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {

  title = 'dashboard';

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router) {
    sessionStorage.setItem("activeSession", "true");

    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
            || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
            || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideProfileMenu();
          }
        });
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
        this.hideProfileMenu();
      });
  }

  isSidebarOpen = false;
  showLayout = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;

    // Add/remove overlay behavior on small screens
    if (window.innerWidth <= 1200) {
      if (this.isSidebarOpen) {
        document.body.classList.add('sidebar-open');
        this.blockBodyScroll();
      } else {
        document.body.classList.remove('sidebar-open');
        this.unblockBodyScroll();
      }
    }
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
    document.body.classList.remove('sidebar-open'); // Ensure sidebar overlay is removed
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
        'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;

        const hideFullLayout =
          currentUrl.includes('/login') ||
          currentUrl.includes('/register') ||
          currentUrl.includes('/forget-password') ||
                    currentUrl.includes('/detailed-report') ||
                    currentUrl.includes('/payment') ||

          this.isAssessmentDetailPage(currentUrl);

        this.showLayout = !hideFullLayout;

        // Remove sidebar overlay if layout is hidden
        if (!this.showLayout) {
          document.body.classList.remove('sidebar-open');
          this.unblockBodyScroll();
        }
      });
  }

  private isAssessmentDetailPage(url: string): boolean {
    // Matches URLs like /assessment/{UUID}
    const regex = /^\/assessment\/[0-9a-fA-F\-]{36}$/;
    return regex.test(url);
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}

