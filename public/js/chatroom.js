// I will most probably end up using EXPRESS , UPDATE.. I did ;-)


    adjustChatWindowHeight();

    // Your data
    let client_initialization_data = {};
    // Guest Data
    let guest_initialization_data = {};
    

// SOCKET EVENT HANDLERS

    const URL = "http://localhost:8000";
    //socket.connected
    // socket.connect();
    // socket.disconnect();

    // Gives access to the front end library of Socket.io
    const socket = io(); // connected by default or establishes connection as page loads up.
    // const socket = io({ autoConnect: false });
    /*
        autoConnect is set to false so the connection is not established right away. 
        We will manually call socket.connect() later, once the user has selected a username.

        // const socket = io(URL, { autoConnect: false }); // This an incorrect code?? 
    */

    // When you connect
    socket.on('new-connection', newConnection);

    // When someone else connects
    socket.on('new-user', newUser);

    // When you receive a text message
    socket.on('chat-response', chatResponse);

    
    // Function When you connect
    function newConnection(response){
        client_initialization_data = {...response};
        console.log('Your Data', client_initialization_data)

        display_connection_msg({
            userName: response.userInfo.userName,
            text: response.metaData.connection_message,
            messageTimestamp: response.metaData.connection_timestamp,
        })
    }
    // Function for When someone else connects
    function newUser(response){
        guest_initialization_data = {...response};
        console.log('Guest Data', guest_initialization_data);

        display_connection_msg({
            userName: response.userInfo.userName,
            text: response.metaData.connection_message,
            messageTimestamp: response.metaData.connection_timestamp,
        });
    }
    // Function for When you receive a text message
    function chatResponse(response){
        // console.log(response);
        display_received_msg(response);
    }

// SOCKET EVENT HANDLERS END



// Other Important Functions    

    document.getElementById("header-msgr-title").innerHTML = `Welcome to your chatroom `;

    document.addEventListener('click', send_message);
    document.addEventListener('keyup', send_message);

    // Send message to server/user
    function send_message(event){
        

        let element = event.target;
        if(element.id == "send-message" || element.id == "message-content"){
            event.preventDefault();

            // console.log(event.code, event.key);

            // If its a keyup event and its not the Enter key, return false
            if(event.type == "keyup" && event.key !== "Enter"){
                console.log(event.type, event.key);
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
                userName: client_initialization_data.userInfo.userName,
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

        chatWindowEle.style.height = '51vh';
        if(screenHeight >= 1080){
            chatWindowEle.style.height = '67vh';
        }
    }

// Other Important Functions END


// UI CREDITS
    console.log("UI from:", "\nhttps://adminlte.io/");
// UI CREDITS END
    
