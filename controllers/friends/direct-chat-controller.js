import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';




async function getDirectChatComponent(requested, response){
    
    // const client = new MongoClient(DB_CONNECTION_STRING);

    const user_id = requested.session.user.user_id;

    let friend_user_id = requested.body.friend_user_id;
    let friend_name = requested.body.friend_name;
    // console.log(requested.body, requested.body.friend_user_id);

    // Received MSG DialogueBox
    let left_msg_dialogue = `
        <div class="direct-chat-msg">
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-left">Alexander Pierce</span>
                <span class="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
            </div>
            
            <img class="direct-chat-img" src="/AdminLTE/dist/img/user1-128x128.jpg" alt="message user image">
            
            <div class="direct-chat-text">
                Is this template really for free? That's unbelievable!
            </div>
        </div>`;
    left_msg_dialogue = '';

    // Sent MSG DialogueBox
    let right_msg_dialogue = `
        <div class="direct-chat-msg right">
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-right">Sarah Bullock</span>
                <span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>
            </div>
            
            <img class="direct-chat-img" src="/AdminLTE/dist/img/user3-128x128.jpg" alt="message user image">
            
            <div class="direct-chat-text">
                You better believe it!
            </div>
        </div>`;
    right_msg_dialogue = '';


    // Chat Window Template String
    const chat_window_template = `
        <!-- DIRECT CHAT -->
        <div class="card card-primary direct-chat direct-chat-warning friend-chat-window" 
            data-friend_user_id="${friend_user_id}" 
            style=" width: 28vw;" >
            
            <!-- card header -->
            <div class="card-header">
                <h3 class="card-title">${friend_name}</h3>

                <div class="card-tools">
                    <span data-toggle="tooltip" title="3 New Messages" class="badge badge-warning">3</span>
                    
                    <button type="button" class="btn btn-tool minimize-btn" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>

                    <!-- <button type="button" class="btn btn-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
                        <i class="fas fa-comments"></i>
                    </button> -->
                    
                    <button type="button" class="btn btn-tool close-btn" data-card-widget="remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- card body -->
            <div class="card-body" style="height:47vh;">
                
                <!-- Conversations are loaded here -->
                <div class="direct-chat-messages direct-chat-msg" id="" style="height:47vh">
                
                    <!-- Message. Default to the left (Sender) -->
                    ${left_msg_dialogue}
                    
                    <!-- Message to the right (Receiver)-->
                    ${right_msg_dialogue}
                </div>
            </div>
            
            <!-- card footer -->
            <div class="card-footer">
                <form action="#" method="post" class="send-msg-form friend-chat-form" data-friend_user_id="${friend_user_id}">
                    <div class="input-group">

                        <input 
                            type="hidden"
                            name="friend-user-id"
                            class="friend-user-id"
                            value="${friend_user_id}"
                        />

                        <input 
                            type="hidden"
                            name="friend-name"
                            class="friend-name"
                            value="${friend_name}"
                        />
                        
                        <input 
                            type="text" 
                            name="message" 
                            placeholder="Type Message ..." 
                            class="form-control friend-message-content"
                            data-friend_user_id="${friend_user_id}"
                        />

                        <span class="input-group-append">
                            <button 
                                type="submit" 
                                class="btn btn-primary send-friend-msg-btn" 
                                data-friend_user_id="${friend_user_id}">
                                Send
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>`;

    response.send({
        message: '',
        error_code: 0,
        data: {
            chat_window: chat_window_template, 
            record_count: null
        },
        redirect: false,
        page: ''
    });
}

export{
    getDirectChatComponent
}