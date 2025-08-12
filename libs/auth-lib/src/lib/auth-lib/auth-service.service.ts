import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public isUserLoggedIn = new BehaviorSubject(false);

  constructor(private keyclockService: KeycloakService) { }

  async logout() {
    await this.keyclockService.logout();
    this.isUserLoggedIn.next(false);
    localStorage.clear();
  }

  public isLoggedIn(): boolean {
    return this.keyclockService.isLoggedIn();
  }
}
