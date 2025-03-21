// components/doctor/ChatbotSetup.tsx
import React, { useState } from 'react';
import { Bot, Settings, HelpCircle, CheckCircle } from 'lucide-react';

interface BotConfig {
  name: string;
  greeting: string;
  language: string;
  responseTime: number;
  active: boolean;
}

export const ChatbotSetup: React.FC = () => {
  const [config, setConfig] = useState<BotConfig>({
    name: 'MediBot',
    greeting: 'Hello! How can I assist you today?',
    language: 'en',
    responseTime: 2,
    active: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const toggleBotStatus = () => {
    setConfig(prev => ({ ...prev, active: !prev.active }));
  };

  const handleSave = () => {
    console.log('Saving AI Agent config:', config);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="space-y-8 relative">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center shadow-lg">
          <CheckCircle className="mr-2" size={20} />
          Configuration saved successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Bot className="mr-2 text-blue-600" /> AI Agent Configuration
          </h3>
          <button
            onClick={toggleBotStatus}
            className={`px-4 py-2 rounded-full ${config.active ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {config.active ? 'Active' : 'Inactive'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bot Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Greeting Message</label>
            <textarea
              value={config.greeting}
              onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Settings size={20} /> Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Response Time (seconds)</label>
                <input
                  type="number"
                  value={config.responseTime}
                  onChange={(e) => setConfig({ ...config, responseTime: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min={1}
                  max={10}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:from-blue-600 hover:to-blue-700"
      >
        Save Configuration
      </button>
    </div>
  );
};