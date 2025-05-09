import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
// import userHomepage from "../components/user-homepage.component";


const HomePage = () => {
  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit modes and temporary data for each section
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [tempProfileName, setTempProfileName] = useState("");

  const [educationEditMode, setEducationEditMode] = useState(false);
  const [tempEducation, setTempEducation] = useState("");

  const [experienceEditMode, setExperienceEditMode] = useState(false);
  const [tempExperience, setTempExperience] = useState("");

  const [skillsEditMode, setSkillsEditMode] = useState(false);
  const [tempSkills, setTempSkills] = useState("");

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
        setTempEducation(response.data.education);
        setTempExperience(response.data.experience.join(","));
        setTempSkills(response.data.skills.join(","));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userAuth, navigate]);

  const sections = ["Profile", "Education", "Experience", "Skills"];
  const [activeSection, setActiveSection] = useState(sections[0]);

  // Edit and save functions for each section
  const handleProfileEdit = () => setProfileEditMode(true);
  const handleProfileSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, fullname: tempProfileName },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      setUserData({ ...userData, fullname: tempProfileName });
      setProfileEditMode(false);
    } catch (error) {
      console.error("Error saving profile name:", error);
    }
  };

  const handleEducationEdit = () => setEducationEditMode(true);
  const handleEducationSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, education: tempEducation },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      setUserData({ ...userData, education: tempEducation });
      setEducationEditMode(false);
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  const handleExperienceEdit = () => setExperienceEditMode(true);
  const handleExperienceSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, experience: tempExperience.split(",") },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      setUserData({ ...userData, experience: tempExperience.split(",") });
      setExperienceEditMode(false);
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleSkillsEdit = () => setSkillsEditMode(true);
  const handleSkillsSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user-data`,
        { ...userData, skills: tempSkills.split(",") },
        { headers: { Authorization: `Bearer ${userAuth.access_token}` } }
      );
      setUserData({ ...userData, skills: tempSkills.split(",") });
      setSkillsEditMode(false);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  const renderContent = () => {
    if (loading) return (<p>Loading...</p>);

    if (!userData) return ( <p>Failed to load user data.</p>);

   return(
      
        <div >
        {activeSection === "Profile" && renderProfileSection()}
        {activeSection === "Education" && renderEducationSection()}
        {activeSection === "Experience" && renderExperienceSection()}
        {activeSection === "Skills" && renderSkillsSection()}
      </div>
    );
  };

  const renderProfileSection = () => (
    <>
      {profileEditMode ? (
        <>
          <input
            type="text"
            value={tempProfileName}
            onChange={(e) => setTempProfileName(e.target.value)}
          />
          <button onClick={handleProfileSave}>Save</button>
        </>
      ) : (
        <>
          <img
            src={userData.profile_img}
            alt="Profile"
            className="w-40 h-40 rounded-full mb-4 shadow-md"
          />
          <h2 className="text-lg font-semibold">{userData.fullname}</h2>
          <p className="text-gray-600 text-center">{userData.description}</p>
          <button onClick={handleProfileEdit}>Edit Name</button>
        </>
      )}
    </>
  );

  const renderEducationSection = () => (
    <>
      {educationEditMode ? (
        <>
          <input
            type="text"
            value={tempEducation}
            onChange={(e) => setTempEducation(e.target.value)}
          />
          <button onClick={handleEducationSave}>Save</button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Education</h2>
          <p className="text-gray-600 text-center">{userData.education}</p>
          <button onClick={handleEducationEdit}>Edit Education</button>
        </>
      )}
    </>
  );

  const renderExperienceSection = () => (
    <>
      {experienceEditMode ? (
        <>
          <input
            type="text"
            value={tempExperience}
            onChange={(e) => setTempExperience(e.target.value)}
          />
          <button onClick={handleExperienceSave}>Save</button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Experience</h2>
          <ul className="list-disc list-inside text-gray-600">
            {userData.experience.map((exp, index) => (
              <li key={index}>📌 {exp}</li>
            ))}
          </ul>
          <button onClick={handleExperienceEdit} >Edit Experience</button>
        </>
      )}
    </>
  );

  const renderSkillsSection = () => (
    <>
      {skillsEditMode ? (
        <>
          <input
            type="text"
            value={tempSkills}
            onChange={(e) => setTempSkills(e.target.value)}
          />
          <button onClick={handleSkillsSave}>Save</button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="flex gap-2 flex-wrap justify-center">
            {userData.skills.map((skill, index) => (
              <span key={index} className="bg-blue-500 text-black px-3 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
          <button onClick={handleSkillsEdit}>Edit Skills</button>
        </>
      )}
    </>
  );

  return (
    <AnimationWrapper>
      <section className="w-25 h-10 flex flex-col items-
    center gap-8 p-6">
       <div className="w-full flex flex-col items-center">
                <InPageNavigation routes={sections} setActiveSection={setActiveSection} />

                
                </div>
            </section>
            
        </AnimationWrapper>
    );
};

export default HomePage;