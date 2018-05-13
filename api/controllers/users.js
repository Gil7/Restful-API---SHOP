const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.users_get_users = (req, res, next) => {
    User.find()
        .select('email password _id')
        .exec()
        .then(users => {
            res.status(200).json({
                count: users.length,
                users: users.map(user => {
                    return {
                        email: user.email,
                        password: user.password,
                        _id: user._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + user._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
exports.users_login_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth successful',
                        token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
exports.users_register_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
                })
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                }
                else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    return user.save()
                        .then(user => {
                            console.log(user)
                            res.status(201).json({
                                message: 'User created',
                                user: user
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}
exports.users_get_user = (req, res, next) => {
    User.findById(req.params.userId)
        .select('email password _id')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user
                })
            }
            else {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.users_delete_user = (req, res, next) => {
    User.remove({ _id: re.params.userId })
        .exec().
        then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}