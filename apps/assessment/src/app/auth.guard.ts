import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token'); // Adjust to your shared auth method

  if (isLoggedIn) {
  const currentUrl = window.location.href;
  const studentId = localStorage.getItem('studentId');

  if (studentId) {
    // Replace UUID with actual studentId
    const updatedUrl = currentUrl.replace(/\/payment\/[^/?]+/, `/payment/${studentId}`);

    // Only redirect if the URL actually changes
    if (updatedUrl !== currentUrl) {
      window.location.href = updatedUrl;
      return false; // Stop further routing
    }
  }

  return true; // Allow routing if no redirect is needed

} else {
  const currentUrl = window.location.href;
  localStorage.setItem('redirectAfterLogin', currentUrl);

    window.location.href = '/login';
  return false;
}
  }
}
