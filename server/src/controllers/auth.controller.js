const jwt = require('jsonwebtoken');
const User = require('../models/User');

//CREATE akun baru / register
exports.register = async (req, res) =>
{
    try
    {
        const { username, password } = req.body;

        //validasi2 input
        if (!username || !password)
        {
            return res.status(400).json({ error: "Username and password must be filled" });
        }

        if (password.length < 6)
        {
            return res.status(400).json({ error: "Password must be 6 characters minimum" });
        }

        //check username exist apa gk
        const existingUser = await User.findOne({ username });
        if (existingUser)
        {
            return res.status(400).json({ error: "Username is registered" });
        }

        //make user new
        const newUser = new User({ username, password });
        await newUser.save();

        //generate token JWT
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: "Registration successful",
            token,
            user:
            {
                id: newUser._id,
                username: newUser.username,
                bio: newUser.bio,
                avatar: newUser.avatar
            }
        });
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

//CREATE login existing akun user
exports.login = async (req, res) =>
{
    try
    {
        const {username, password} = req.body;

        //validasi input2
        if (!username || !password)
        {
            return res.status(400).json({ error: "Username and password must be filled" });
        }

        //cari usernya sama include password soalnya tadi di set select: false
        const user = await User.findOne({ username }).select('+password');
        if (!user)
        {
            return res.status(401).json({ error: "Username or password is wrong" });
        }

        //compare passnya
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid)
        {
            return res.status(401).json({ error: "Username or password is wrong" });
        }

        //generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: 
            {
                id: user._id,
                username: user.username,
                bio: user.bio,
                avatar: user.avatar,
                status: user.status
            }
        });
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};