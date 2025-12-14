const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/follow/:id', auth, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ msg: 'Cannot follow yourself' });
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow.followers.includes(req.user.id)) {
      await userToFollow.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.json({ msg: 'User followed' });
    } else {
      res.status(400).json({ msg: 'Already following' });
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/unfollow/:id', auth, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ msg: 'Cannot unfollow yourself' });
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (userToUnfollow.followers.includes(req.user.id)) {
      await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.json({ msg: 'User unfollowed' });
    } else {
      res.status(400).json({ msg: 'Not following' });
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;