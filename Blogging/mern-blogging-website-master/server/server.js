import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountKey from "./react-portfolio-builder-firebase-adminsdk-fbsvc-bcac92bc62.json" with { type: "json" }
import { getAuth } from "firebase-admin/auth";
import aws from "aws-sdk";
import Blog from './Schema/Blog.js';
import User from './Schema/User.js';
import multer from 'multer';

const server = express();
let PORT = 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

//Setting S3 Bucket
const s3 = new aws.S3({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

})

const generateUploadURL = async () => {

    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'portfolio-website-dhruval',
        Key: imageName,
        Expires: 1000,
        ContentType: 'image/jpeg'

    })


}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).json({ error: "No accesss token" })
    }
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access token is invalid" })
        }
        req.user = user.id
        next()
    })

}


const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname

    }
}


const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username;
}

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory



// Upload image url route
server.get('/get-upload-url', (req, res) => {

    generateUploadURL().then(url => res.status(200).json({ uploadURL: url }))
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ "error": err.message })
        })

})


server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    //Validating data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "FullName must be greater than 3 letters" })
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" })
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email invalid" })
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password must content 6-20 characters, 1 numeric, 1 lowercase and 1 uppercase letter" })
    }
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username

            }
        })
        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))

        })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email Exists already" })
                }
                return res.status(500).json({ "error": err.message })
            })
    })



})


server.post("/signin", (req, res) => {

    let { email, password } = req.body;
    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" })

            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({
                        "error": "Error occured while login please try agin"

                    });
                }
                if (!result) {
                    return res.status(403).json({ "error": "Incorrect password" })


                }
                else {
                    return res.status(200).json(formatDatatoSend(user))
                }
            })



        })
        .catch(err => {
            console.log(err.message);
            return res.status(500).json({ "error": "err.message" })
        })



})


server.post("/google-auth", async (req, res) => {
    let { access_token } = req.body;
    getAuth()
        .verifyIdToken(access_token).then(async (decodedUser) => {


            let
                { email, name, picture } = decodedUser;

            picture = picture.replace("s96-c", "s384-c");
            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img personal_info.google_auth").then((u) => {
                return u || null
            })

                .catch(err => {
                    return res.status(500).json({ "error": err.message })
                })

            ///logged user

            if (user) {
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was asigned up without google. please log in with password to access the account" })
                }

            }
            else {
                //sign        up 
                let username = await generateUsername(email);
                user = new User
                    ({
                        personal_info: { fullname: name, email, profile_img: picture, username },
                        google_auth: true
                    })
                await user.save().then((u) => {
                    user = u;
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message })
                    })
            }
            return res.status(200).json(formatDatatoSend(user))


        })
        .catch(err => {
            return res.status(500).json({ "error": "Try with another account" })
        })
})


server.get('/latest-blogs', (req, res) => {
    let maxlimit = 5;
    Blog.find({ draft: false })
        .populate("author", "personal_info.username personal_info.profile_img")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des tags author publishedAt banner content -_id")
        .limit(maxlimit)


        .then(blogs => {

            return res.status(200).json({ blogs })
        })
        .catch(err => {

            return res.status(500).json({ error: err.message })
        })


})

//  Route to handle user search
server.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        //  Database query (adjust based on your database - e.g., Mongoose, PostgreSQL)
        // Example using Mongoose (MongoDB):
        const users = await User.find({
            "personal_info.username": { $regex: query, $options: 'i' }, //  case-insensitive search
        }).limit(10).select("personal_info.username personal_info.profile_img _id"); // Select only the fields you need

        if (users && users.length > 0) {
            const results = users.map(user => ({
                user_id: user._id,
                username: user.personal_info.username,
                profile_picture: user.personal_info.profile_img || null, //  null if not exists
            }));
            res.status(200).json({ results });
        }
        else {
            res.status(200).json({ results: [] }); //  IMPORTANT:  Return an empty array, NOT a 404 for no results
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' }); // Handle server errors
    }
});

server.post('/create-blog', verifyJWT, (req, res) => {

    let authorId = req.user;

    let { title, des, banner, tags, content, draft } = req.body

    if (!title.length) {
        return res.status(403).json({ error: "You must provide a title " })
    }

    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ error: "You must provide project description and should be under 200 words " })
        }

        if (!banner.length) {
            return res.status(403).json({ error: "You must provide project banner" })

        }

        if (!content.blocks.length) {
            return res.status(403).json({ error: "There must be some project content" })
        }

        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ error: "Provide tags in order to publish the blog, maximum 10" })
        }


    }


    tags = tags.map(tag => tag.toLowerCase());
    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    let blog = new Blog({
        title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
    })

    blog.save().then(blog => {
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } }).then(user => {
            return res.status(200).json({ id: blog.blog_id })
        })
            .catch(err => {
                return res.status(500).json({ error: "Failed to update total posts number" })
            })

    })

        .catch(err => {
            return res.status(500).json({ error: err.message })
        })


})

server.get("/user-data", verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("personal_info education experience skills");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { personal_info, education, experience, skills } = user;
        const userData = {
            fullname: personal_info.fullname,
            profile_img: personal_info.profile_img,
            description: personal_info.description,
            education: education,
            experience: experience,
            skills: skills,
        };
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: error.message });
    }
});



server.put("/user-data", verifyJWT, upload.single('profile_img'), async (req, res) => {
    try {
        const { fullname, education, experience, skills, description } = req.body;
        const userId = req.user;


        const updateFields = {
            "personal_info.fullname": fullname,
            education: education,
            experience: experience,
            skills: skills, //  Include skills in the update
            "personal_info.description": description,
        };

        // Handle profile image upload if provided
        if (req.file) {
            const date = new Date();
            const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

            const params = {
                Bucket: 'portfolio-website-dhruval',
                Key: imageName,
                Body: req.file.buffer,
                ContentType: 'image/jpeg'
            };

            const s3Response = await s3.upload(params).promise();
            updateFields["personal_info.profile_img"] = s3Response.Location;
        }



        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        ).select("personal_info education experience skills");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const { personal_info, education: updatedEducation, experience: updatedExperience, skills: updatedSkills } = updatedUser;
        const userData = {
            fullname: personal_info.fullname,
            profile_img: personal_info.profile_img,
            description: personal_info.description,
            education: updatedEducation,
            experience: updatedExperience,
            skills: updatedSkills,
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ error: error.message });
    }
});




server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT);
})
