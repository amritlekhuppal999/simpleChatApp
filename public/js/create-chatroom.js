

/*
    window.onload = ()=>{
        // Only one function can be assigned to the onload handler. Hence only the last definition will work.
        // Since I have window.onload defined elsewhere, this will not work
    }
*/

    $('#chatroom-privacy').selectpicker();


    document.getElementById('submit-btn').addEventListener('click', event=>{
        event.preventDefault();
        
        const chatroom_name = document.getElementById('chatroom-name');
        const chatroom_description = document.getElementById('chatroom-description');
        const chatroom_privacy = document.getElementById('chatroom-privacy');
        const csrf_token = document.getElementById('csrf_token');

        // <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        let submit_btn = document.getElementById("submit-btn");
        let submit_btn_cont = submit_btn.innerHTML;

        submit_btn.innerHTML = LOADER_SMALL;
        submit_btn.disabled = true;

        if(chatroom_name.value.length == 0){
            toastr.warning('Enter valid name');
            chatroom_name.focus();
            submit_btn.innerHTML = submit_btn_cont;
            submit_btn.disabled = false;
            return false;
        }

        if(chatroom_privacy.value == 0){
            toastr.warning("Privacy cannot be blank.");
            chatroom_privacy.focus();
            submit_btn.innerHTML = submit_btn_cont;
            submit_btn.disabled = false;
            return false;
        }

        CreateChatroom();

        async function CreateChatroom(){
            let form_data = {
                chatroom_name : chatroom_name.value,
                chatroom_description : chatroom_description.value,
                chatroom_privacy : chatroom_privacy.value,
                csrf_token: csrf_token.value
            };

            console.log(form_data);

            // return false;

            const request_options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_data)
            };

            let url = '/create-chatroom';

            try{
                let response = await fetch(url, request_options);
                // console.log(response);
                let response_data = await response.json();
                // console.log('Response:', response_data);
                if(response_data.error_code){
                    toastr.error(response_data.message);
                    submit_btn.innerHTML = submit_btn_cont;
                    submit_btn.disabled = false;
                }
                else {
                    toastr.success(response_data.message);
                    // submit_btn.innerHTML = submit_btn_cont;
                    submit_btn.remove(); 
                    // return false;
                    setTimeout(() => {
                        location.reload()
                        // window.location.href = home_url;
                    }, 1000);
                }
            }
            catch(error){
                console.error('Error:', error);
            }
        }
    });