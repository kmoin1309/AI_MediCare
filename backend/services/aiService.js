const axios = require("axios");

const aiService = {
  getMedicalAdvice: async (query) => {
    const response = await axios.post(
      "http://localhost:8000/medical-assistant",
      { query }
    );
    return response.data;
  },
};

module.exports = aiService;
