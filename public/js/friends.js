
    // identifies the timer created by the call to setTimeout() 
    var timeoutID = null;

    var friends_chat_status = [];
    var chatbox_open = false;

    if(document.getElementById("load-more-friends")){
        // LoadFriendList();
        document.getElementById("load-more-friends").addEventListener('click', event=>{
            let search_keyword = document.getElementById("search-friend-bar").value;
            if(search_keyword.length > 0){
                LoadFriendList(search_keyword);
            }
            else LoadFriendList();
        });
    }

    // Search Bar Event
    if(document.getElementById("search-friend-bar")){
        // LoadFriendList();
        document.getElementById("search-friend-bar").addEventListener('keyup', event=>{
            let search_keyword = document.getElementById("search-friend-bar").value;
            
            // setting pages to 0 so that when we hit load more for more of the search_keyword result, it does not skip
            document.getElementById('friends-page-counter').value = 0;

            if(timeoutID)
                clearTimeout(timeoutID);
    
            timeoutID = setTimeout(() => {
                SearchFriends(search_keyword);
            }, 700);
        });
    }
    
    // Click EVENT LISTENER on fiends section
    // document.getElementById('friends-section').addEventListener('click', event=>{
    //     let element = event.target;
        
    //     // To Launch Chat Window
    //     if(element.className.includes("launch-chat")){
    //         event.preventDefault();
    //         // alert(element.dataset.id);

    //         // if(!friends_chat_status[element.dataset.id] || !friends_chat_status[element.dataset.id].chatbox_open){}

    //         friends_chat_status[element.dataset.id] = {
    //             chatbox_open: true
    //         }
            
    //         let friend_data = {
    //             user_id: element.dataset.id,
    //             name: element.dataset.name
    //         };

    //         launch_chat(friend_data);
    //     } 
    //     // else alert("poye");
    // });

    document.getElementById('friends-section').addEventListener('click', event=>{
        let element = event.target;
        
        // To Launch Chat Window
        if(element.className.includes("launch-chat")){
            event.preventDefault();
            // alert(element.dataset.id);

            if(!friends_chat_status[element.dataset.id] || !friends_chat_status[element.dataset.id].chatbox_status.active){

                friends_chat_status[element.dataset.id] = {
                    chatbox_status: {
                        active: true,      // is it visible on screen
                        expanded: true,    // is it collapsed
                        collapsed: false,   // is it expanded
                    }
                }
                
                let friend_data = {
                    user_id: element.dataset.id,
                    name: element.dataset.name
                };
    
                launch_chat(friend_data);
            }

            
        } 
        // else alert("poye");
    });

    
    LoadFriendList();

    async function LoadFriendList(){

        let friends_list_ele = document.getElementById('friends-section');
        let page_counter = parseInt(document.getElementById('friends-page-counter').value);

        let search_keyword = '';
        if(document.getElementById("search-friend-bar")){
            search_keyword = document.getElementById("search-friend-bar").value
        }

        let search_parameter = {
            page_counter: page_counter,
            search_keyword: search_keyword
        }

        try{
            let response_data = await FetchFriendListData(search_parameter);

            if(!response_data.error_code){
                response_data.data.friend_data.map((element, index)=>{
                    let LI_ele = document.createElement('LI');

                    LI_ele.innerHTML = ` 
                        <img
                            class="launch-chat"
                            data-id="${element._id}"
                            data-name="${element.name}" 
                            src="${element.profile_picture_url}" 
                            alt="User Image" height=128 width=128
                        />
                        <a class="users-list-name" href="/profile/${element._id}">${element.name}</a>
                        <!-- <span class="users-list-date">Today</span> -->`;

                    friends_list_ele.appendChild(LI_ele);

                    LI_ele.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });

                document.getElementById('friends-page-counter').value = ++page_counter;
            }
            else {
                friends_list_ele.innerHTML = `<h3>${response_data.message}</h3>`;
                if(response_data.error_code === 3) {
                    toastr.info(response_data.message);
                }

                else console.error("Unable to load Friend List ");
            }
        }
        catch(error){
            console.error('Error:', error);
        }

    }


    // show search friends result
    async function SearchFriends(search_keyword){

        let friends_list_ele = document.getElementById('friends-section');
        friends_list_ele.innerHTML = 'Loading...';

        let page_counter = parseInt(document.getElementById('friends-page-counter').value);

        let search_parameter = {
            page_counter: page_counter,
            search_keyword: search_keyword
        }
        
        // console.log(search_parameter)

        try{
            let response_data = await FetchFriendListData(search_parameter);
            
            if(!response_data.error_code){
                friends_list_ele.innerHTML = '';
                
                response_data.data.friend_data.map((element, index)=>{
                    // console.log(index, element);
                    let LI_ele = document.createElement('LI');

                    LI_ele.innerHTML = ` 
                        <img 
                            class="launch-chat"
                            data-id="${element._id}"
                            data-name="${element.name}"
                            src="${element.profile_picture_url}" 
                            alt="User Image" height=128 width=128 
                        />
                        <a class="users-list-name" href="/profile/${element._id}">${element.name}</a>
                        <!-- <span class="users-list-date">Today</span> -->`;

                    friends_list_ele.appendChild(LI_ele);

                    LI_ele.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });

                document.getElementById('friends-page-counter').value = ++page_counter;
            }
            else {
                // toastr.error(response_data.message);
                console.error("Unable to load Friend List ");
                friends_list_ele.innerHTML = '<h3>No friends available with this name</h3>';
            }
        }
        catch(error){
            console.error('Error:', error);
        }

    }

    async function FetchFriendListData(search_parameter){
        let page_counter = search_parameter.page_counter;
        let search_keyword = search_parameter.search_keyword;

        let url = `/get-friend-list/${page_counter}`;

        // search_keyword
        if(search_keyword.length > 0){
            url += `/${search_keyword}`;
        }

        const request_options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(form_data)
        };

        try{
            let response = await fetch(url, request_options);
            let response_data = await response.json();

            return response_data;   // will be returned inside a promise
        }
        catch(error){
            console.error('Error:', error);
            return null;
        }
    }


    // async function disp(){
    //     let res = await getChatWindowTEmplate();
    //     console.log(res.data);
    //     let div_ele = document.createElement("div");
    //     div_ele.innerHTML = res.data.chat_window;
    //     document.getElementById("load-chat-window-section").appendChild(div_ele)
    // }
    // disp();

    // launch chat window for friend
    async function launch_chat(friend_data){
        let res = await getChatWindowTEmplate(friend_data);
        // console.log(res.data);
        let div_ele = document.createElement("div");
        div_ele.innerHTML = res.data.chat_window;
        document.getElementById("load-chat-window-section").appendChild(div_ele);
        // document.getElementById("load-chat-window-section").innerHTML = res.data.chat_window;
        chatbox_open = true;
    }








    // function collapse_all_chat(avoid_window_id){
    //     let chatBoxes = document.getElementsByClassName("friend-chat-window");
    //     for(let i=0; i<chatBoxes.length; i++){
    //         let element = chatBoxes[i];
    //         if(element.dataset_friend_user_id == avoid_window_id){
    //             continue;
    //         }

    //         //minimize-btn
    //         console.log(element.getElementsByClassName("minimize-btn")[0]);
    //         let minimize_btn = element.getElementsByClassName("minimize-btn");
    //         minimize_btn[0].click();
    //     }
    // }

    // function close_open_chat_window(){
    //     if(chatbox_open){
    //         let chatBoxes = document.getElementsByClassName("friend-chat-window")[0];
    //         let close_btn = chatBoxes.getElementsByClassName("close-btn")[0];
    //         close_btn.click();
            
    //         // Reset the FLAGS
    //         chatbox_open = false;
    //         friends_chat_status = [];
    //         // let minimize_btn = element.getElementsByClassName("minimize-btn")[0];
    //     }
    // }
