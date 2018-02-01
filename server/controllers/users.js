var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var jwtDecode = require('jwt-decode');

module.exports = {

    create: function(req, res) {
        console.log("this is Post Data", req.body)
        var user = new User ({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            picture:req.body.picture,
            zipcode:req.body.zipcode
        })
        console.log(user);
        user.save(req.body, function(err, data){
            if (err) {
                console.log("err",err);
                res.json({ message: "error retrieving Users", err: err });
            } else if (data) {
                console.log("data",data)
                const token = jwt.sign({userId: data._id}, config.secret, {expiresIn: '24h'});
                res.json({ message: "Success", data: isMatch, token: token, user: {username: data.name} })
            }
        })
    },

    viewOne: function(req, res) {
        console.log("this is the id", req.params.id)
        User.find({ _id: req.params.id }, function(err, data) {
            if (err) {
                console.log(err);
                res.json({ status: false, err: err });
            } else if (data) {
                res.json({ status: true, data: data })
            }
        })
    },

    update: function(req, res) {
        console.log("This is the update data", req.body);
        User.update({ _id: req.params.id }, req.body, function(err, data) {
            if (err) {
                console.log(err);
                res.json({ message: "error retrieving quotes", err: err });
            } else if (data) {
                res.json({ message: "Success", data: data })
            }
        })
    },

    login: function(req, res){
        console.log("login", req.body);
        User.findOne({email: req.body.email}, function(err, data){
            if (err) {
                console.log(err);
                res.json({ message: "error retrieving quotes", err: err });
            } else {
                data.comparePassword(req.body.password, function(isMatch){
                    if(!isMatch){
                        console.log(isMatch);
                        res.json({ message: "error retrieving quotes", err: isMatch });
                    }
                    else{
                        console.log(isMatch);
                        const token = jwt.sign({userId: data._id}, config.secret, {expiresIn: '24h'});
                        res.json({ message: "Success", data: isMatch, token: token, user: {username: data.name} })
                    }
                })
            }
        })
    },

    decoded: function(req, res){
        console.log(req.params)
        var decoded = jwtDecode(req.params.token);
        console.log(decoded);
        res.json({id:decoded.userId})
    }

}