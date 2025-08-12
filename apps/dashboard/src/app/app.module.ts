import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { StyleClassModule } from 'primeng/styleclass';
import { AppLayoutModule } from './layout/app.layout.module';
import { AppConfigModule } from './layout/config/config.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'external',
        clientId: 'angular-client',
      },
      initOptions: {
        checkLoginIframe: false,
        onLoad: 'login-required', // 'login-required' , 'check-sso'
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
      enableBearerInterceptor: true,
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    StyleClassModule,
    KeycloakAngularModule,
    AppLayoutModule,
    AppConfigModule,
    ReactiveFormsModule,
    DropdownModule,
    PanelModule,
  ],
  providers: [
    MessageService,
    //   {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
