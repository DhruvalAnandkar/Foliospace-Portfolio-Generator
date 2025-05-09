import { useState, useEffect, useRef, useContext } from 'react';
import { Link, Navigate } from "react-router-dom";
import port2 from "../imgs/port2.mp4";
import port4 from "../imgs/port4.mp4";
import videoBg1 from "../imgs/videoBg1.mp4";
import port1 from "../imgs/port1.mp4";
import { UserContext } from "../App";
import "../index.css";

const NoLoginUser = () => {
    const middleRef = useRef(null);
    const footerRef = useRef(null);
    const [middleVisible, setMiddleVisible] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);
    const { userAuth: { access_token } } = useContext(UserContext);
    const [typedText, setTypedText] = useState('');
    const fullText = " Craft Your Stunning Portfolio";
    const typingSpeed = 100;

    // useEffect(() => {
    //     let index = 0;
    //     let typingInterval;

    //     // const startTyping = () => {
    //     //   typingInterval = setInterval(() => {
    //     //       if (index <= fullText.length) {
    //     //           setTypedText(prevText => prevText + fullText.charAt(index));
    //     //           index++;
    //     //       } else {
    //     //           clearInterval(typingInterval);
    //     //            setTimeout(() => {
    //     //               setTypedText('');
    //     //               index = 0;
    //     //               startTyping();
    //     //            }, 1500);
    //     //       }
    //     //   }, typingSpeed);
    //     // }

    //     startTyping();
    //     return () => clearInterval(typingInterval);
    // }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === middleRef.current) {
                        setMiddleVisible(entry.isIntersecting);
                    } else if (entry.target === footerRef.current) {
                        setFooterVisible(entry.isIntersecting);
                    }
                });
            },
            { threshold: 0 }
        );

        if (middleRef.current) observer.observe(middleRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        return () => {
            if (middleRef.current) observer.unobserve(middleRef.current);
            if (footerRef.current) observer.unobserve(footerRef.current);
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    if (access_token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="w-full h-full font-philosopher  ">
            <video className="fixed inset-0 object-cover w-full h-screen" src={videoBg1} autoPlay loop muted />
            <div className="relative inset-0 bg-white opacity-40"></div>

            <section className="relative bg-[#2d3d4c] mt-[101px] rounded-3xl w-full h-screen opacity-[0.94] flex flex-col items-center justify-center text-center z-5">
                <video className="absolute  rounded-3xl inset-0 w-full h-full object-cover opacity-[0.98]" src={port1} autoPlay loop muted />
                <div className="relative z-10 text-white px-6">
                    <h1 className="text-5xl font-extrabold leading-relaxed" style={{ letterSpacing: '0.15em' }}>
                    Craft Your Stunning Portfolio
                    </h1>
                    <p className="text-xl font-italics mb-12 max-w-4xl leading-relaxed" style={{ letterSpacing: '0.15em' }}>
                        Showcase your work professionally in a way that impresses clients and employers.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/signup" className="border border-white text-white px-6 py-3 rounded-full text-lg hover:bg-white hover:text-black transition-colors duration-300">
                            Get Started
                        </Link>
                        <Link to="/signup" className="border border-white text-white px-6 py-3 rounded-full text-lg hover:bg-white hover:text-black transition-colors duration-300">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            <section ref={middleRef} className={`relative rounded-3xl bg-[#2d3d4c] mt-2 mb-2 h-screen flex flex-col items-center opacity-[0.94] justify-center text-center px-6 transition-opacity duration-1000 ${middleVisible ? 'opacity-100' : 'opacity-50'}`}>
                <video className="absolute rounded-3xl inset-0 w-full h-full object-cover opacity-90" src={port2} autoPlay loop muted />
                <div className="relative z-10  text-white px-6">
                    <h2 className="text-4xl text-white mt-16 font-bold leading-relaxed" style={{ letterSpacing: '0.15em' }}>
                        Start Building Your Online Presence
                    </h2>
                    <p className="mt-4 text-white text-xl max-w-3xl leading-relaxed" style={{ letterSpacing: '0.15em' }}>
                        Unlock your potential with our easy-to-use portfolio builder and create a stunning representation of your skills.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link to="/signup" className="border border-white text-white px-6 py-3 rounded-full text-lg hover:bg-white hover:text-black transition-colors duration-300" style={{ letterSpacing: '0.15em' }}>
                            Build Now
                        </Link>
                        <Link to="/portfolio-examples" className="border border-white text-white px-6 py-3 rounded-full text-lg hover:bg-white hover:text-black transition-colors duration-300" style={{ letterSpacing: '0.15em' }}>
                            See Examples
                        </Link>
                    </div>
                </div>
            </section>

            <footer ref={footerRef} className={`rounded-3xl h-screen flex flex-col justify-between text-center bg-transparent text-white transition-opacity duration-1000 ${footerVisible ? 'opacity-100' : 'opacity-50'}`} style={{ backgroundImage: `url(${port4})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1) opacity(0.89)' }}>
                <video className="absolute inset-0 w-full h-full object-cover opacity-[0.94]" src={port4} autoPlay loop muted />
                <div className="relative flex-grow text-xl flex items-center justify-center">
                    <div>
                        <h3 className="text-4xl font-semibold leading-relaxed">Stay Updated with Our Newsletter</h3>
                        <div className="flex justify-center mt-4">
                            <input className="border border-white p-2 rounded-l-md text-white w-80 outline-white placeholder-white bg-transparent" type="email" placeholder="Enter your email" />
                            <button className="border border-white px-6 py-3 ml-2 rounded-r-lg text-lg hover:bg-white hover:text-black transition-colors duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col items-center p-8">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="https://www.linkedin.com/login" className="text-white hover:text-[#7de649]">LinkedIn</a>
                        <a href="https://www.youtube.com/" className="text-white hover:text-[#7de649]">YouTube</a>
                        <a href="https://www.facebook.com/" className="text-white hover:text-[#7de649]">Facebook</a>
                        <a href="https://x.com/i/flow/login" className="text-white hover:text-[#7de649]">Twitter</a>
                    </div>
                    <p className="text-sm text-center mb-4">Mail: info@portfolio.com | Phone: 456 589-5364 | Address: 123 Main St</p>
                    <div className="border-t border-gray-400 pt-4 text-center text-xs">
                        <p>&copy; 2024 Your Portfolio. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NoLoginUser