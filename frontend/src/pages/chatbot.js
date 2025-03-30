import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSave, FiToggleLeft, FiToggleRight, FiInfo, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';
// import Sidebar from '../components/Sidebar';
// import { useUser } from '../context/authprovider';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function CreateBot() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingBot, setExistingBot] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [botStatus, setBotStatus] = useState('inactive');
  const [qrLoading, setQrLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // New bot form state
  const [botForm, setBotForm] = useState({
    botName: 'Doctor Assistant',
    botType: 'ai',
    status: 'active',
    systemInstructions: 'You are a helpful medical assistant for a doctor. Answer patient queries professionally, but remind them that this is not a substitute for professional medical advice. For emergencies, advise patients to contact their doctor directly or go to the nearest emergency room.'
  });
  
  // Notifications state
  const [notification, setNotification] = useState(null);

  // Get userId from token
  const getUserId = () => {
    try {
      let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    
      // If not found in cookies, try localStorage
      if (!token) {
        token = localStorage.getItem('token');
      }      
      if (token) {
        const decoded = jwtDecode(token);
        // Extract username from email (part before @)
        // return decoded.email.split('@')[0];
        return '123456'
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
      setAuthError("Authentication error. Please login again.");
    }
    return null;
  };

  // Check if user already has a chatbot
  useEffect(() => {
    const checkExistingBot = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:4000/bot/chatbot/${userId}`);
        
        if (response.data.success && response.data.chatbot) {
          setExistingBot(response.data.chatbot);
          setBotForm({
            botName: response.data.chatbot.botName || 'Doctor Assistant',
            botType: 'ai', // Force AI type for medical assistants
            status: response.data.chatbot.status || 'inactive',
            systemInstructions: response.data.chatbot.aiSettings?.systemPrompt || botForm.systemInstructions
          });
          
          // Check bot status
          const statusResponse = await axios.get(`http://localhost:4000/bot/status/${userId}`);
          setBotStatus(statusResponse.data.status);
        }
      } catch (error) {
        console.log("No existing bot found or error:", error);
        // If 404, it means no bot exists which is fine
        if (error.response && error.response.status !== 404) {
          showNotification("Error checking existing bot: " + (error.response?.data?.error || error.message), "error");
        }
      } finally {
        setLoading(false);
      }
    };

    checkExistingBot();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBotForm({
      ...botForm,
      [name]: value
    });
  };

  // Toggle bot status
  const toggleStatus = () => {
    setBotForm({
      ...botForm,
      status: botForm.status === 'active' ? 'inactive' : 'active'
    });
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

// CreateBot.js (updated startBot function)

const startBot = async () => {
  try {
    setQrLoading(true);
    const userId = getUserId();
    if (!userId) {
      showNotification("User authentication error", "error");
      return;
    }
    
    const response = await axios.get(`http://localhost:4000/start-bot/${userId}`);
    
    if (response.data.success) {
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
        showNotification("Scan the QR code with WhatsApp to connect your bot");
      } else if (response.data.status === "ready") {
        setBotStatus('active');
        showNotification("WhatsApp bot is connected and ready");
      }
    } else {
      showNotification(response.data.error || "Failed to start WhatsApp bot", "error");
    }
  } catch (error) {
    console.error("Error starting bot:", error);
    showNotification("Failed to start WhatsApp bot: " + (error.response?.data?.error || error.message), "error");
  } finally {
    setQrLoading(false);
  }
};

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!botForm.botName.trim()) {
      showNotification("Bot name is required", "error");
      return;
    }
    
    if (!botForm.systemInstructions.trim()) {
      showNotification("System instructions are required", "error");
      return;
    }
    
    try {
      setSaving(true);
      const userId = getUserId();
      
      if (!userId) {
        showNotification("User authentication error", "error");
        setSaving(false);
        return;
      }
      
      const botData = {
        botName: botForm.botName,
        botType: 'ai', // Force AI for medical assistants
        status: botForm.status,
        systemInstructions: botForm.systemInstructions
      };
      
      let response;
      if (existingBot) {
        // Update existing bot
        response = await axios.put(`http://localhost:4000/bot/chatbot/${userId}`, botData);
      } else {
        // Create new bot
        response = await axios.post(`http://localhost:4000/bot/chatbot`, {
          userId,
          ...botData
        });
      }
      
      if (response.data.success) {
        setExistingBot(response.data.chatbot);
        showNotification(existingBot ? "Medical Assistant updated successfully" : "Medical Assistant created successfully");
        
        // Start the bot to get QR code if bot is active
        if (botForm.status === 'active') {
          await startBot();
        }
      }
    } catch (error) {
      console.error("Error saving chatbot:", error);
      showNotification(error.response?.data?.error || "Failed to save Medical Assistant", "error");
    } finally {
      setSaving(false);
    }
  };

  // Refresh QR code
  const refreshQrCode = () => {
    startBot();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If authentication error, show login message
  if (authError) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Error</h2>
          <p className="mb-6">{authError}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      {/* <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-200 mr-2">
                <FiInfo className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">
                {existingBot ? "Edit Medical Assistant" : "Create Medical Assistant"}
              </h1>
            </div>
            <div className="flex items-center">
              {botStatus === 'active' && (
                <span className="flex items-center text-green-600 mr-4">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Connected
                </span>
              )}
            </div>
          </div>
        </header>
        
        {/* Notification */}
        {notification && (
          <div className={`p-3 mx-4 mt-4 rounded-md ${
            notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {notification.message}
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bot Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Bot Information</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
                      Bot Name
                    </label>
                    <input
                      type="text"
                      id="botName"
                      name="botName"
                      value={botForm.botName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doctor Assistant"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">Bot Status</span>
                      <button 
                        type="button"
                        onClick={toggleStatus}
                        className="flex items-center focus:outline-none"
                      >
                        {botForm.status === 'active' ? (
                          <>
                            <FiToggleRight className="h-6 w-6 text-blue-600" />
                            <span className="ml-2 text-sm text-blue-600">Active</span>
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="h-6 w-6 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Inactive</span>
                          </>
                        )}
                      </button>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* System Instructions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">AI System Instructions</h2>
                  <div className="text-sm text-gray-500 flex items-center">
                    <FiMessageSquare className="mr-1" /> AI-Powered
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="systemInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      System Instructions <span className="text-xs text-gray-500">(guide how the AI assistant should respond)</span>
                    </label>
                    <textarea
                      id="systemInstructions"
                      name="systemInstructions"
                      value={botForm.systemInstructions}
                      onChange={handleChange}
                      rows="6"
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="You are a helpful medical assistant..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                    <h3 className="font-medium mb-2">Tips for effective instructions:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Define the assistant's role (medical secretary, nurse, etc.)</li>
                      <li>Specify the tone (professional, friendly, formal)</li>
                      <li>Include disclaimers about medical advice</li>
                      <li>Add policies for handling emergencies</li>
                      <li>Set guidelines for patient confidentiality</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* QR Code Section */}
              {(qrCode || qrLoading) && (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <h2 className="text-lg font-semibold mb-4">Connect WhatsApp</h2>
                  <p className="mb-4 text-gray-600">Scan this QR code with WhatsApp to connect your bot</p>
                  <div className="flex flex-col items-center">
                    {qrLoading ? (
                      <div className="spinner w-64 h-64 flex items-center justify-center">
                        <span className="text-gray-500">Loading QR code...</span>
                      </div>
                    ) : (
                      <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                    )}
                    <button
                      type="button"
                      onClick={refreshQrCode}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={qrLoading}
                    >
                      <FiRefreshCw className={`mr-2 ${qrLoading ? 'animate-spin' : ''}`} />
                      Refresh QR Code
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    If you've already scanned the code, you can close this section
                  </p>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-between">
                {!qrCode && botStatus !== 'active' && existingBot && (
                  <button
                    type="button"
                    onClick={startBot}
                    disabled={saving || qrLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {qrLoading ? (
                      <>
                        <span className="spinner-small mr-2"></span>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <FiMessageSquare className="mr-2" />
                        Connect WhatsApp
                      </>
                    )}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || qrLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ml-auto"
                >
                  {saving ? (
                    <>
                      <span className="spinner-small mr-2"></span>
                      Saving...
                    </>
                  ) : existingBot ? (
                    <>
                      <FiSave className="mr-2" />
                      Update Assistant
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Create Assistant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      
      {/* Additional CSS for Spinners */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #3B82F6;
          animation: spin 1s linear infinite;
        }
        
        .spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border-left-color: white;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CreateBot;