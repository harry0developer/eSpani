import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { DataProvider } from '../../providers/data/data';
import { AuthProvider } from '../../providers/auth/auth';
import { COLLECTION, USER_TYPE } from '../../utils/consts';
import { Message } from '../../models/message';
import { Requester } from '../../models/requester';
import { FeedbackProvider } from '../../providers/feedback/feedback';



@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: User;
  profile: User;

  chatData: any[] = [];
  message: string;

  isNewUser: boolean = false;
  requesterData: Requester = {
    uid: '',
    rid: '',
    date: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public authProvider: AuthProvider,
    public feedbackProvider: FeedbackProvider,
  ) { }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.profile = this.navParams.get('profile');
    this.feedbackProvider.presentLoading();
    const senderId = this.profile.userType === USER_TYPE.buyer ? this.profile.uid : this.user.uid;
    const receiverId = this.profile.userType === USER_TYPE.buyer ? this.user.uid : this.profile.uid;
    this.dataProvider.getChats(COLLECTION.messages, receiverId, senderId).subscribe(messages => {
      this.feedbackProvider.dismissLoading();
      if (messages.length > 0) {
        this.chatData = this.buildChats(messages);
      } else {
        this.isNewUser = true;
      }
    }, err => {
      this.feedbackProvider.dismissLoading();
    });

  }

  buildChats(messages) {
    const chatData = [];
    messages.forEach(message => {
      const user = this.profile.uid === message.sid ? this.profile : this.user;
      chatData.push(Object.assign({}, { message }, { user }))
    });
    return chatData;
  }

  sentByMe(chat) {
    return chat.user && chat.user.uid === this.profile.uid;
  }

  sendMessage() {

    const messageData: Message = {
      uid: this.user.uid,
      sid: this.profile.uid,
      message: this.message,
      date: this.dataProvider.getDateTime(),
      isRead: false
    }

    this.message = '';
    this.dataProvider.addNewMessage(COLLECTION.messages, messageData.uid, messageData.sid, messageData).then(() => {
      if (this.isNewUser) {
        this.requesterData = {
          uid: this.user.uid,
          rid: this.profile.uid,
          date: this.dataProvider.getDateTime()
        }
        this.dataProvider.addNewItem(COLLECTION.requesters, this.requesterData).then(() => {
          console.log('New requester added');
          this.isNewUser = false;
        }).catch(err => {
          console.log('Error adding requester');
        });
      }
    }).catch(err => {
      console.log('Error sending message', err);
    })
  }

}
