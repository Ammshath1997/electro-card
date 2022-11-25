import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadServiceService } from 'src/app/services/image-upload-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap, tap } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  curentUser$ = this.userService.currentUserProfile$;
  frontViewImageInfo: any
  backViewImageInfo: any
  profileImageInfo: any

  userProfileForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
    photoURL: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    frontCardURL: new FormControl(''),
    backCardURL: new FormControl(''),
    companyCountryCode: new FormControl(''),
    companyName: new FormControl(''),
    position: new FormControl(''),
    workPhoneNumber: new FormControl(''),
    countryCode: new FormControl(''),
    companyAddress: new FormControl(''),
  });

  constructor(private authService: AuthenticationService,
    private uploadImageSerive: ImageUploadServiceService,
    private toast: HotToastService,
    private userService: UserService,
    private router: Router) { }


  ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(
      untilDestroyed(this), tap(console.log)
    ).subscribe((user) => {
      this.userProfileForm.patchValue({ ...user })
    })
  }

  uploadImage(file: any, uid: string) {
    this.uploadImageSerive
      .uploadImgae(file, `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((photoURL) =>
          this.userService.updateUser({
            uid,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  storeImageLocally(event: any, isFronCard: boolean) {
    if (isFronCard) {
      this.frontViewImageInfo = event.target.files[0];
    } else {
      this.backViewImageInfo = event.target.files[0];
    }
  }

  storeProfileImageLocally(event: any) {
    this.profileImageInfo = event.target.files[0];
  }

  uploadCardImage(fiile: any, uid: string, isFronCard: boolean) {
    if (isFronCard) {
      this.uploadImageSerive
        .uploadImgae(fiile, `images/profile/fcard/${uid}`)
        .pipe(
          this.toast.observe({
            loading: 'Uploading front view image...',
            success: 'Front view image uploaded successfully',
            error: 'There was an error in uploading the front view image',
          }),
          switchMap((frontCardURL) =>
            this.userService.updateUser({
              uid,
              frontCardURL,
            })
          )
        )
        .subscribe(() => this.frontViewImageInfo = {});
    } else {
      this.uploadImageSerive
        .uploadImgae(fiile, `images/profile/bcard/${uid}`)
        .pipe(
          this.toast.observe({
            loading: 'Uploading back view image...',
            success: 'Back view image uploaded successfully',
            error: 'There was an error in uploading the back view image',
          }),
          switchMap((backCardURL) =>
            this.userService.updateUser({
              uid,
              backCardURL,
            })
          )
        )
        .subscribe(() => this.backViewImageInfo = {});
    }
  }

  saveProfile() {
    const { uid, ...data } = this.userProfileForm.value;

    if (!uid) {
      return;
    }

    if (this.frontViewImageInfo) {
      this.uploadCardImage(this.frontViewImageInfo, uid, true)
    } else if (this.backViewImageInfo) {
      this.uploadCardImage(this.backViewImageInfo, uid, false)
    } else if (this.profileImageInfo) {
      this.uploadImage(this.profileImageInfo, uid)
    }

    this.userService
      .updateUser({ uid, ...data })
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();
  }

}
