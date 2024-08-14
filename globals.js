import url from 'url';
import path from 'path';
import fs from 'fs';

import bcrypt from 'bcrypt'; 
const saltRounds = 10;      // Number of rounds for salt generation

import dotenv from 'dotenv';
dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const ROOT_DIR = path.dirname(__filename);

// FROM .env file
const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const host = process.env.MONGO_HOST;
const mongo_port = process.env.MONGO_PORT;
const database_name = process.env.MONGO_DB;

// const encodedPassword = encodeURIComponent(password);
const DB_CONNECTION_STRING = `mongodb://${username}:${password}@${host}:${mongo_port}/?authSource=${database_name}`;


// get Hashed Password
    async function hashPassword(pswd_str, saltRounds=10){
        return await bcrypt.hash(pswd_str, saltRounds);
    }
// get Hashed Password END

// check Hashed Password
    async function checkHashedPassword(user_password, hashed_password){
        return await bcrypt.compare(user_password, hashed_password);
    }
// check Hashed Password END


// currently not in use
    const return_page_views = (URI) =>{
        let requested_page_array = URI.split(/(\/)/).filter(Boolean);
        return requested_page_array.filter(part => part !== "/")
    }
// currently not in use END

// Function to read file content
    const readFile = (filePath) => {
        return fs.readFileSync(filePath, 'utf8');
    };
// Function to read file content END    

// Function to include HTML parts
    const renderViews = (page_data) => {
        // let page_data = {
        //     page: 'index.html',
        //     page_title: 'Home',
        //     page_css: [],
        //     page_scripts: [],
        // };

        const LAYOUT = path.join(ROOT_DIR, 'views', 'layouts');

        const header = readFile(path.join(LAYOUT, 'header.html'));
        const navbar = readFile(path.join(LAYOUT, 'navbar.html'));
        const sidebar = readFile(path.join(LAYOUT, 'sidebar.html'));
        const control_sidebar = readFile(path.join(LAYOUT, 'control-sidebar.html'));
        const footer = readFile(path.join(LAYOUT, 'footer.html'));
        const scripts = readFile(path.join(LAYOUT, 'scripts.html'));
        
        const content = readFile(path.join(ROOT_DIR, 'views', page_data.page));

        let user_info_section = '';
        let csrf_token_ele = '';

        if(page_data.user_data){
            user_info_section = `
                <input type="hidden" id="user_id" value="${page_data.user_data.user_id}" />
                <input type="hidden" id="name" value="${page_data.user_data.name}" />
                <input type="hidden" id="user_email" value="${page_data.user_data.email}" />
            `;
        } 

        if(page_data.csrf_token){
            csrf_token_ele = `<input type="hidden" id="csrf_token" value="${page_data.csrf_token}" />`;
        } 
        
        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>${page_data.page_title}</title>
                    ${header}
                </head>
                <body class="hold-transition sidebar-mini layout-fixed">
                    ${user_info_section}
                    ${csrf_token_ele}
                    <div class="wrapper">

                        ${navbar} ${sidebar} 

                        ${content} 

                        ${control_sidebar} ${footer}

                    </div>

                    ${scripts}
                </body>
            </html>`;
    };
// Function to include HTML parts END

// Function to generate a CSRF token
    function generate_CSRF_Token(){
        return 'XABC123546';
    }
// Function to generate a CSRF token END

// function to return current time
    function currentTime(){
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
        // console.log(formattedTime);
    }
// function to return current time END    

// function to get current date
    function currentDate(){
        // Get the current date
        const now = new Date();

        // Extract day, month, and year
        const day = String(now.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed (0 = January, 11 = December)
        const year = now.getFullYear();

        // Format the date as day-month-year
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }
// function to get current date END

export {
    ROOT_DIR,
    database_name,
    DB_CONNECTION_STRING,
    hashPassword, checkHashedPassword,
    return_page_views,
    renderViews,
    generate_CSRF_Token,
    currentTime, currentDate
};
