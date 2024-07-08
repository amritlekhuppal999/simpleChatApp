// I will most probably end up using EXPRESS 

    const URL = "http://localhost:8000";

    // Gives access to the front end library of Socket.io
    // const socket = io();
    // const socket = io(URL, { autoConnect: false });
    const socket = io({ autoConnect: false });
    /*
        autoConnect is set to false so the connection is not established right away. 
        We will manually call socket.connect() later, once the user has selected a username.
    */

    socket.on('new-connection', response=>{
        console.log(response)
    });

    socket.on('chat-response', response_message_body=>{
        // console.log(response_message_body)
        // add_response_message(response_message_body)
        console.log(response_message_body);
        display_message(response_message_body, "received");
    });


    socket.on('new-user', response_message_body=>{
        // console.log(response_message_body)
        // add_response_message(response_message_body)
        console.log(response_message_body);
        alert(response_message_body.id+" has joined the chat");
    });
    ////////////////////////////////////////////////////////


    let userName = prompt("Please enetr your name:");
    if(userName == null || userName.length == 0){
        userName = "User";
    }

    document.getElementById("header-msgr-title").innerHTML = `Welcome to your chatroom ${userName}`;

    document.addEventListener('click', (event)=>{
        let element = event.target;
        if(element.id == "send-message"){
            event.preventDefault();
            let message_field = document.getElementById("message-content");
            let text_message = message_field.value;
            text_message = text_message.replace(/\s/g, " ");
            if(text_message.length == 0){
                message_field.focus();
                return false;
            }

            let message_body = {
                text: text_message,
                userName: userName,
                time: "00:00"
            };
            send_message(message_body);
            message_field.value = "";
        }
    });

    // message_body = {
    //     text: '',
    //     media: {}
    // }; // we will use just text for now

    function send_message(message_body){
        socket.emit('chat-message', message_body);
        display_message(message_body, "sent");
    }

    // adds message text to the message stream window
    function display_message(message_body, display_type="sent"){
        
        // CHAT VIEW
        const message_stream = document.getElementById("message-view");
        
        // CHAT BOX FIELD
        let message_field = document.createElement('div');
        message_field.classList.add("msg");
        
        // CHAT BUBBLE
        let message_bubble = document.createElement('div');
        message_bubble.classList.add("msg-bubble");
        
        // MESSAGE INFO
        let message_info = document.createElement('div');
        message_info.classList.add("msg-info");

        // MESSAGE INFO NAME
        let message_info_name = document.createElement('div');
        message_info_name.classList.add("msg-info-name");
        let nameContent = document.createTextNode(message_body.userName);
        message_info_name.appendChild(nameContent);

        // MESSAGE INFO TIME
        let message_info_time = document.createElement('div');
        message_info_time.classList.add("msg-info-time");
        let timeContent = document.createTextNode(message_body.time);
        message_info_time.appendChild(timeContent);

        // MESSAGE TEXT CONTENT
        let message_text = document.createElement('div');
        message_text.classList.add("msg-text");
        let textContent = document.createTextNode(message_body.text);
        message_text.appendChild(textContent);
        
        message_info.appendChild(message_info_name);
        message_info.appendChild(message_info_time);
        
        message_bubble.appendChild(message_info);
        message_bubble.appendChild(message_text);

        message_field.appendChild(message_bubble);
        
        
        message_stream.appendChild(message_field);

        if(display_type == "sent"){
            message_field.classList.add("right-msg");
        }
        else if(display_type == "received"){
            message_field.classList.add("left-msg");
        }
        // else {}
    }
    
    // UI CREDITS
    console.log("UI taken from:", "\nhttps://codepen.io/sajadhsm/pen/odaBdd");
