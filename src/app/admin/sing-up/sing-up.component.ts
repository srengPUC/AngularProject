import { Component, OnInit } from '@angular/core';
import { User } from  'firebase';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})

export class SingUPComponent implements OnInit {
  user: UserRegister;
  email = ''
  password = ''
  constructor(public  router:  Router) { }
  ngOnInit() {

  }
  
  singUp() {
    let userRegister: UserRegister = {
      email: this.email,
      password: this.password
    }
    localStorage.setItem('userLocal', JSON.stringify(userRegister));
    this.router.navigate(['contact']);
  }
}

export class UserRegister {
  email: string;
  password: string;
}