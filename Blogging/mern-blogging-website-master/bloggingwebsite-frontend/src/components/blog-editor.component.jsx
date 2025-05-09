import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/projectbanner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react"; // Import useRef
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component"; // Assuming this exists and is correctly configured
import axios from "axios";
import { UserContext } from "../App";
import port1 from "../imgs/port1.jpg"; // Import background image
import videoBg1 from "../imgs/videoBg1.mp4"; // Import video background

const BlogNavbar = ({ title, handlePublishEvent, handleSaveDraft }) => {
    return (
        <nav className="navbar bg-transparent rounded-3xl text-white py-4 px-6 mb-2 flex items-center justify-between">
            <Link to="/" className="flex-none w-14 hover:opacity-75 transition-opacity duration-300 cursor-pointer">
                <img src={logo} alt="Logo" />
            </Link>
            <p className="max-md:hidden line-clamp-2 w-full text-center">
                {title.length ? title : "New Project"}
            </p>
            <div className="flex gap-4 ml-auto">
                <button
                    className="btn-light py-2 px-4 rounded-xl font-bold border hover:text-[#7de649] hover:bg-transparent"
                    onClick={handlePublishEvent}
                >
                    Publish
                </button>
                <button
                    className="btn-light py-2 px-4 rounded-xl font-bold border hover:text-[#7de649] hover:bg-transparent"
                    onClick={handleSaveDraft}
                >
                    Save draft
                </button>
            </div>
        </nav>
    );
};

const BlogContent = () => {
    let { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
    const { banner, title, content } = blog;
    const editorRef = useRef(null); // Create a ref

    useEffect(() => {
        // Reset content to an empty state on component mount
        setBlog(prevBlog => ({ ...prevBlog, content: { blocks: [] } }));

        // Initialize Editor.js
        if (!textEditor.isReady && editorRef.current) { // Check if ref is available
            const editor = new EditorJS({
                holder: editorRef.current, // Use the ref's current property
                data: { blocks: [] },
                tools: tools,
                placeholder: "Let's start your project ",
            });
            setTextEditor(editor);
        }

        return () => {
            if (textEditor && textEditor.destroy) {
                textEditor.destroy();
            }
        };
    }, [setBlog, setTextEditor, textEditor.isReady]);

    const handleBannerUpload = (e) => {
        let img = e.target.files[0];

        if (img) {
            let loadingToast = toast.loading("Uploading image...");
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Image uploaded successfully");
                        setBlog({ ...blog, banner: url });
                    }
                })
                .catch((err) => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                });
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value });
    };

    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    };

    return (
        <section className="pt-20  pb-20 px-4 rounded-3xl md:px-10">
            <div className="mx-auto max-w-[1000px] max-h-[950px] w-full bg-white bg-opacity-80 rounded-lg shadow-md p-6">
                <div className="relative aspect-[3:4] hover:opacity-80 bg-gray-100 border-2 border-gray-300 rounded-md overflow-hidden mb-8">
                    <label htmlFor="uploadBanner" className="cursor-pointer block h-full w-full">
                        <img
                            src={banner}
                            alt="Project Banner"
                            className="z-30 object-cover w-full h-full"
                            onError={handleError}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 z-40">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="ml-2">Upload Banner</span>
                        </div>
                        <input
                            id="uploadBanner"
                            type="file"
                            accept=".png,.jpg.,.jpeg"
                            hidden
                            onChange={handleBannerUpload}
                        />
                    </label>
                </div>
                <textarea
                    defaultValue={title}
                    placeholder="Project Title"
                    className="text-3xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 text-gray-800 bg-transparent z-30"
                    onKeyDown={handleTitleKeyDown}
                    onChange={handleTitleChange}
                ></textarea>
                <hr className="w-full opacity-20 my-5 z-30" />
                <div ref={editorRef} id="textEditor" className="font-gelasio text-gray-800 z-30"></div>
            </div>
        </section>
    );
};

const BlogFooter = () => (
    <footer className="text-[#7de649] py-4 px-9 text-center absolute bottom-0 w-full">
        <p>&copy; {new Date().getFullYear()} Your Blog. All rights reserved.</p>
    </footer>
);

const BlogEditor = () => {
    let { blog, blog: { title, banner, des, tags }, setBlog, textEditor, setEditorState } = useContext(EditorContext);
    let { userAuth: { access_token } } = useContext(UserContext);
    let navigate = useNavigate();

    const handlePublishEvent = (e) => {
        if (!banner.length) {
            return toast.error("Upload a project banner to publish it");
        }
        if (!title.length) {
            return toast.error("Write a project title to publish it");
        }
        if (textEditor.isReady) {
            textEditor
                .save()
                .then((data) => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data });
                        setEditorState("publish");
                    } else {
                        return toast.error("Write Something in the description");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            return toast.error("Write project Title before Saving as draft");
        }

        let loadingToast = toast.loading("Saving...");
        e.target.classList.add("disable");

        if (textEditor.isReady) {
            textEditor.save().then((content) => {
                let blogObj = {
                    title,
                    banner,
                    des,
                    content,
                    tags,
                    draft: true,
                };

                axios
                    .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    })
                    .then(() => {
                        e.target.classList.remove("disable");
                        toast.dismiss(loadingToast);
                        toast.success("Project draft saved sucessfully");

                        setTimeout(() => {
                            navigate("/");
                        }, 500);
                    })
                    .catch(({ response }) => {
                        e.target.classList.remove("disable");
                        toast.dismiss(loadingToast);
                        return toast.error(response.data.error);
                    });
            });
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Video */}
            <video
                className="fixed inset-0 object-cover w-full h-screen z-0"
                src={videoBg1}
                autoPlay
                loop
                muted
            />

            {/* Background Image Overlay */}
            <div
                className="fixed inset-0 rounded-3xl bg-cover bg-center z-10 opacity-80"
                style={{ backgroundImage: `url(${port1})` }}
            ></div>

            {/* Content Area */}
            <div className="relative z-20 flex flex-col h-full">
                <BlogNavbar title={title} handlePublishEvent={handlePublishEvent} handleSaveDraft={handleSaveDraft} />
                <Toaster />
                <AnimationWrapper>
                    <BlogContent />
                </AnimationWrapper>
                <BlogFooter />
            </div>
        </div>
    );
};

export default BlogEditor;