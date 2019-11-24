import { Injectable } from '@angular/core';
import { map, publishReplay, take, share } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserData } from '../../models/userData';
import { AuthProvider } from '../auth/auth';
import { COLLECTION, USER_TYPE } from '../../utils/consts';
import * as moment from 'moment'
import { Rating } from '../../models/rating';
import { Message } from '../../models/message';


@Injectable()
export class DataProvider {
  collectionName: any;
  dataCollection: AngularFirestoreCollection<User>;
  data$: Observable<User[]>;

  profile: User;
  KM: number = 1.60934;

  dummyUsers: any = [
    {
      nickname: "Mia Mommy Tee Low",
      id: 1,
      rating: "3.5",
      dob: "1991-02-22",
      gender: "female",
      race: "black",
      bodyType: "slim-thick",
      location: {
        address: "123 Arcadia, Pretoria",
        geo: {
          lat: -25.950187,
          lng: 28.998042
        }
      }
    },
    {
      nickname: "Kitty Mami",
      id: 2,
      rating: "4.5",
      dob: "1993-07-19",
      gender: "female",
      race: "black",
      bodyType: "thick",
      location: {
        address: "9090 Heart street, Menlyn, Pretoria",
        geo: {
          lat: -25.910187,
          lng: 28.998042
        }
      }
    },
    {
      nickname: "Queen Slay",
      id: 3,
      rating: "4",
      dob: "1993-07-18",
      gender: "female",
      race: "coloured",
      bodyType: "bbw",
      location: {
        address: "900 Sunnyside, Pretoria,",
        geo: {
          lat: -25.910187,
          lng: 28.898042
        }
      }
    },
    {
      nickname: "Mia Low",
      id: 4,
      rating: "4.8",
      dob: "1996-03-20",
      gender: "female",
      race: "indian",
      bodyType: "thick",
      location: {
        address: "891 Centurion, Pretoria",
        geo: {
          lat: -25.910187,
          lng: 28.698042
        }
      }
    },
    {
      nickname: "Sally Sea",
      id: 5,
      rating: "3.5",
      dob: "1990-12-24",
      gender: "female",
      race: "black",
      bodyType: "thick",
      location: {
        address: "123 Arcadia, Pretoria",
        geo: {
          lat: -25.610187,
          lng: 28.998042
        }
      }
    }
  ];
  private userDataSubject = new BehaviorSubject<UserData>(null);
  userData$ = this.userDataSubject.asObservable();
  userData: UserData = new UserData();

  openModal: boolean = false;
  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFirestore) {
  }

  removeDuplicates(array, key: string) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
    });
  }

  getUsers(): Observable<User[]> {
    return this.getAllFromCollection(COLLECTION.users);
  }

  getUserById(id): Observable<User> {
    return this.getItemById(COLLECTION.users, id);
  }

  getUserByIdPromise(id) {
    return this.getItemById(COLLECTION.users, id).toPromise();
  }


  getAllFromCollection(collectionName: string): Observable<any> {
    return this.afStore.collection<User>(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getMyCollection(collectionName: string, uid: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, !!uid ? ref => ref.where('uid', '==', uid) : null).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCollectionByKeyValuePair(collectionName: string, key: string, value: string): Observable<any> {
    return this.afStore.collection<any>(collectionName, ref => ref.where(key, '==', value)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  calculateRating(ratings: Rating[]): string {
    let totalRate = 0;
    ratings.forEach(r => {
      totalRate += +r.rating;
    });
    const rate = (totalRate / ratings.length).toFixed(2);
    return rate.toString();
  }

  // collection('messages').doc('ArESmCSW0qQHu6lxOgea0bMPEbA3').collection('nSqad6egH1OPvkXfnf2KoCDfrpk1')

  getChats(rootCollection: string, receiverUid: string, senderUid: string) {
    return this.afStore.collection(rootCollection).doc(receiverUid).collection(senderUid, ref => ref.orderBy('date')).valueChanges();
  }

  addNewMessage(rootCollection: string, receiverUid: string, senderUid: string, message: Message) {
    return this.afStore.collection(rootCollection).doc(receiverUid).collection(senderUid).add(message);
  }

  getDateTime(): string {
    return moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
  }

  getDateTimeMoment(dateTime): string {
    return moment(dateTime).fromNow();
  }

  getItemById(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).valueChanges();
  }

  updateItem(collectionName: string, data, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).set(data, { merge: true });
  }


  getCollectionId(collection, uid, rid) {
    return this.afStore.collection<any>(collection, ref => ref.where('uid', '==', uid).where('rid', '==', rid)).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
      ).toPromise();
  }

  findCollectionByUidAndRid(collection, uid, rid) {
    return this.afStore.collection<any>(collection, ref => ref.where('uid', '==', uid).where('rid', '==', rid)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllUsers(collection) {
    return this.afStore.collection<any>(collection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addNewItem(collectionName: string, data: any) {
    return this.afStore.collection(collectionName).add(data);
  }

  removeItem(collectionName: string, id: string) {
    return this.afStore.collection(collectionName).doc<any>(id).delete();
  }

  findItemById(id: string) {
    return this.getItemById(COLLECTION.users, id);
  }

  mapUsers(toBeMapped, users, type) {
    let userz = [];
    toBeMapped.map(r => {
      users.map(u => {
        if (type === 'uid') {
          if (r.rid === u.uid) {
            userz.push(Object.assign(u, { data: r }));
          }
        } else {
          if (r.uid === u.uid) {
            userz.push(Object.assign(u, { data: r }));
          }
        }
      })
    });
    return userz;
  }

  isSeller(user: User): boolean {
    return user.userType === USER_TYPE.seller;
  }

  getProfileKeyType(profile): string {
    return profile.userType === USER_TYPE.buyer ? 'rid' : 'uid';
  }
  // getDateInMilliseconds(): number {
  //   const today = new Date();
  //   return today.getTime();
  // }

  applyHaversine(jobs, lat, lng) {
    if (jobs && lat && lng) {
      let usersLocation = {
        lat: lat,
        lng: lng
      };
      jobs.map((job) => {
        let placeLocation = {
          lat: job.location.latitude,
          lng: job.location.longitude
        };
        job.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'miles'
        ).toFixed(0);
      });
      return jobs;
    } else {
      return jobs;
    }
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d * this.KM; //convert miles to km
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  /*  DATE FUNCTIONS */

  getAgeFromDate(date: string): string {
    return moment(date, "YYYY/MM/DD").month(0).from(moment().month(0)).split(" ")[0];
  }

  getNowDate(): string {
    return moment().format("YYYY/MM/DD");
  }


  getLocationFromGeo(geo) {
    const myLocation = {
      lat: -25.850187,
      lng: 28.998042
    };
    return this.getDistanceBetweenPoints(myLocation, geo, 'miles').toFixed(0);;
  }

}
