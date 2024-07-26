import url from 'url';
import path from 'path';
import fs from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
export const ROOT_DIR = path.dirname(__filename); 


export const return_page_views = (URI) =>{
    let requested_page_array = URI.split(/(\/)/).filter(Boolean);
    return requested_page_array.filter(part => part !== "/")
}


// Function to read file content
const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
};
  
  // Function to include HTML parts
export const renderViews = (page_data) => {
    // let page_data = {
    //     page: 'index.html',
    //     page_title: 'Home',
    //     page_css: [],
    //     page_scripts: [],
    // };
    const header = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'header.html'));
    const navbar = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'navbar.html'));
    const sidebar = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'sidebar.html'));
    const control_sidebar = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'control-sidebar.html'));
    const footer = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'footer.html'));
    const scripts = readFile(path.join(ROOT_DIR, 'views', 'layouts', 'scripts.html'));
    
    const content = readFile(path.join(ROOT_DIR, 'views', page_data.page));
    
    return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <title>${page_data.page_title}</title>
                ${header}
            </head>
            <body class="hold-transition sidebar-mini">
                <div class="wrapper">

                    ${navbar} ${sidebar} ${content} ${control_sidebar} ${footer}

                </div>

                ${scripts}
            </body>
        </html>`;
};




// default nodejs syntax
// module.exports = __dirname;
