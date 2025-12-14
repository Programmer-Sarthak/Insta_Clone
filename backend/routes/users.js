const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.get('/all/suggestions', auth, async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { _id: { $ne: req.user.id } } },
      { $sample: { size: 5 } },
      { $project: { password: 0 } }
    ]);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/upload-avatar', [auth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: imageUrl },
      { new: true, select: 'profilePic' }
    );

    res.json({ profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/search/:query', auth, async (req, res) => {
  try {
    const regex = new RegExp(req.params.query, 'i');

    const users = await User.find({
      $or: [{ username: regex }, { email: regex }]
    }).select('-password');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/follow/:id', auth, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ msg: 'Cannot follow yourself' });
  }

  try {
    const [userToFollow, currentUser] = await Promise.all([
      User.findById(req.params.id),
      User.findById(req.user.id)
    ]);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!userToFollow.followers.includes(req.user.id)) {
      await Promise.all([
        userToFollow.updateOne({ $push: { followers: req.user.id } }),
        currentUser.updateOne({ $push: { following: req.params.id } })
      ]);

      res.json({ msg: 'User followed' });
    } else {
      res.status(400).json({ msg: 'Already following' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put('/unfollow/:id', auth, async (req, res) => {
  try {
    const [userToUnfollow, currentUser] = await Promise.all([
      User.findById(req.params.id),
      User.findById(req.user.id)
    ]);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (userToUnfollow.followers.includes(req.user.id)) {
      await Promise.all([
        userToUnfollow.updateOne({ $pull: { followers: req.user.id } }),
        currentUser.updateOne({ $pull: { following: req.params.id } })
      ]);

      res.json({ msg: 'User unfollowed' });
    } else {
      res.status(400).json({ msg: 'Not following' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
