
window.onload = ()=>{
    
    
    // console.log(window.initialData);
    
    document.getElementById("user-name").innerText = window.initialData.name

    
    LoadChatroomList();
    
    // chatrooms list in the sidebar
    async function LoadChatroomList(){

        let chatroom_list_ele = document.getElementById('chatroom-ul-ele');

        const request_options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(form_data)
        };

        let url = '/get-chatroom-list';

        try{
            let response = await fetch(url, request_options);
            // console.log(response);
            let response_data = await response.json();
            // console.log('Response:', response_data);

            if(!response_data.error_code){
                // toastr.success(response_data.message);
                response_data.data.chatroom_data.map((element, index)=>{
                    // console.log(index, element);
                    let LI_ele = document.createElement('li');
                    LI_ele.classList.add("nav-item");
                    LI_ele.innerHTML = `
                        <a href="/chatroom/${element._id}" class="nav-link">
                            <i class="fas fa-comment-dots nav-icon"></i>
                            <p>${element.name}</p>
                        </a>`;

                    chatroom_list_ele.appendChild(LI_ele);
                });
            }
            else {
                // toastr.error(response_data.message);
                console.error("Unable to load Chatroom list");
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }


    document.addEventListener('click', send_message);
    
    
    
    const privateChat_io = io("/privateChat");

    // When you connect
    privateChat_io.on('connect', ()=>{
        console.log("You are online.");
        // privateChat_io.emit('checkSession');
    });


    // What to do when session expires
    privateChat_io.on('sessionExpired', (response)=>{
        toastr.error(response);
        setTimeout(() => {
            location.reload();
        }, 2000);
    });



    // When you receive a text message
    privateChat_io.on('chat-response', chatResponse);

    // Function for When you receive a text message
    function chatResponse(response){
        // console.log(response);
        display_received_msg(response);
    }


    // Send message to server/user
    function send_message(event){
        

        let element = event.target;
        if(element.id == "send-friend-msg-btn" || element.id == "friend-message-content"){
            event.preventDefault();

            // console.log(event.code, event.key);

            // If its a keyup event and its not the Enter key, return false
            if(event.type == "keyup" && event.key !== "Enter"){
                // console.log(event.type, event.key);
                return false;
            }

            let message_field = document.getElementById("friend-message-content");
            let text_message = message_field.value;
            text_message = text_message.replace(/\s/g, " ");
            if(text_message.length == 0){
                message_field.focus();
                return false;
            }

            let message_body = {
                from:{
                    name: window.initialData.name,
                    id: window.initialData.user_id,
                },
                to:{
                    id: document.getElementById("friend-user-id").value,
                    name: '',
                },
                text: text_message,
                messageTimestamp: currentTime()
            };
            message_field.value = "";
            
            privateChat_io.emit('chat-message', message_body);
            display_sent_msg(message_body);
        }

    }


    // Display message sent (LEFT) in msg view 
    function display_sent_msg(message_body){
        const message_stream = document.getElementById("direct-chat-msg");
        const DIV = document.createElement('div');
        DIV.classList.add("direct-chat-msg", "right");

        let ui = `
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-right">${message_body.from.name}</span>
            </div>
            
            <img class="direct-chat-img" src="/AdminLTE/dist/img/user3-128x128.jpg" alt="message user image">
            
            <div 
                class="direct-chat-text" 
                style="margin-left:auto; 
                        width:max-content;
                        max-width:45%;
                        background-color: #005c4b;
                        border-color:#005c4b;">
                ${message_body.text}

                <span 
                    class="direct-chat-timestamp fs_smaller" 
                    style="display:block; color:white;"> 
                    <small>${message_body.messageTimestamp}</small>
                </span>
            </div>`;

        DIV.innerHTML = ui;
        message_stream.appendChild(DIV);
        DIV.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    // Display message received (RIGHT) in msg view 
    function display_received_msg(message_body){

        // check for correct chat-window
        let chat_window = document.getElementsByClassName("friend-chat-window")[0];
        if(chat_window.dataset.friend_user_id !== message_body.from.id){
            
            return false;

            // 
        }


        const message_stream = document.getElementById("direct-chat-msg");
        const DIV = document.createElement('div');
        DIV.classList.add("direct-chat-msg");
        
        let ui = `
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-left">${message_body.from.name}</span>
            </div>
            
            <img class="direct-chat-img" src="/AdminLTE/dist/img/user1-128x128.jpg" alt="message user image">
            
            <div 
                class="direct-chat-text" 
                style="width:max-content; 
                        max-width:45%;
                        background-color: #202c33;
                        border-color:#202c33;
                        color:white;">
                ${message_body.text}

                <span 
                    class="direct-chat-timestamp fs_smaller" 
                    style="display:block;"> 
                    <small>${message_body.messageTimestamp}</small>
                </span>
            </div>`;

        DIV.innerHTML = ui;
        message_stream.appendChild(DIV);
        DIV.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    
}