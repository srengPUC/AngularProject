import { Component, OnInit } from '@angular/core';
import { PolicyService } from '../policy.service';
import { Policy } from '../policy.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  policies: Policy[];

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

}
