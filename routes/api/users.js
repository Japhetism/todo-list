const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const users = mongoose.model('users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email && !user.password) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    email: 'is required',
                    password: 'is required',
                }
            },
        });
    }

    if(!user.email) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    email: 'is required',
                }
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    password: 'is required',
                }
            },
        });
    }

    const finalUser = new users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.status(200).json({
            success: {
                status: 200,
                message: 'User registration was successful',
                user: finalUser.toAuthJSON()
            }
        }))
        .catch(err => {
            return res.status(409).json({
                error: {
                    status: 409,
                    message: 'Email already exist',
                    description: err.message
                },
            });
        })    
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email && !user.password) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    email: 'is required',
                    password: 'is required'
                }
            },
        });
    }

    if(!user.email) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    email: 'is required',
                }
            },
        });
    }

    if(!user.password) {
        return res.status(422).json({
            error: {
                status: 422,
                message: 'Unable to process user request',
                requiredField: {
                    password: 'is required',
                }
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: 'Email or password is incorrect',
                    description: err
                },
            });
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.status(200).json({
                success: {
                    status: 200,
                    message: 'User login was successful',
                    user: user.toAuthJSON()
                }
            });    
        }

        return status(400).info
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/info', auth.required, (req, res, next) => {

    const { payload: { id } } = req;

    return users.findById(id)
        .then((user) => {
            if(!user) {
                return status(400);
            }
            
            return res.status(200).json({
                success: {
                    status: 200,
                    message: 'User details retrieved successfully',
                    user: user.toAuthJSON()
                }
            });
        });
});

module.exports = router;