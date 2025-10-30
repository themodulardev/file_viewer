import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Implement your authentication logic here
  const isAuthenticated = true; // Replace with real authentication check

  if (!isAuthenticated) {
    // Redirect to login or show an error
    console.log('Access denied. Users must be authenticated to access this route.');
  }
  return isAuthenticated;
};
