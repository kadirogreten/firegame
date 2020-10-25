const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');



////// VALIDATION ///////
const {
    registerValidation,
    loginValidation
} = require('../validation/validation');



////// VALIDATION ///////

//// Register ////

router.post('/register', async (req, res) => {


    /////// lets validate before save user /////////
    const err = registerValidation(req.body);
    if (err) {
        return res.status(400).send({
            message: err.details[0].message,
            isError: true
        });
    }

    const playerUniqueName = 'player' + shortid.generate();

    console.log(playerUniqueName);
    //////// checking existing user ////////

    const existingUser = await User.findOne({
        username: playerUniqueName
    });


    if (existingUser) playerUniqueName = 'player' + shortid.generate();

    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(req.body.deviceId, salt);

    const user = new User({
        username: playerUniqueName,
        deviceId: req.body.deviceId
    });

    try {
        const savedUser = await user.save();

        // const validPass = await bcrypt.compare(req.body.deviceId, savedUser.deviceId);

        // if (!validPass) return res.status(400).send({
        //     message: 'username or deviceId is wrong!',
        //     isError: true
        // });
    
    
    
        const token = jwt.sign({
            _id: user._id,
            username: user.username
        }, 'ilkvetarzoyunumuz', {
            expiresIn: '2y'
        });

        return await res.header('Authorization', token).send({
            token: token,
            id: user._id,
            message: 'Registration successfully!',
            isError: false  
        });
    } catch (error) {
        return res.status(400).send({
            message: error,
            isError: true
        });
    }
});


router.post('/login', async (req, res) => {

    /////// lets validate before save user /////////
    const err = loginValidation(req.body);
    if (err) {
        return res.status(400).send({
            message: err.details[0].message,
            isError: true
        });
    }

    //////// checking existing user ////////

    const user = await User.findOne({
        deviceId: req.body.deviceId
    });


    if (!user) return res.status(400).send({
        message: 'username or deviceId is wrong!',
        isError: true
    });

    // const validPass = await bcrypt.compare(req.body.deviceId, user.deviceId);

    // if (!validPass) return res.status(400).send({
    //     message: 'username or deviceId is wrong!',
    //     isError: true
    // });



    const token = jwt.sign({
        _id: user._id,
        username: user.username
    }, 'ilkvetarzoyunumuz', {
        expiresIn: '2y'
    });
    res.header('Authorization', token).send({
        token: token,
        id: user._id,
        message: 'user logged in!',
        isError: false

    });
});

//// Login ////



module.exports = router;