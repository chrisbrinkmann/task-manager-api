const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Validate a users access permission via JWT in request header
const auth = async (req, res, next) => {
  try {
    // cache the token from the 'Authorization' request header
    const token = req.header('Authorization').replace('Bearer ', '')

    // returns the decoded request token payload (the user _id prop)
    const decoded = jwt.verify(token, 'fitwindsam')

    // Query users collection for user with matching id and token prop
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      // request token did not match any users
      throw new Error()
    }

    // matching user found; attach user document to request props
    req.user = user

    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' })
  }
}

module.exports = auth
