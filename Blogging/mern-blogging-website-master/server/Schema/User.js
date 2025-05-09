import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const educationSchema = new Schema({
  degree: { type: String, required: true },
  year: {
    type: String,
    required: true,
    // Example year validation (YYYY-YYYY format)
    validate: {
      validator: function (v) {
        return /^\d{4}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid year format (YYYY-YYYY)`
    }
  },
  gpa: { type: String },
  university: { type: String, required: true },
});

const experienceSchema = new Schema({ //added experience schema
  title: { type: String, required: true },
  company: { type: String, required: true },
  years: { type: String, required: true },
  details: { type: String, required: true }
})

const userSchema = mongoose.Schema({
  personal_info: {
    fullname: {
      type: String,
      capitalize: true,
      required: true,
      minlength: [3, 'fullname must be 3 letters long'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: String,
    username: {
      type: String,
      minlength: [3, 'Username must be 3 letters long'],
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio should not be more than 200'],
      default: "",
    },
    profile_img: {
      type: String,
      default: () => {
        return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
      },
    },
    description: {
      type: String,
      default: "",
    },
  },
  education: [educationSchema],
  experience: [experienceSchema], // Changed to an array of experienceSchema
  skills: [{  // Updated skills schema to be an array of strings
    type: String,
  }],
  social_links: {
    youtube: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  account_info: {
    total_posts: {
      type: Number,
      default: 0,
    },
    total_reads: {
      type: Number,
      default: 0,
    },
  },
  google_auth: {
    type: Boolean,
    default: false,
  },
  blogs: {
    type: [Schema.Types.ObjectId],
    ref: 'blogs',
    default: [],
  },
}, {
  timestamps: {
    createdAt: 'joinedAt',
  },
});

export default mongoose.model("users", userSchema);
