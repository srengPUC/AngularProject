import { Component, OnInit } from '@angular/core';
import { PolicyService } from '../policy.service';
import { Policy } from '../policy.model';
import { identity } from 'rxjs';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})

export class PolicyListComponent implements OnInit {
  private policies: Policy[];
  private privatemodelPolicy: Policy;
  private phoneNumber = '';
  private name = '';
  private address = '';
  private id = '';

  titleButton = 'Add';
  titleCancelEdit = 'Cancel';
  private isHiddenCancelButton = true;
  private isEdit = false;

  userName = JSON.parse(localStorage.getItem('user')).email;
  constructor(private policyService: PolicyService) { }

  ngOnInit() {
    this.policyService.getPolicies().subscribe(data => {
      this.policies = data.map(e => {
        console.log("===>>> ", e)
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Policy;
      })
    });
  }

  create() {
    if (this.name && this.phoneNumber && this.address != '') {
      
      if (this.isEdit) {
        let modelPolicy: Policy = {
          id: this.id,
          policyUserName: this.name,
          policyNumber: this.phoneNumber,
          policyAddress: this.address
        }
        this.policyService.updatePolicy(modelPolicy);
        this.isEdit = false;
        this.isHiddenCancelButton = true;
        this.titleButton = 'Add';   
      } else {
        let modelPolicy: Policy = {
          id: String(identity.toString),
          policyUserName: this.name,
          policyNumber: this.phoneNumber,
          policyAddress: this.address
        }
        this.policyService.createPolicy(modelPolicy)
      }
      this.address = ''
      this.name = ''
      this.phoneNumber = ''
      this.id = ''
    } 
  }

  update(policy: Policy) {
    this.policyService.updatePolicy(policy);
  }

  delete(id: string) {
    this.policyService.deletePolicy(id);
  }

  edit(id: string, name: string, phoneNumber: string, address: string) {
    this.isEdit = true
    this.isHiddenCancelButton = false;
    this.titleButton = 'Update'
    this.id = id
    this.name = name
    this.phoneNumber = phoneNumber
    this.address = address
  }

  cancelEdit() {
    this.isEdit = false;
    this.isHiddenCancelButton = true;
    this.titleButton = 'Add';
    this.address = ''
    this.name = ''
    this.phoneNumber = ''
    this.id = ''
  }
}