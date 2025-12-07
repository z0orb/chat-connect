const User = require('../models/User');

//GET current user (me)
exports.getCurrentUser = async (req, res) => { //IMPLEMENTED
    try {
      const userId = req.userId; // From JWT token
  
      const user = await User.findById(userId)
        .select('-password')
        .populate('createdRooms', 'roomName roomId')
        .populate('joinedRooms', 'roomName roomId');
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "Successfully fetched current user data",
        data: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  };
  
  //UPDATE current user profile (me)
  exports.updateCurrentUserProfile = async (req, res) => { //IMPLEMENTED
    try {
      const userId = req.userId; // From JWT token
      const { username, bio, avatar, status } = req.body;
  
      // Build update object
      const updateData = {};
      if (username) updateData.username = username;
      if (bio !== undefined) updateData.bio = bio; // Allow empty string
      if (avatar) updateData.avatar = avatar;
      if (status) updateData.status = status;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          error: "You must update a minimum of 1 field" 
        });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile successfully updated",
        data: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  };

  //UPDATE current user username (me)
exports.updateCurrentUsername = async (req, res) => { //IMPLEMENTED
    try {
      const userId = req.userId; // From JWT token
      const { username } = req.body;
  
      if (!username || username.trim() === '') {
        return res.status(400).json({ error: "Username must be filled" });
      }
  
      // Check if username already exists
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });
  
      if (existingUser) {
        return res.status(400).json({ error: "Username has already been used" });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { username: username.trim() },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "Username successfully updated",
        data: user
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  };
  
  //DELETE current user account (me)
exports.deleteCurrentUserAccount = async (req, res) => { //IMPLEMENTED
    try {
      const userId = req.userId; // From JWT token
  
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "User account successfully deleted"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
  

//GET semua user 
exports.getAllUser = async (req, res) => //IMPLEMENTED (possibly POSTMAN only, tergantung FE pakai getAllUser atau getUserinRoom)
{
    try
    {
        const users = await User.find()
        .select('-password')
        .populate('createdRooms', 'roomName roomId')
        .populate('joinedRooms', 'roomName roomId');

        res.status(200).json({
            message: "Successfully fetched all users",
            count: users.length,
            data: users
        });
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//GET user by ID 
exports.getUserById = async (req, res) => //POSTMAN ONLY
{
    try
    {
        const { uid } = req.params;

        const user = await User.findById(uid)
        .select('-password')
        .populate('createdRooms', 'roomName roomId')
        .populate('joinedRooms', 'roomName roomId');

        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Successfully fetched user data",
            data: user
        });
    }

    catch (err)
    {
        console.erorr(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//UPDATE username
exports.updateUsername = async (req, res) => //DEPRECATED ENDPOINT
{
    try
    {
        const { uid } = req.params;
        const { username } = req.body;

        if (!username || username.trim() === '')
        {
            return res.status(400).json({ error: "Username must be filled" });
        }

        //check username existing sudahan apa beum
        const existingUser = await User.findOne({
            username,
            _id: { $ne: uid }
        });

        if (existingUser)
        {
            return res.status(400).json({ error: "Username has already been used" });
        }

        const user = await User.findByIdAndUpdate(
            uid,
            { username },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Username successfully updated",
            data: user
        });
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//UPDATE bio
exports.updateBio = async (req, res) => //IMPLEMENTED
{
    try
    {
        const { uid } = req.params;
        const { bio } = req.body;

        if (bio === undefined)
        {
            return res.status(400).json({ error: "Bio must be filled" });
        }

        const user = await User.findByIdAndUpdate(
            uid,
            { bio },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Bio successfully updated",
            data: user
        });
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//UPDATE user profile (username, bio, avatar, status)
exports.updateProfile = async (req, res) => //TIDAK JADI DIPAKAI
{
    try 
    {
        const { uid } = req.params;
        const { username, bio, avatar, status } = req.body;
    
        // Build update object cuma utk field yang di provide
        const updateData = {};
        if (username) updateData.username = username;
        if (bio) updateData.bio = bio;
        if (avatar) updateData.avatar = avatar;
        if (status) updateData.status = status;
    
        if (Object.keys(updateData).length === 0) 
        {
            return res.status(400).json({ 
            error: "You must update a minimum of 1 field" 
          });
        }
    
        const user = await User.findByIdAndUpdate(
          uid,
          updateData,
          { new: true, runValidators: true }
        ).select('-password');
    
        if (!user) 
        {
          return res.status(404).json({ error: "User not found" });
        }
    
        res.status(200).json({
          message: "Profile successfully updated",
          data: user
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//DELETE akun user
exports.deleteUserAccount = async (req, res) => //DEPRECATED FUNCTION
{
    try {
        const { uid } = req.params;
    
        const user = await User.findByIdAndDelete(uid);
    
        if (!user) 
        {
          return res.status(404).json({ error: "User not found" });
        }
    
        res.status(200).json({
          message: "User account successfully deleted"
        });

      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
      }
};

