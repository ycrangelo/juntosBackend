import express from 'express';
import userSaves from '../../models/userSavesModel.mjs';
import Post from '../../models/postModel.mjs';

const route = express.Router();


//fetch all save post
//return post already
route.post('/getSavedPosts/', async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Find all save records for this user
    const savedRecords = await userSaves.find({ userId });

    // 2. Extract all postIds from savedRecords
    const postIds = savedRecords.map(save => save.postId);

    // 3. Find posts by those postIds
    const savedPosts = await Post.find({ _id: { $in: postIds } }).sort({ createdAt: -1 });

    // 4. Return the full post details
    res.json(savedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//creating a post
route.post('/createSavedPosts', async (req, res) => {
  const {userId,postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newSavePost = new userSaves({
      userId,
      postId,
    });

    await newSavePost.save();

    res.status(201).json({
      message: 'save created successfully',
      Post: {
        userId,
      }
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});





export default route;
