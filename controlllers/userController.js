const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { password, email } = req.body
        const found = await User.findOne({ email })
        if (found) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }

        const hashPass = await bcrypt.hash(password, 10)
        const result = await User.create({
            ...req.body,
            password: hashPass
        })
        res.json({
            message: "user register success",
            result
        })
    } catch (error) {
        res.status(400).json({ Message: "Something Went Wrong" + error })
    }
}
exports.fetchUsers = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.json({ message: "Plz Provide Token" });
        }
        jwt.verify(token, process.env.JWT_KEY);
        const result = await User.find()
        res.json({
            message: "user fetch success",
            result
        })
    } catch (error) {
        res.json({ Message: "Something Went Wrong" + error })
    }
}

exports.login = async (req, res) => {
    try {
        //Email exist
        const { email, password } = req.body
        const result = await User.findOne({ email })
        // const result = await User.findOne({ email }).lean()
        if (!result) {
            return res.status(401).json({ message: "email is not registered with us" })
        }

        const match = await bcrypt.compare(password, result.password)
        if (!match) {
            return res.status(401).json({ message: "password do not match" })
        }
        const token = jwt.sign({ name: "john" }, process.env.JWT_KEY)
        return res.json({
            message: "login success",
            result: {
                _id: result._id,
                name: result.name,
                email: result.email,
                token
            }
        })

    } catch (error) {
        res.status(400).json({ Message: "Something Went Wrong" + error })
    }
}
exports.destroy = async (req, res) => {
    try {
        await User.deleteMany()
        return res.json({ message: "User Destroy Success" })
    } catch (error) {
        res.json({ Message: "Something Went Wrong" + error })
    }
}