import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import videoBg1 from '../imgs/videoBg1.mp4'; // Import video background
import port1 from '../imgs/port1.jpg'; // Import background image
import port4 from '../imgs/port4.png'; // Import footer background image

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Load user profile (simulate fetch or local)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setProfilePicture(data.profilePicture);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          profilePicture,
          showEmail,
          notificationsEnabled
        })
      });

      if (res.ok) {
        alert('Profile changes saved!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const tabStyle = (tab) =>
    `py-2 px-4 rounded-t-md font-semibold ${
      activeTab === tab
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl min-h-screen mt-[101px] md:mt-[101px] flex flex-col items-center justify-start text-center px-4 md:px-10 relative z-5"
                style={{
                  backgroundImage: `url(${port1})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(1.5) opacity(0.89)",
                }}
      >
        {/* Overlay for Settings Content */}
        <div className="relative z-10 w-full max-w-3xl p-8 mt-20 bg-white bg-opacity-80 rounded-lg shadow-[5px]]">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Settings</h1>

          <div className="flex justify-center mb-4 border border-[#7de649] text-black hover:text-[#7de649] space-x-2">
            <button onClick={() => setActiveTab('profile')} className={tabStyle('profile')}>Profile</button>
            <button onClick={() => setActiveTab('account')} className={tabStyle('account')}>Account</button>
            <button onClick={() => setActiveTab('appearance')} className={tabStyle('appearance')}>Appearance</button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-4 text-gray-700 ">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                  <input
                    className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                    type="text"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">YouTube Channel</label>
                  <input
                    className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                    type="text"
                    // value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter Profile</label>
                  <input
                    className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                    type="text"
                    // value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Public Research or Publications</label>
                <input
                  className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                  type="email"
                  value={email}
               
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full p-2 border border-[#7de649] hover:text-[#7de649] rounded text-gray-800"
                  type="text"
                  value={name}
                  
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                  checked={showEmail}
                  onChange={() => setShowEmail(!showEmail)}
                />
                <label className="text-sm font-medium">Show Email on Profile</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <label className="text-sm font-medium">Enable Notifications</label>
              </div>
              <button onClick={handleSaveProfile} className="bg-black text-white py-2 px-4 rounded hover:text-[#7de649] focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                Save Profile
              </button>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4 text-gray-700">
              <div>
                <label className="block text-lg font-medium mb-1">Change Password</label>
                <label className="block text-sm font-medium mb-1">Old Password</label>
                <input type="password" className="w-full text-black p-2 border border-[#7de649] rounded" placeholder="Current Password" />
              </div>
              <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full p-2 border border-[#7de649] rounded text-black" placeholder="New Password" />
              </div>
              <div>
              <label className="block text-sm font-medium mb-1">Retype Password</label>
                <input type="password" className="w-full p-2 border border-[#7de649] rounded text-black" placeholder="Confirm New Password" />
              </div>
              <button className="bg-black text-white py-2 px-4 rounded hover:text-[#7de649] focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                Change Password
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                />
                <label className="text-sm font-medium">Dark Mode</label>
              </div>
              {/* Add more appearance settings here */}
            </div>
          )}
        </div>
      </motion.div>

      <footer
        className={`rounded-3xl min-h-[20vh] mt-2 flex flex-col justify-between text-center text-white relative z-10`}
        style={{
          backgroundColor: ["#2d3d4c"],
          backgroundImage: `url(${port4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(1) opacity(0.89)",
        }}
      >
        <div className="flex flex-col items-center p-6 md:p-16">
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

export default SettingsPage;