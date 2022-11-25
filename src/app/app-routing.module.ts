import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: "profile",
    component: ProfileComponent,
    ...canActivate(redirectToLogin)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
