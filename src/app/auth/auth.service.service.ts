import { Injectable, NgZone } from  '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from  'firebase';
import { UserRegister } from '../policy.model'

@Injectable({
    providedIn:  'root'
})
export  class  AuthService {
    isLogout: boolean = true
    user: User;
    userData: any; // Save logged in user data
    public afs: AngularFirestore;  // Inject Firestore service
    public ngZone: NgZone

    constructor(public  afAuth:  AngularFireAuth, public  router:  Router) { 
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          localStorage.setItem('user', null);
        }
      })
    }

    async  login(email:  string, password:  string) {
      let userLocal = JSON.parse(localStorage.getItem('userLocal'))
      if (email == userLocal.email && password == userLocal.password){
        this.isLogout = false
        await this.router.navigate(['contact']);
      } else {
        try {
          await  this.afAuth.auth.signInWithEmailAndPassword(email, password)
          this.router.navigate(['policy']);
        
      } catch (e) {
          alert("Error!"  +  e.message);
      }
      }
      }

      async logout(){
        await this.afAuth.auth.signOut();
        localStorage.removeItem('user');
        // localStorage.removeItem('userLocal');
        this.isLogout = true
        this.router.navigate(['admin/login']);
    }

    get isLoggedIn(): boolean {
      const  user  =  JSON.parse(localStorage.getItem('user'));
      return  user  !==  null;
    }

    get isLoggedInLocal(): boolean {
      const  userLocal  =  JSON.parse(localStorage.getItem('userLocal'));
      if (this.isLogout) {
        return false;
      } else {
        return userLocal !== null
      }
      
    }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: UserRegister = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }
}