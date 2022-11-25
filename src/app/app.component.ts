import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user$ = this.userService.currentUserProfile$;

  constructor(private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUserProfile$.subscribe()
  }

  logOut() {
    this.authService.logout().pipe(
      this.toast.observe({
        success: "Logged out in sucessfully",
        loading: "Logging out...",
        error: "Login out faild. please try again"
      })
    ).subscribe((response) => {
      this.router.navigate(['/login']);
    })
  }

}
