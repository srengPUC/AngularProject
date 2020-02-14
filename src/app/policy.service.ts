import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Policy } from './policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private firestore: AngularFirestore) { }

  getPolicies() {
    return this.firestore.collection('policies').snapshotChanges();
  }

  async createPolicy(policy: Policy){
    const reponse = await this.firestore.collection('policies').add(policy);
    this.firestore.collection("policies").doc(reponse.id).update({ "id": this.firestore.collection("policies").doc(reponse.id).ref.id });
  }

  updatePolicy(policy: Policy){
    // delete policy.id;
    this.firestore.doc('policies/' + policy.id).update(policy);
  }

  deletePolicy(policyId: string){
    this.firestore.doc('policies/' + policyId).delete();
  }
}
