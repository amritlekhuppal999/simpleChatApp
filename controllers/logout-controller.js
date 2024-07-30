

// Logout Controller
export default function Logout(client_request, server_response){
    client_request.session.destroy(()=>{
        console.log("logging out...");
        server_response.redirect('login');
    });
}