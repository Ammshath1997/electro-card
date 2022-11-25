import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { SignupComponent } from './signup/signup.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './../components/profile/profile.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: AuthLayoutComponent, ...canActivate(redirectToHome) },
      { path: 'signup', component: SignupComponent, ...canActivate(redirectToHome) },
      { path: 'verification', component: VerificationComponent, ...canActivate(redirectToHome) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
