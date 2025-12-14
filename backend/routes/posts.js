const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id,
      image: req.body.image,
      caption: req.body.caption
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ user: req.user.id }).populate('user', ['username']);
    const followingPosts = await Post.find({
      user: { $in: currentUser.following }
    }).populate('user', ['username']);
    
    let feed = [...userPosts, ...followingPosts];
    feed.sort((a, b) => b.createdAt - a.createdAt);
    res.json(feed);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.unshift(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newComment = {
      user: req.user.id,
      text: req.body.text
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id }).populate('user', ['username']).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});



module.exports = router;