

export default function isAuthenticated(req, res, next){
    if(req.session.user){
        // return next();
    }
    // res.redirect('/login');
    return next();
}