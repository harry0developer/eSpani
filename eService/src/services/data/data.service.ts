import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'src/models/user';
import { Job } from 'src/models/job';
// import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<Job | User>;
  data$: Observable<any[]>;

  readonly USERS_COLLECTION = 'users';
  readonly JOBS_COLLECTION = 'jobs';

  constructor(public afStore: AngularFirestore) {
    // this.collectionName = collectionName;
    // this.dataCollection = afStore.collection<Job>(collectionName);

    // this.data$ = this.dataCollection.snapshotChanges().pipe(
    //   map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   })
    // );
  }

  // getAllItems(): Observable<Job[] | User[]> {
  //   return this.data$;
  // }

  getCollection(collectionName: string, uid?: string) {
    return this.afStore.collection<Job>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // getCollection(collectionName: string, uid?: string) {
  //   return this.afStore.collection<Job>(collectionName).snapshotChanges().pipe(
  //     map(actions => {
  //       return actions.map(a => {
  //         const data = a.payload.doc.data();
  //         const id = a.payload.doc.id;
  //         return { id, ...data };
  //       });
  //     })
  //   );
  // }

  getItemById(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<Job | User>(id).valueChanges();
  }

  updateItem(collectionName: string, data: User | Job, id: string) {
    console.log(collectionName);
    console.log(data);
    console.log(id);

    return this.afStore.collection(collectionName).doc<Job | User>(id).update(data);
  }

  addItem(collectionName: string, data: User | Job, id: string) {
    return this.afStore.collection(collectionName).doc<Job | User>(id).set(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<Job | User>(id).delete();
  }

  // updateItem(data: User | Job, id: string) {
  //   return this.dataCollection.doc(id).update(data);
  // }

  // addItem(data: User | Job) {
  //   return this.dataCollection.add(data);
  // }

  // removeItem(id) {
  //   return this.dataCollection.doc(id).delete();
}

  //  ref = firebase.firestore().collection('jobs');

  // constructor(public afs: AngularFirestore) { }

  // getJobs(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.ref.onSnapshot((querySnapshot) => {
  //       const jobs = [];
  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data();
  //         jobs.push({
  //           jid: doc.id,
  //           title: data.title,
  //           description: data.description,
  //           uid: data.uid
  //         });
  //       });
  //       observer.next(jobs);
  //     });
  //   });
  // }

  // getJob(id: string): Observable<any> {
  //   return new Observable((observer) => {
  //     this.ref.doc(id).get().then((doc) => {
  //       const data = doc.data();
  //       observer.next({
  //         jid: doc.id,
  //         title: data.title,
  //         description: data.description,
  //         uid: data.uid
  //       });
  //     });
  //   });
  // }

  // postJobs(data): Observable<any> {
  //   return new Observable((observer) => {
  //     this.ref.add(data).then((doc) => {
  //       observer.next({
  //         jid: doc.id,
  //       });
  //     });
  //   });
  // }

  // updateJobs(id: string, data): Observable<any> {
  //   return new Observable((observer) => {
  //     this.ref.doc(id).set(data).then(() => {
  //       observer.next();
  //     });
  //   });
  // }

  // deleteJobs(id: string): Observable<{}> {
  //   return new Observable((observer) => {
  //     this.ref.doc(id).delete().then(() => {
  //       observer.next();
  //     });
  //   });
  // }
