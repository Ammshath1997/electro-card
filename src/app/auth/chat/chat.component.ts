import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Message } from 'src/app/models/chat';
import { ProfileUser } from 'src/app/models/user-profile';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
  export class ChatComponent implements OnInit {
    @ViewChild('endOfChat')
    endOfChat!: ElementRef;

    user$ =this.usersService.currentUserProfile$;
    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');
    //Fire base connection
    users$ = combineLatest([this.usersService.allUsers$, this.user$, this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
      map(([users, user,searchString]) =>users.filter(u => u.displayName?.toLowerCase().includes(searchString.toLowerCase()) && u.uid !== user?.uid )));
   
  myChats$ = this.chatsService.myChats$;
  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges, this.myChats$
  ]).pipe(map(([value, chats]) => chats.find(c => c.id === value[0])))
     
  messages$ = this.chatListControl.valueChanges.pipe(
    map(value => value[0]),
    switchMap(chatId => this.chatsService.getChatMessages$(chatId)),
    tap(() =>{
      this.scrollToBottom
    })
  );
    constructor(private usersService: UserService, private chatsService: ChatsService){}
    ngOnInit(): void {}

      createChat(otherUser : ProfileUser){
      this.chatsService.isExistingChat(otherUser?.uid).pipe(
        switchMap(chatId => {
          if (chatId){
              return this.chatsService.createChat(otherUser);
          }else{
          return of(chatId);  
          }
        })
      ).subscribe(chatId =>{
        this.chatListControl.setValue([chatId]);
      })   
    }

    sendMessage (){
      const message =this.messageControl.value;
      const selectedChatId = this.chatListControl.value[0];

      if (message && selectedChatId){
        this.chatsService.addChatMessage(selectedChatId,message).subscribe(() =>{
          this.scrollToBottom();
        });
        this.messageControl.setValue('');
      }
    }

    scrollToBottom(){
      setTimeout(() => {
        if(this.endOfChat){
          this.endOfChat.nativeElement.scrollIntoView({behavior: "smooth"})
        }
      }, 100);
  }
}
