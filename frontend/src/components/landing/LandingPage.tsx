import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from '../shared/ScrollReveal';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';
// Make sure these CSS imports come after the component imports
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    initial: 'P',
    name: 'Priya Sharma',
    role: 'Patient',
    quote: 'The AI assistant helped me understand my symptoms before my doctor\'s appointment. I felt much more prepared and less anxious!'
  },
  {
    initial: 'D',
    name: 'Dr. Rahul Mehta',
    role: 'Cardiologist',
    quote: 'The chatbot pre-screening has reduced my administrative workload by 40%. I can now focus on patients who truly need my expertise.'
  },
  {
    initial: 'A',
    name: 'Anita Patel',
    role: 'Patient',
    quote: 'Being able to access all my medical records in one place has been life-changing. I no longer have to carry folders of documents to each appointment.'
  },
  {
    initial: 'S',
    name: 'Dr. Sarah Johnson',
    role: 'Pediatrician',
    quote: 'The platform has transformed how I manage my practice. The AI integration is remarkable for initial patient assessments.'
  },
  {
    initial: 'M',
    name: 'Mike Chen',
    role: 'Patient',
    quote: 'Quick, efficient, and accurate. The AI suggestions were spot-on, and connecting with specialists was seamless.'
  }
];

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white scroll-smooth">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo section */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900">MediConnect AI</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</button>
          </nav>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <ScrollReveal variant="up">
          <section className="py-20 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Healthcare Reimagined with <span className="text-blue-600">AI</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Instant medical insights, seamless doctor connections, and intelligent health management—all in one platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium hover-card">
                    Get Started
                  </button>
                  <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-lg font-medium hover-card">
                    See Demo
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 sm:h-80 md:h-96">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500">
                  <img 
                    src="/images/image.png" 
                    alt="AI-powered healthcare" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Features Section */}
        <ScrollReveal variant="right">
          <section id="features" className="py-16 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">Powerful Features</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform combines AI technology with healthcare expertise to create a seamless experience for both patients and doctors.
                </p>
              </div>
              
              <div className="flex justify-center mb-10">
                <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('patients')}
                    className={`px-6 py-2 rounded-md ${activeTab === 'patients' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
                  >
                    For Patients
                  </button>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className={`px-6 py-2 rounded-md ${activeTab === 'doctors' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
                  >
                    For Doctors
                  </button>
                </div>
              </div>
              
              {activeTab === 'patients' ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Medical Records</h3>
                    <p className="text-gray-600">
                      Store and access your complete medical history, reports, and past consultations in one secure place.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Medical Assistant</h3>
                    <p className="text-gray-600">
                      Get instant medical insights and preliminary diagnoses through our AI-powered assistant available 24/7.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Connection</h3>
                    <p className="text-gray-600">
                      Easily connect with qualified doctors for virtual consultations when you need expert medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Management</h3>
                    <p className="text-gray-600">
                      Set your availability, manage appointments, and organize your patient schedule efficiently.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chatbot Creation</h3>
                    <p className="text-gray-600">
                      Create your own AI-powered WhatsApp chatbot to handle patient inquiries and pre-screen cases.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Management</h3>
                    <p className="text-gray-600">
                      Set your consultation fees, manage payments, and track your earnings in one convenient dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* How It Works Section */}
        <ScrollReveal variant="left">
          <section id="how-it-works" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform simplifies healthcare by connecting patients with AI assistance and qualified doctors.
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                      1
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
                  <p className="text-gray-600">
                    Sign up and create your health profile with medical history and concerns.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                      2
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Consultation</h3>
                  <p className="text-gray-600">
                    Describe your symptoms to get initial insights from our AI medical assistant.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                      3
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Connection</h3>
                  <p className="text-gray-600">
                    If needed, connect with a qualified doctor for a virtual consultation.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                      4
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow Up</h3>
                  <p className="text-gray-600">
                    Receive follow-up care and easy access to your medical records and treatment plans.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Testimonials Section */}
        <ScrollReveal variant="up">
          <section id="testimonials" className="py-16 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Healthcare professionals and patients alike trust our platform for reliable medical assistance.
                </p>
              </div>
              
              <div className="testimonials-slider px-4">
                <Slider {...sliderSettings}>
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="px-2">
                      <div className="testimonial-card bg-gray-50 p-6 rounded-xl h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-bold">{testimonial.initial}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">"{testimonial.quote}"</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Pricing Section */}
        <ScrollReveal variant="right">
          <section id="pricing" className="py-16 bg-gray-50/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the plan that works best for your healthcare needs.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="pricing-card bg-white p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                  <p className="text-gray-600 mb-6">For occasional healthcare needs</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$9</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>AI Medical Assistant</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Basic Medical Records</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>3 Doctor Consultations/month</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
                
                <div className="pricing-card bg-white p-8 rounded-xl shadow-md border-2 border-blue-600 transform md:-translate-y-4">
                  <div className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-2">Most Popular</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                  <p className="text-gray-600 mb-6">For regular healthcare management</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$19</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Advanced AI Medical Assistant</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Complete Medical Records</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>10 Doctor Consultations/month</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Priority Support</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>

                <div className="pricing-card bg-white p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <p className="text-gray-600 mb-6">For healthcare providers</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>All Pro Features</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Custom AI Chatbot</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Unlimited Consultations</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Dedicated Support</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <ScrollReveal variant="up">
        <footer className="bg-gray-900/95 backdrop-blur-md text-white py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">MediConnect AI</span>
                </div>
                <p className="text-gray-400">
                  Revolutionizing healthcare with AI technology.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400">support@mediconnect.ai</li>
                  <li className="text-gray-400">+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} MediConnect AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
};
