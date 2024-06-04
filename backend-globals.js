import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
export const ROOT_DIR = path.dirname(__filename); 


export const return_page_views = (URI) =>{
    let requested_page_array = URI.split(/(\/)/).filter(Boolean);
    return requested_page_array.filter(part => part !== "/")
}




// default nodejs syntax
// module.exports = __dirname;
