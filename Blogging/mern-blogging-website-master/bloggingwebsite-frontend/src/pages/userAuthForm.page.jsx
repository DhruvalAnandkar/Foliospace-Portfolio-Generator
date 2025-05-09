import { useContext } from "react";
import { useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session.jsx";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";
import port1 from "../imgs/port1.jpg";
import videoBg1 from "../imgs/videoBg1.mp4";

const UserAuthForm = ({ type }) => {
    let {
        userAuth: { access_token },
        setUserAuth,
    } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                localStorage.setItem('token', data.access_token);
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            })
            .catch(({ response }) => {
                toast.error(response.data.error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        let form = new FormData(formElement);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("FullName must be greater than 3 letters");
            }
        }
        if (!email.length) {
            return toast.error("Enter Email");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Email invalid");
        }

        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must content 6-20 characters, 1 numeric, 1 lowercase and 1 uppercase letter"
            );
        }
        userAuthThroughServer(serverRoute, formData);
    };

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle()
            .then((user) => {
                let serverRoute = "/google-auth";
                let formData = {
                    access_token: user.accessToken,
                };
                userAuthThroughServer(serverRoute, formData);
            })
            .catch((err) => {
                toast.error("Trouble login through Google");
                return console.log(err);
            });
    };

    return access_token ? (
        <Navigate to="/" />
    ) : (
        <AnimationWrapper keyValue={type}>
            <video
                className="fixed inset-0 object-cover w-full h-screen"
                src={videoBg1}
                autoPlay
                loop
                muted
            />
            <div className="fixed inset-0 bg-white opacity-40"></div>
            <section
                className="h-cover mt-28 rounded-3xl flex items-center justify-center relative z-10"
                style={{
                    backgroundImage: `url(${port1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(1.5) opacity(0.89)",
                }}
            >
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white opacity-89 rounded-3xl"
                    style={{
                       
                            width: "480px", // Fixed width
                            height: "620px", // Fixed height
                            padding: "20px",
                            zIndex: 1,
                            border: "1px solid #3E3F5B",
                            opacity: "0.60",
                            brightness: "0"
    
                    }}
                >
                    <Toaster />
                    <form id="formElement" className="w-full relative z-20">
                        <h1 className="text-4xl text-black font-gelasio capitalize text-center opacity-100 mb-20">
                            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
                        </h1>
                        {type !== "sign-in" && (
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi-rr-user "
                            />
                        )}
                        <InputBox name="email" type="email" placeholder="Email" icon="fi-rr-envelope" />
                        <InputBox name="password" type="password" placeholder="Password" icon="fi-rr-key" />
                        <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                            {type.replace("-", " ")}
                        </button>
                        <div className="relative w-full flex items-center gap-2 my-10 opacity-100 uppercase text-black font-bold">
                            <hr className="w-1/2 border-[#3E3F5B]" />
                            <hr className="w-1/2 border-[#3E3F5B]" />
                        </div>

                        <button
                            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                            onClick={handleGoogleAuth}
                        >
                            <img src={googleIcon} className="w-5" alt="Google Icon" />
                            Continue With Google
                        </button>
                        {type === "sign-in" ? (
                            <p className="mt-6 text-black text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black hover:text-[#2ecc40] transition-colors duration-300  text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                        ) : (
                            <p className="mt-6 text-black text-xl text-center ">
                                Already a member?
                                <Link to="/signin" className="underline text-black hover:text-[#2ecc40] transition-colors duration-300 text-xl ml-1">
                                    Sign in here
                                </Link>
                            </p>
                        )}
                    </form>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;