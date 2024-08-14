
// function to check if user is loggedin, redirect accordingly
function isAuthenticated(req, res, next){
    if(req.session.user){
        return next();
    }
    res.redirect('/login');
    // return next();
}

// same function as `isAuthenticated` but for login, registration and forgot-password page only
const checkLogin = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    res.redirect('/');
}

export {
    isAuthenticated,
    checkLogin
};