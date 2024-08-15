

window.onload = ()=>{

    let chatroom_list_ele = document.getElementById('chatroom-ul-ele');

    LoadChatrooms();

    async function LoadChatrooms(){
        // let form_data = {
        //     chatroom_name : chatroom_name.value,
        //     chatroom_description : chatroom_description.value,
        //     chatroom_privacy : chatroom_privacy.value,
        //     csrf_token: csrf_token.value
        // };

        // console.log(form_data);

        // return false;

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

}