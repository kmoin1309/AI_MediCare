const getAllConsultations = async (req, res) => {
  try {
    res.json({ message: "Get all consultations" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConsultation = async (req, res) => {
  try {
    res.json({ message: "Get single consultation" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createConsultation = async (req, res) => {
  try {
    res.json({ message: "Create consultation" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConsultation = async (req, res) => {
  try {
    res.json({ message: "Update consultation" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConsultation = async (req, res) => {
  try {
    res.json({ message: "Delete consultation" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
};
