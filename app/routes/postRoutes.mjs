import express from 'express';
import Post from '../../models/postModel.mjs';

const route = express.Router();


//fetch all post
route.get('/getAllPost', async (req, res) => {
 try {
   const post = await Post.find().sort({ createdAt: -1 }); // -1 means descending
   res.json(post);
 } catch {
   res.status(500).json({ error: 'Internal server error' });
 }
});

//creating a post
route.post('/createPost', async (req, res) => {
  const {userId,thoughts,picture,username,profile } = req.body;

  if (!userId || !thoughts) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newPost = new Post({
      userId,
      username,
      profile,
      thoughts,
      picture,
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      Post: {
        userId,
      }
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//liking a post
route.post('/likePost', async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.status(200).json({
      message: 'Post liked successfully',
      likes: post.likes
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// unliking a post
route.post('/unlikePost', async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Ensure likes don't go below 0
    post.likes = Math.max(post.likes - 1, 0);
    await post.save();

    res.status(200).json({
      message: 'Post unliked successfully',
      likes: post.likes
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});






export default route;
