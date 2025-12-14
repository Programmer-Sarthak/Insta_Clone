const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const imageUrl = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : req.body.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    const post = new Post({
      user: req.user.id,
      image: imageUrl,
      caption: req.body.caption
    });

    await post.save();

    const populatedPost = await Post.findById(post._id).populate('user', [
      'username',
      'profilePic'
    ]);

    res.json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const userIds = [...currentUser.following, req.user.id];

    const feed = await Post.find({ user: { $in: userIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', ['username', 'profilePic']);

    res.json(feed.filter(post => post.user));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['username', 'profilePic'])
      .populate('comments.user', ['username', 'profilePic']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const isLiked = post.likes.some(id => id.equals(req.user.id));

    const update = isLiked
      ? { $pull: { likes: req.user.id } }
      : { $push: { likes: req.user.id } };

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(updatedPost.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/comment/:id', auth, async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text
    };

    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment }
    });

    const updatedPost = await Post.findById(req.params.id).populate(
      'comments.user',
      ['username', 'profilePic']
    );

    if (!updatedPost) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(updatedPost.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate('user', ['username', 'profilePic'])
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
