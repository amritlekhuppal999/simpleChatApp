

    document.getElementById("load-more-friends").addEventListener('click', event=>{
        LoadFriendList();
    });
    
    LoadFriendList();

    async function LoadFriendList(){

        let friends_list_ele = document.getElementById('friends-section');
        let page_counter = parseInt(document.getElementById('friends-page-counter').value);

        const request_options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(form_data)
        };

        let url = `/get-friend-list/${page_counter}`;

        try{
            let response = await fetch(url, request_options);
            // console.log(response);
            let response_data = await response.json();
            // console.log('Response:', response_data);

            if(!response_data.error_code){
                // toastr.success(response_data.message);
                response_data.data.friend_data.map((element, index)=>{
                    // console.log(index, element);
                    let LI_ele = document.createElement('LI');

                    LI_ele.innerHTML = ` <img src="${element.profile_picture_url}" alt="User Image" height=128 width=128>
                        <a class="users-list-name" href="/user/${element._id}">${element.name}</a>
                        <!-- <span class="users-list-date">Today</span> -->`;

                    friends_list_ele.appendChild(LI_ele);

                    LI_ele.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });

                document.getElementById('friends-page-counter').value = ++page_counter;
            }
            else {
                // toastr.error(response_data.message);
                console.error("Unable to load Friend List ");
                if(response_data.error_code === 3) {
                    toastr.error(response_data.message);
                }
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }
