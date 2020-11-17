const router = require('express').Router();
const verified = require('../utils/verifyToken');
const User = require('../models/User');

router.get('/getProfile', verified, async (req, res) => {
    const user = await User.findOne({
        _id: req.user._id
    });

    if (!user) {
        return res.status(400).send({
            message: 'User is not defined!',
            isError: false
        });
    }

    return res.json({
        id: user._id,
        username: user.username,
        message: '',
        isError: false
    });
});


router.put('/updateUsername', verified, async (req, res) => {
    console.log('id: ' + req.user._id);
    const username = req.body.username;
    const user = await User.findOne({
        _id: req.user._id
    });

    if (!user) {
        return res.json({
            message: 'User is not defined!',
            isError: true
        })
    }

    try {

        const updatedUser = await User.findByIdAndUpdate({
            _id: user._id
        }, {
            username: req.body.username,
            updatedAt: Date.now()
        });

        return res.json({
            id: user._id,
            username: username,
            message: 'Profile update successully!',
            isError: false
        });
    } catch (error) {
        return res.status(400).send({
            message: error,
            isError: true
        });
    }

});



module.exports = router;