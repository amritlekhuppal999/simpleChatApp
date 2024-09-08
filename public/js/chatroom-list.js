/*
        _id: new ObjectId('66bd4882c060fa688d58156c'),
        name: 'Another Chatroom',
        description: 'Just another chatroom',
        privacy: '2',
        admin_id: [ '66b272c0ee0f086c8fab2642' ],
        member_id: [ '66b272c0ee0f086c8fab2642' ],
        status: 'active',
        date_created: '15-08-2024
    */

    // Load more records (Manual Lazy Loading )
    document.getElementById("load-more-result-btn").addEventListener('click', event=>{
        LoadAvailableChatrooms();
    });
    
    
    LoadAvailableChatrooms();
    
    // loads available chatrooms 
    async function LoadAvailableChatrooms(){

        let available_chatroom_list_ele = document.getElementById('available-chatrooms-section');
        let page_counter = parseInt(document.getElementById('page-counter').value);

        const request_options = {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(form_data)
        };

        let url = `/get-available-chatroom-list/${page_counter}`;

        try{
            let response = await fetch(url, request_options);
            // console.log(response);
            let response_data = await response.json();
            // console.log('Response:', response_data);

            if(!response_data.error_code){
                // toastr.success(response_data.message);
                response_data.data.chatroom_data.map((element, index)=>{
                    // console.log(index, element);
                    let DIV_ele = document.createElement('div');
                    DIV_ele.classList.add("callout");
                    DIV_ele.classList.add("callout-success");

                    let collapse_btn = `<div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>`;
                    collapse_btn = '';

                    ``;

                    DIV_ele.innerHTML = ` <h5> 
                            <a href="/chatroom/${element._id}"> ${element.name} </a> 
                        </h5>
                        <p>${element.description}</p>`;

                    available_chatroom_list_ele.appendChild(DIV_ele);

                    DIV_ele.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });

                document.getElementById('page-counter').value = ++page_counter;
            }
            else {
                // toastr.error(response_data.message);
                console.error("Unable to load Available Chatroom ");
                if(response_data.error_code === 3) {
                    toastr.error(response_data.message);
                }
            }
        }
        catch(error){
            console.error('Error:', error);
        }
    }
