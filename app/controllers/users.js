/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');


/**
 * Logout
 */
exports.signout = function(req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    res.send({
        status:'success',
        data:{
            message:'You have been logged out successfully'
        }
    });
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var message = null;

    var user = db.User.build(req.body);

    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
    
    user.save().then(function(){
      req.login(user, function(err){
        if(err) return next(err);
        res.send({status:'success', data:{
            message:'Your account has been created'
        }});
      });
    }).catch(function(err){
        res.send({status:'error', data:{
            message:'Your account could not be created'
        }});
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp({status:'success', data:{
        user:req.user || null
    }});
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.find({where : { id: id }}).then(function(user){
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    }).catch(function(err){
      next(err);
    });
};
