import { Component, Input, OnInit } from '@angular/core';
import { ProfileUser } from 'src/app/models/user-profile';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  @Input('curentUser') curentUser: ProfileUser | null

  constructor() { }

  ngOnInit(): void {
  }

}
