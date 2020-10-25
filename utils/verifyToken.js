const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send({
        message: 'Access denied!'
    });

    try {
        const verified = jwt.verify(token, 'ilkvetarzoyunumuz');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send({
            message: 'Invalid Token',
            isError: true
        });
    }

}