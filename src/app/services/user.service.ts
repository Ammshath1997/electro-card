import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ProfileUser } from '../models/user-profile';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { query } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  // Get all users for the chat search
   get allUsers$(): Observable<ProfileUser[]>{
    const ref = collection (this.firestore,'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }

  constructor(private firestore: Firestore,
    private authService: AuthenticationService) { }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
