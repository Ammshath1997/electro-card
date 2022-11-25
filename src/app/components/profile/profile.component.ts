import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadServiceService } from 'src/app/services/image-upload-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  curentUser$ = this.userService.currentUserProfile$;
  @ViewChild('inputField') input: ElementRef<HTMLInputElement>;
  navLinks: any = [
    {
      icon: "person",
      label: "my details",
      index: 0
    },
    {
      icon: "settings",
      label: "settings",
      index: 1
    },
    {
      icon: "vpn_key",
      label: "security",
      index: 2
    },
    {
      icon: "notifications",
      label: "announcement",
      index: 3
    },
  ]
  currentTab: number = 1;


  constructor(private authService: AuthenticationService,
    private toast: HotToastService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
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

  swicthTabs(index: number) {
    this.currentTab = index;
  }
}
