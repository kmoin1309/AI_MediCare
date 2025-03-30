# AI-Medicare: AI-Powered Healthcare Platform


**AI-Doctor** is an innovative healthcare platform that connects patients and doctors through advanced AI-driven features. Developed as a hackathon project, it leverages modern web technologies and artificial intelligence to enable seamless medical consultations, personalized healthcare management, and enhanced user experiences. Key integrations include a **WhatsApp Chatbot** for accessible AI assistance and **OpenCV for Visual Diagnosis** to analyze medical images, making it a comprehensive solution for modern healthcare needs.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
  - [Patient Dashboard](#patient-dashboard)
  - [Doctor Dashboard](#doctor-dashboard)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview
AI-Doctor aims to revolutionize healthcare accessibility and efficiency by integrating AI into a user-friendly platform. Patients can consult with doctors, manage medical records, and receive AI-powered assistance via the web or WhatsApp, while doctors gain tools to manage consultations, analyze patient data, and streamline workflows. Built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript, the platform ensures robustness and scalability.

---

## Features

### Patient Dashboard
- **Real-Time Video Consultation**:
  - Video calls with doctors, including real-time chat and speech-to-text transcription.
  - Post-call reports with summaries, prescriptions, and follow-ups, downloadable as PDFs.
- **AI-Based Medical Assistance**:
  - Multilingual chatbot with text and speech support for 24/7 medical queries.
  - Offers first aid advice and visual diagnosis via image uploads.
  - Generates medical reports summarizing interactions.
- **WhatsApp Chatbot**:
  - Access AI assistance via WhatsApp for medical queries, first aid, and appointment booking.
- **OpenCV for Visual Diagnosis**:
  - Upload images (e.g., skin rashes, wounds) for AI-powered analysis and recommendations.
- **Recent Activity**:
  - Logs interactions like appointments, consultations, and record views.
- **Medical Records**:
  - Centralized storage for consultation reports, prescriptions, and diagnostics (e.g., lab results).
  - Downloadable as PDFs.
- **Appointments**:
  - Book, reschedule, or cancel appointments with doctors.
- **Nearby Doctors**:
  - Locate nearby doctors using geolocation and book appointments.
- **AI Chat**:
  - Analyzes symptoms, suggests conditions, and recommends doctors.
- **Visual Diagnosis**:
  - Upload images for AI-driven first aid advice and doctor recommendations.

### Doctor Dashboard
- **Patient Demographics**:
  - View patient data (age, gender, location) and analytics (conditions, appointment frequency).
- **Consultation Management**:
  - Manage schedules, set fees, and track payments.
  - Access consultation and revenue analytics.
- **AI Assistance**:
  - AI agent for patient triage and diagnosis suggestions.
  - Rate AI performance for improvement.
- **Fee Management**:
  - Set/update fees, track payments, and generate financial reports.

---

## Technologies Used
- **Frontend**: 
  - React, TypeScript
  - WebRTC (video calls), Socket.IO (real-time chat)
- **Backend**: 
  - Node.js, Express
  - MongoDB, Mongoose
- **AI/ML**: 
  - NLP models (e.g., Dialogflow) for chatbots
  - **OpenCV** for image analysis in visual diagnosis
  - Speech-to-Text and Text-to-Speech APIs
- **Integrations**: 
  - **WhatsApp API** for chatbot functionality
  - Geolocation APIs for nearby doctors
- **Authentication**: 
  - JWT (JSON Web Tokens)
- **PDF Generation**: 
  - pdfkit
- **Styling**: 
  - CSS (or Tailwind CSS, if applicable)

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git
- WhatsApp Business API credentials (for WhatsApp Chatbot)
- OpenCV installed (for visual diagnosis)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ai-doctor.git
   cd ai-doctor
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file with:
     ```plaintext
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/ai-doctor
     JWT_SECRET=your_jwt_secret
     WHATSAPP_API_KEY=your_whatsapp_api_key
     ```
   - Start the backend:
     ```bash
     npm run start
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

4. **Access the Application**:
   - Visit `http://localhost:3000` (or the specified frontend port).

---

## Usage
- **Patient Registration**:
  - Sign up via the registration form and log in to the Patient Dashboard.
- **Doctor Registration**:
  - Sign up as a doctor (approval may be required) and log in to the Doctor Dashboard.
- **Video Consultation**:
  - Book an appointment, join the video call, use the chat, and download the report.
- **AI Assistance**:
  - Use the web chatbot or WhatsApp for medical queries and image uploads for visual diagnosis.
- **WhatsApp Chatbot**:
  - Add the platform’s WhatsApp number and message the bot for advice or bookings.
- **Visual Diagnosis**:
  - Upload images in the Visual Diagnosis section for AI analysis.

---

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add YourFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request on GitHub.

Adhere to coding standards and include documentation or tests.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or feedback:
- **GitHub Issues**: [Report Issues Here](https://github.com/kmoin1309e/ai-doctor/issues)
