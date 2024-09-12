// I will most probably end up using EXPRESS , UPDATE.. I did ;-)

// window.onload = ()=>{}

    
    // Your data
    let USER_DATA = {};
    // Guest Data
    let GUEST_USER_DATA = {};

    // Chatroom ID
    const CHAT_ROOM_ID = window.initialData.room_id;
    let CHAT_ROOM_NAME = null;

    adjustChatWindowHeight();
    getChatroomDetails();

// SOCKET EVENT HANDLERS

    const URL = "http://localhost:8000";
    //socket.connected
    // socket.connect();
    // socket.disconnect();

    // Gives access to the front end library of Socket.io
    // const socket = io();    // connects by default 
    const socket = io("/chatroom",{ autoConnect: false });  // connects when `socket.connect()` is hit

    // catch all events
    // socket.onAny((event, ...args)=>{
    //     console.log('Disable this in prod.\n', event, args);
    // });

    // When you connect
    socket.on('connect', ()=>{
        console.log("Connected to the chat server");
        // socket.emit('checkSession');
    });

    // What to do when session expires
    socket.on('sessionExpired', (response)=>{
        toastr.error(response);
        setTimeout(() => {
            location.reload();
        }, 2000);
    });

    // When you connect
    socket.on('new-connection', newConnection);

    // When someone else connects
    socket.on('new-user', newUser);

    // When you receive a text message
    socket.on('chat-response', chatResponse);

    // when someone disconnects
    socket.on('disconnect-message', userLeft);
    
    // get active users in a chatroom
    socket.on('joinedRoom', (response)=>{
        // event to fetch Active Users of a given chatroom
        socket.emit("fetchActiveUsers", response);
    });
    
    // get active users in a chatroom
    socket.on('getActiveUsers', displayActiveUsers);

    // Function When you connect
    function newConnection(response){
        USER_DATA = {...response};
        console.log('Your Data', USER_DATA)

        display_connection_msg({
            userName: response.username,
            text: response.metaData.connection_message,
            messageTimestamp: response.metaData.connection_timestamp,
        })

        toastr.success("You joined the chatroom")
    }
    // Function for When someone else connects
    function newUser(response){
        GUEST_USER_DATA = {...response};
        console.log('Guest Data', GUEST_USER_DATA);

        display_connection_msg({
            userName: response.username,
            text: response.metaData.connection_message,
            messageTimestamp: response.metaData.connection_timestamp,
        });

        socket.emit("fetchActiveUsers", response);

        toastr.info(`${response.username} joined the chat`)
    }
    // Function for When you receive a text message
    function chatResponse(response){
        // console.log(response);
        display_received_msg(response);
    }
    // Function for When a user disconnects
    function userLeft(response){
        // GUEST_USER_DATA = {...response};
        // console.log('Guest Data', GUEST_USER_DATA);

        display_connection_msg({
            userName: response.username,
            text: response.message,
            messageTimestamp: currentTime(),
        });

        toastr.warning(`${response.username} left the chat`)
    }
    // display users in a chatroom
    function displayActiveUsers(response){
        console.log(response)

        let list_UI = '';

        response.forEach(element => {
            let meta_data = element.metaData;
            let name = element.name;
            let username = element.username;
            let user_id = element.user_id;
            let user_img = element.user_img ? element.user_img : "/AdminLTE/dist/img/user1-128x128.jpg";

            list_UI += `
                <li>
                    <a href="#">
                        <img class="contacts-list-img" src="${user_img}">

                        <div class="contacts-list-info">
                            <span class="contacts-list-name">
                                ${name ? name : username}
                                <small class="contacts-list-date float-right">${meta_data.connection_timestamp}</small>
                            </span>
                            <span class="contacts-list-msg">
                                Lorem Ipsum
                            </span>
                        </div>
                    </a>
                </li>`;

        });
        
        document.getElementById("active-user-list").innerHTML = list_UI;
    }
// SOCKET EVENT HANDLERS END


// Other Important Functions    

    // document.getElementById("header-msgr-title").innerHTML = `Welcome to <b>Open</b> chatroom `;

    document.addEventListener('click', send_message);
    document.addEventListener('keyup', send_message);

    document.getElementById('join-chatroom-btn').addEventListener('click', startConnection);
    document.getElementById('leave-chatroom').addEventListener('click', endConnection);


    // function to START connection
    function startConnection(event){
        socket.connect();   // this triggers `newConnection(response)` method

        //JOIN CHATROOM
        socket.emit("joinRoom", CHAT_ROOM_NAME);
        
        // event to fetch Active Users of a given chatroom
        socket.emit("fetchActiveUsers", CHAT_ROOM_NAME);

        document.getElementById('join-chatroom-btn').hidden = true;
        document.getElementById('leave-chatroom').hidden = false;
        
        document.getElementById('chat-window').hidden = false;
        document.getElementById('chat-settings-window').hidden = true;

        // if(socket.connected){}
        // toastr.success("You joined the chatroom")

    }

    // function to END connection
    function endConnection(event){

        socket.emit("leaveRoom", CHAT_ROOM_NAME);
        socket.disconnect();

        document.getElementById('join-chatroom-btn').hidden = false;
        document.getElementById('leave-chatroom').hidden = true;

        document.getElementById('chat-window').hidden = true;
        document.getElementById('chat-settings-window').hidden = false;

        // if(socket.connected){}

        toastr.error("You left the chatroom")
    }

    // Send message to server/user
    function send_message(event){
        

        let element = event.target;
        if(element.id == "send-message" || element.id == "message-content"){
            event.preventDefault();

            // console.log(event.code, event.key);

            // If its a keyup event and its not the Enter key, return false
            if(event.type == "keyup" && event.key !== "Enter"){
                // console.log(event.type, event.key);
                return false;
            }

            let message_field = document.getElementById("message-content");
            let text_message = message_field.value;
            text_message = text_message.replace(/\s/g, " ");
            if(text_message.length == 0){
                message_field.focus();
                return false;
            }

            let message_body = {
                room_id: CHAT_ROOM_ID,
                room_name: CHAT_ROOM_NAME,
                userName: USER_DATA.username,
                text: text_message,
                messageTimestamp: currentTime()
            };
            message_field.value = "";
            
            socket.emit('chat-message', message_body);
            display_sent_msg(message_body);
        }

    }

    // Display message received (RIGHT) in msg view 
    function display_received_msg(message_body){
        const message_stream = document.getElementById("message-view");
        const DIV = document.createElement('div');
        DIV.classList.add("direct-chat-msg");
        
        let ui = `
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-left">${message_body.userName}</span>
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

    // Display message sent (LEFT) in msg view 
    function display_sent_msg(message_body){
        const message_stream = document.getElementById("message-view");
        const DIV = document.createElement('div');
        DIV.classList.add("direct-chat-msg", "right");

        let ui = `
            <div class="direct-chat-infos clearfix">
                <span class="direct-chat-name float-right">${message_body.userName}</span>
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

    // Show notification message when a user connects
    function display_connection_msg(message_body){
        const message_stream = document.getElementById("message-view");
        const DIV = document.createElement('div');
        DIV.classList.add("direct-chat-msg");
        
        let ui = `
            <div class="direct-chat-text"
                style="margin: 5px 0 0 0; width:max-content;">
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

    // adjusts the chat window height as per screen size...
    function adjustChatWindowHeight(){
        let screenHeight = window.screen.height;
        let chatWindowEle = document.getElementById('message-view');

        chatWindowEle.style.height = '58vh';
        if(screenHeight >= 1080){
            chatWindowEle.style.height = '72vh';
        }
    }

    // fetch chatroom details from DATABASE
    async function getChatroomDetails(){

        const chatroom_join_btn = document.getElementById('join-chatroom-btn');
        const chatroom_settings_btn = document.getElementById('chatroom-settings-btn');
        
        const chatroom_name_field = document.getElementById('chatroom-name-field');
        chatroom_name_field.innerHTML = LOADER_SMALL;


        chatroom_join_btn.disabled = true;
        chatroom_settings_btn.disabled = true;

        const request_options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify({
            //     room_id: window.initialData.room_id
            // })
        };

        // let url = '/get-chatroom-details?room_id='+CHAT_ROOM_ID;
        let url = '/get-chatroom-details/'+CHAT_ROOM_ID;

        try{
            let response = await fetch(url, request_options);
            // console.log(response);
            let response_data = await response.json();
            // console.log('Response:', response_data);
            if(response_data.error_code){
                toastr.error(response_data.message);
                chatroom_name_field.innerHTML = LOADER_SMALL;
            }
            else {
                // toastr.success(response_data.message);
                let chatroom_name = response_data.data.chatroom_data.name;
                chatroom_name_field.innerHTML = chatroom_name;
                CHAT_ROOM_NAME = chatroom_name;

                chatroom_join_btn.disabled = false;
                chatroom_settings_btn.disabled = false;
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }

// Other Important Functions END

    






    

    // console.log(window.initialData.room_id);









// UI CREDITS
    console.log("UI from:", "\nhttps://adminlte.io/");
// UI CREDITS END
    
