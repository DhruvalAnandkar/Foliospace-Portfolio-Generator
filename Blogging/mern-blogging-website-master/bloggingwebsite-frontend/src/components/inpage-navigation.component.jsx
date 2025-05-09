import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import userHomepageprojects from "./user-homepageprojects.component";
import videoBg1 from "../imgs/videoBg1.mp4";
import port1 from "../imgs/port1.jpg";
import port4 from "../imgs/port4.png";
import axios from "axios";

const InPageNavigation = ({ routes, setActiveSection }) => {
  const activeTabLineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [tempProfileName, setTempProfileName] = useState("");
  const [tempProfileDescription, setTempProfileDescription] = useState("");
  const [tempProfileImage, setTempProfileImage] = useState(null); // Added for image
  const fileInputRef = useRef(null); // Ref for file input

  const [educationEditMode, setEducationEditMode] = useState(false);
  const [tempEducation, setTempEducation] = useState("");
  const [experienceEditMode, setExperienceEditMode] = useState(false);
  const [tempExperience, setTempExperience] = useState("");
  const [skillsEditMode, setSkillsEditMode] = useState(false);
  const [tempSkills, setTempSkills] = useState([]); // Changed to array for tags
  const [newExperience, setNewExperience] = useState({ title: "", company: "", years: "", details: "" });
  const [newSkill, setNewSkill] = useState(""); // For adding new skills

  useEffect(() => {
    if (!userAuth || !userAuth.access_token) {
      navigate("/guest");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
          {
            headers: { Authorization: `Bearer ${userAuth.access_token}` },
          }
        );
        setUserData(response.data);
        setTempProfileName(response.data.fullname);
        setTempProfileDescription(response.data.description);
        setTempEducation(response.data.education || []); // Initialize with existing education or empty array
        setTempExperience(response.data.experience || []);
        setTempSkills(response.data.skills || []); // Initialize with existing skills
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userAuth, navigate]);

  const changePageState = (btn, i) => {
    const { offsetWidth, offsetLeft } = btn;
    if (activeTabLineRef.current) {
      activeTabLineRef.current.style.width = offsetWidth + "px";
      activeTabLineRef.current.style.left = offsetLeft + "px";
    }
    setActiveIndex(i);
    setActiveSection(routes[i]);
  };

  useEffect(() => {
    if (routes.length > 0 && activeTabLineRef.current) {
      const initialButton = document.querySelector(`.capitalize:nth-child(1)`);
      if (initialButton) {
        const { offsetWidth, offsetLeft } = initialButton;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
      }
      setActiveSection(routes[0]);
    }
  }, [routes, setActiveSection]);

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>Failed to load user data.</p>;

    return (
      <div className="w-[99%] md:w-[1000px] h-[600px] flex flex-col gap-8 items-center overflow-hidden bg-[#263340] shadow-3xl rounded-3xl p-6 relative z-30 mx-auto opacity-80" style={{ letterSpacing: '0.1em' }}>
        {routes[activeIndex] === "Profile" && renderProfileSection()}
        {routes[activeIndex] === "Education" && renderEducationSection()}
        {routes[activeIndex] === "Experience" && renderExperienceSection()}
        {routes[activeIndex] === "Skills" && renderSkillsSection()}
      </div>
    );
  };

  const renderProfileSection = () => (
    <div className="flex flex-col items-center w-full overflow-y-auto max-h-[700px]">
      {profileEditMode ? (
        <>
          <input
            type="text"
            value={tempProfileName}
            onChange={(e) => setTempProfileName(e.target.value)}
            className="w-full p-2 border border-white text-black hover:text-[#7de649] rounded mb-2"
          />
          <textarea
            value={tempProfileDescription}
            onChange={(e) => setTempProfileDescription(e.target.value)}
            className="w-full p-2 border text-black rounded mb-2 hover:text-[#7de649]"
            rows={4}
            placeholder="Enter Summary"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setTempProfileImage(e.target.files[0])}
            style={{ display: "none" }}
          />
          <img
            src={tempProfileImage ? URL.createObjectURL(tempProfileImage) : userData.profile_img}
            alt="Profile"
            className="w-40 h-40 rounded-full mb-4 shadow-md cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />
          <button onClick={handleProfileSave} className="bg-blue-500 text-white p-2 rounded-xl font-bold border hover:text-[#7de649]">
            Save
          </button>
        </>
      ) : (
        <>
          <img
            src={userData.profile_img}
            alt="Profile"
            className="w-60 h-60 border border-white rounded-full mb-4 opacity-[100%] shadow-md cursor-pointer hover:opacity-75 transition-opacity duration-300"
            onClick={() => setProfileEditMode(true)}
          />
          <h2 className="text-lg text-white font-bold opacity-[100%]">{userData.fullname}</h2>
          <p className="text-white opacity-[100%] border px-4 py-2 rounded-xl hover:text-[#7de649] text-center mb-5"> {userData.description}</p>
          <button onClick={handleProfileEdit} className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl">
            Edit Profile
          </button>
        </>
      )}
    </div>
  );

  const [newEducation, setNewEducation] = useState({ degree: "", year: "", gpa: "", university: "" });

  const renderEducationSection = () => (
    <>
     <div className="w-full overflow-y-auto max-h-[700px]">
      {educationEditMode ? (
        <>
          <div className="max-h-[300px] overflow-y-auto">
            {tempEducation.map((edu, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) => {
                    const newEducationList = [...tempEducation];
                    newEducationList[index] = { ...edu, degree: e.target.value };
                    setTempEducation(newEducationList);
                  }}
                  placeholder="Degree"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={edu.year || ""}
                  onChange={(e) => {
                    const newEducationList = [...tempEducation];
                    newEducationList[index] = { ...edu, year: e.target.value };
                    setTempEducation(newEducationList);
                  }}
                  placeholder="Year"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={edu.gpa || ""}
                  onChange={(e) => {
                    const newEducationList = [...tempEducation];
                    newEducationList[index] = { ...edu, gpa: e.target.value };
                    setTempEducation(newEducationList);
                  }}
                  placeholder="GPA"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={edu.university || ""}
                  onChange={(e) => {
                    const newEducationList = [...tempEducation];
                    newEducationList[index] = { ...edu, university: e.target.value };
                    setTempEducation(newEducationList);
                  }}
                  placeholder="University"
                  className="w-full p-2 border text-black rounded"
                />
              </div>
            ))}
            <div className="mb-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="Degree"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newEducation.year}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, year: e.target.value })
                  }
                  placeholder="Year"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newEducation.gpa}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, gpa: e.target.value })
                  }
                  placeholder="GPA"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newEducation.university}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, university: e.target.value })
                  }
                  placeholder="University"
                  className="w-full p-2 border text-black rounded"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setTempEducation([...tempEducation, newEducation]);
              setNewEducation({ degree: "", year: "", gpa: "", university: "" });
            }}
            className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl"
          >
            Add Education
          </button>
          {tempEducation.length > 0 && ( // Conditionally render Remove All button
            <button
              onClick={() => {
                setTempEducation([]);
              }}
              className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl"
            >
              Remove All
            </button>
          )}
          <button onClick={handleEducationSave} className="bg-blue-500 text-white p-2 rounded-xl font-bold border hover:text-[#7de649]">
            Save
          </button>

        </>
      ) : (
        <>
          <h2 className="text-lg text-white font-semibold mb-5">Education</h2>
          {userData.education && userData.education.map((edu, index) => (
            <div key={index} className="border p-4 text-white rounded-3xl hover:text-[#7de649] mb-2">
              <p><strong>Degree:</strong> {edu.degree}</p>
              <p><strong>Year:</strong> {edu.year}</p>
              <p><strong>GPA:</strong> {edu.gpa}</p>
              <p><strong>University:</strong> {edu.university}</p>
            </div>
          ))}
          <button onClick={handleEducationEdit} className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl">
            Edit Education
          </button>
        </>
      )}
     </div>
    </>
  );

  const renderExperienceSection = () => (
    <>
     <div className="w-full overflow-y-auto max-h-[700px]">
      {experienceEditMode ? (
        <>
          <div className="max-h-[300px] overflow-y-auto">
            {tempExperience.map((exp, index) => (
              <div key={index} className=" mb-4">
                <input
                  type="text"
                  value={exp.title || ""}
                  onChange={(e) => {
                    const newExperienceList = [...tempExperience];
                    newExperienceList[index] = { ...exp, title: e.target.value };
                    setTempExperience(newExperienceList);
                  }}
                  placeholder="Title"
                  className="w-full p-2 border rounded text-black mb-1"
                />
                <input
                  type="text"
                  value={exp.company || ""}
                  onChange={(e) => {
                    const newExperienceList = [...tempExperience];
                    newExperienceList[index] = { ...exp, company: e.target.value };
                    setTempExperience(newExperienceList);
                  }}
                  placeholder="Company"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={exp.years || ""}
                  onChange={(e) => {
                    const newExperienceList = [...tempExperience];
                    newExperienceList[index] = { ...exp, years: e.target.value };
                    setTempExperience(newExperienceList);
                  }}
                  placeholder="Years"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={exp.details || ""}
                  onChange={(e) => {
                    const newExperienceList = [...tempExperience];
                    newExperienceList[index] = { ...exp, details: e.target.value };
                    setTempExperience(newExperienceList);
                  }}
                  placeholder="Details"
                  className="w-full p-2 border text-black rounded"
                />
              </div>
            ))}
            <div className="mb-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, company: e.target.value })
                  }
                  placeholder="Company"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newExperience.years}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, years: e.target.value })
                  }
                  placeholder="Years"
                  className="w-full p-2 border text-black rounded mb-1"
                />
                <input
                  type="text"
                  value={newExperience.details}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, details: e.target.value })
                  }
                  placeholder="Details"
                  className="w-full p-2 border text-black rounded"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setTempExperience([...tempExperience, newExperience]);
              setNewExperience({ title: "", company: "", years: "", details: "" });
            }}
            className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl"
          >
            Add Experience
          </button>
          {tempExperience.length > 0 && (
            <button
              onClick={() => setTempExperience([])}
              className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl"
            >
              Remove All
            </button>
          )}
          <button
            onClick={handleExperienceSave}
            className="bg-blue-500 text-white p-2 rounded-xl font-bold border hover:text-[#7de649]"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg text-white font-semibold mb-5 ">Professional Experience</h2>
          {userData.experience && userData.experience.map((exp, index) => (
            <div key={index} className="border text-white hover:text-[#7de649] p-4 rounded-3xl mb-2">
              <p><strong>Title:</strong> {exp.title}</p>
              <p><strong>Company:</strong> {exp.company}</p>
              <p><strong>Years:</strong> {exp.years}</p>
              <p><strong>Details:</strong> {exp.details}</p>
            </div>
          ))}
          <button
            onClick={handleExperienceEdit}
            className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl"
          >
            Edit Experience
          </button>
        </>
      )}
     </div>
    </>
  );

  const renderSkillsSection = () => (
    <>
     <div className="w-full overflow-y-auto max-h-[700px]">
      {skillsEditMode ? (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {tempSkills.map((skill, index) => (
              <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                {skill}
                <button
                  onClick={() => {
                    const newSkills = [...tempSkills];
                    newSkills.splice(index, 1);
                    setTempSkills(newSkills);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add Skill"
              className="w-full p-2 border text-black rounded mb-2 hover:text-[#7de649] rounded mb-2"
            />
            <button
              onClick={() => {
                if (newSkill.trim()) {
                  setTempSkills([...tempSkills, newSkill.trim()]);
                  setNewSkill("");
                }
              }}
              className="bg-gray-200 border text-white hover:text-[#7de649] p-2 rounded-xl mb-2"
            >
              Add
            </button>
          </div>
          <button onClick={handleSkillsSave} className="bg-blue-500 text-white p-2 rounded-xl font-bold border hover:text-[#7de649]">Save</button>
        </>
      ) : (
        <>
          <h2 className="text-lg text-white font-semibold mb-5">Skills</h2>
          <div className="flex gap-2 flex-wrap justify-center">
            {userData.skills.map((skill, index) => (
              <span key={index} className="bg-white hover:text-[#7de649] text-black px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <button onClick={handleSkillsEdit} className="bg-gray-200 border text-white rounded mt-4 hover:text-[#7de649] p-2 rounded-xl">Edit Skills</button>
        </>
      )}
     </div>
    </>
  );

  const handleProfileEdit = () => setProfileEditMode(true);
  const handleProfileSave = async () => {
    try {


      const capitalizedName = tempProfileName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");




      const formData = new FormData();
      formData.append("fullname", capitalizedName);
      formData.append("description", tempProfileDescription);
      if (tempProfileImage) {
        formData.append("profile_img", tempProfileImage);
      }

      const response = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/user-data`, formData, {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Check for a successful response
      if (response.status === 200) {
        setUserData({
          ...userData,
          fullname: tempProfileName,
          description: tempProfileDescription,
          profile_img: tempProfileImage ? URL.createObjectURL(tempProfileImage) : userData.profile_img,
        });
        setProfileEditMode(false);
      } else {
        console.error("Server responded with an error:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleEducationEdit = () => setEducationEditMode(true);
  const handleEducationSave = async () => {

    try {
      console.log("Sending education data:", tempEducation);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, education: tempEducation },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      console.log("Received response:", response);
      if (response.status === 200) {
        setUserData({ ...userData, education: tempEducation }); // Corrected line
        setEducationEditMode(false);
      } else {
        console.error("Server responded with an error:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };
  const handleExperienceEdit = () => setExperienceEditMode(true);

  const handleExperienceSave = async () => {
    try {
      console.log("tempExperience before save:", tempExperience);
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, experience: tempExperience },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      if (response.status === 200) {
        setUserData({ ...userData, experience: tempExperience });
        setExperienceEditMode(false);
      }
      else {
        console.error("Server responded with an error:", response.status, response.data);
      }

    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };


  const handleSkillsEdit = () => setSkillsEditMode(true);
  const handleSkillsSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, skills: tempSkills }, // Send the array of skills
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      if (response.status === 200) {
        setUserData({ ...userData, skills: tempSkills }); // Update user data
        setSkillsEditMode(false);
      }
      else {
        console.error("Server responded with an error:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return (
    <div className="w-full h-auto font-philosopher">
      <video
        className="fixed inset-0 object-cover w-full h-screen"
        src={videoBg1}
        autoPlay
        loop
        muted
      />
      <div className="relative inset-0 bg-black opacity-40"></div>

      <section className="rounded-3xl min-h-screen mt-[78px] md:mt-[78px] flex flex-col items-center justify-start text-center px-4 md:px-10 relative z-5"
        style={{
          backgroundImage: `url(${port1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1.5) opacity(0.89)",
        }}
      >
        <div className="relative z-10 w-full">
          <div className="relative mb-4 md:mb-6 bg-transparent border-b border-white justify-center flex flex-nowrap overflow-x-auto">
            {routes.map((route, i) => (
              <button
                key={i}
                className={`p-3 md:p-5 px-4 md:px-8 text-white capitalize whitespace-nowrap ${
                  activeIndex === i ? "text-white font-bold" : "text-gray-300"
                }`}
                onClick={(e) => changePageState(e.target, i)}
                style={{ letterSpacing: "0.1em" }}
              >
                {route}
              </button>
            ))}
            <hr
              ref={activeTabLineRef}
              className="absolute bottom-0 duration-300 h-1 bg-blue-500"
            />
          </div>
          {renderContent()}
          {/* Add the button below the white background */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/user-homepageprojects")} // Replace "/guest" with your desired route
              className="bg-black hover:bg-[#7de649] text-black border rounder-xl font-bold  text-white py-2 px-4 rounded"style={{ letterSpacing: "0.3em" }}
            >
              My Projects
            </button>
          </div>
        </div>
      </section>

      <footer
        className={`rounded-3xl min-h-[20vh] mt-2 flex flex-col justify-between text-center bg-transparent text-white relative z-10`}
        style={{
          backgroundColor: ["#2d3d4c"],
          backgroundImage: `url(${port4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1) opacity(0.89)",
        }}
      >
        {/* <div
          className="flex-grow text-xl flex items-center justify-center p-4"
          style={{ letterSpacing: "0.15em" }}
        >
          <div>
            <h3 className="text-2xl md:text-4xl font-semibold leading-relaxed">
              Stay Updated with Our Newsletter
            </h3>
            <div className="flex flex-col md:flex-row justify-center mt-4">
              <input
                className="border border-white p-2 rounded-l-md text-white w-full md:w-80 outline-white placeholder-white bg-transparent mb-2 md:mb-0"
                type="email"
                placeholder="Enter your email"
              />
              <button className="border border-white px-6 py-3 ml-0 md:ml-2 rounded-r-lg text-lg hover:bg-white hover:text-black transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        <div className="flex flex-col items-center  p-6 md:p-16">
          <div className="flex justify-center flex-wrap space-x-4 mb-4">
            <a href="https://www.linkedin.com/login" className="text-white hover:text-[#7de649] leading-relaxed">
              LinkedIn
            </a>
            <a href="https://www.youtube.com/" className="text-white hover:text-[#7de649] leading-relaxed">
              YouTube
            </a>
            <a href="https://www.facebook.com/" className="text-white hover:text-[#7de649] leading-relaxed">
              Facebook
            </a>
            <a href="https://x.com/i/flow/login" className="text-white hover:text-[#7de649] leading-relaxed">
              Twitter
            </a>
          </div>
          <div className="text-sm text-center mb-4 leading-relaxed">
            <p>Mail: info@portfolio.com | Phone: 456 589-5364 | Address: 123 Main St</p>
          </div>
          <div className="border-t border-gray-400 pt-4 text-center text-xs leading-relaxed">
            <p>&copy; 2024 Your Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InPageNavigation;
