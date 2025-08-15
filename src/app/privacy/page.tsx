"use client"

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Navbar from '@/components/navbar';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'privacy-policy', title: 'Privacy Policy' },
    { id: 'personal-data-collecting', title: 'Personal Data Collecting' },
    { id: 'purpose-of-policy', title: 'Purpose of This Privacy Policy' },
    { id: 'personal-information', title: 'Personal Information' },
    { id: 'methods-collecting', title: 'Methods Used for Collecting Your Personal Information' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'electronic-communications', title: 'About Electronic Communications' },
    { id: 'third-parties', title: 'Cases of Transmitting Information to Third Parties' },
    { id: 'data-protection', title: 'How We Store and Protect Your Data' },
    { id: 'retention-period', title: 'Retention Period' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'tracking-tools', title: 'Controlling Tracking Tools and Quitting Online Advertising' },
    { id: 'european-legislation', title: 'Personal Information According to European Legislation' },
    { id: 'customer-rights', title: 'Customers Rights According to European Legislation' },
    { id: 'california-residents', title: 'Privacy Notice for California Residents' },
    { id: 'transitional-arrangements', title: 'Transitional Arrangements' },
    { id: 'contact-information', title: 'Contact Information' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isDarkBackground={false} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-teal-50 text-[#0ABAB5] font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="prose prose-gray max-w-none">
                
                <section id="privacy-policy" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. It is Luxe Skies' policy to respect your privacy regarding any information we may collect from you across our website, luxeskies.com, and other sites we own and operate.
                  </p>
                </section>

                <section id="personal-data-collecting" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Data Collecting</h2>
                  <p className="text-gray-700 leading-relaxed">
                    One of the most important things for us is to protect your personal data. In this order we collect information rightfully, acting with integrity, confidentiality, and with great certainty. We DO NOT share or sell personal information with third part.
                  </p>
                </section>

                <section id="purpose-of-policy" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Purpose of This Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    What is the purpose of the privacy policy we set out below? In fact, the goal is a well-defined one that will accurately describe how our company collects and handles customer's personal data and at the same time we also talk about any other data customers provide through different platforms when they buy a product or service or subscribe to our Newsline.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The purpose of this statement is to inform you about the procedures we have approached to protect your personal data successfully.
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>This policy refers to our website, text messages, emails, and social account.</li>
                    <li>By using one of our platforms, you hereby agree to our Terms and Conditions.</li>
                    <li>We do not intend to knowingly collect information from children.</li>
                  </ul>
                </section>

                <section id="personal-information" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "Personal information" is data that identifies, relates to, describes, can be used to contact, or could reasonably be linked directly or indirectly to you. For purposes of this Policy, there is no meaningful distinction between the terms "personal information" and "personal data."
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may collect, use and transfer the following types of personal data:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Identity Data:</strong> first name, maiden name, last name, username or similar identifier, marital status, title, date of birth, photographs, national insurance number, job title, vehicle registration number(s), age, and gender</li>
                    <li><strong>Contact Data:</strong> billing address, delivery address, personal email, and phone numbers</li>
                    <li><strong>Booking data:</strong> traveler's name, frequent flyer details, passport number, redress control number, country of citizenship, booking reference number, and itinerary details</li>
                    <li><strong>Financial Data:</strong> bank account and payment card details</li>
                    <li><strong>Transaction Data:</strong> details about payments and donations from you and details of products and services you have purchased</li>
                    <li><strong>Technical Data:</strong> IP address, login data, browser type and version, time zone settings, geolocation, device information</li>
                    <li><strong>Profile Data:</strong> username and password, purchases, interests, preferences, feedback and survey responses</li>
                    <li><strong>Usage Data:</strong> information about how you use the Site, products, and services</li>
                    <li><strong>Marketing and Communications Data:</strong> your preferences in receiving marketing communications</li>
                  </ul>
                </section>

                <section id="methods-collecting" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Methods Used for Collecting Your Personal Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At this time, the methods we and our third-party service provider use to collect your personal data are:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Direct Information:</strong> Personal information you provide directly when you register, book travel, or contact customer support</li>
                    <li><strong>Automatic Collection:</strong> Information collected through cookies and similar technologies when you visit our website</li>
                    <li><strong>Voice Calls:</strong> Recording or monitoring calls for quality control and training purposes</li>
                    <li><strong>Third-Party Sources:</strong> Information from public databases, marketing partners, and social media platforms</li>
                    <li><strong>Location Data:</strong> Device location information to help find nearby services</li>
                  </ul>
                </section>

                <section id="how-we-use" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may use your Personal Information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>To complete and fulfill your booking or purchase, including payment processing</li>
                    <li>To authenticate your account and ensure security</li>
                    <li>To communicate about your account and provide customer service</li>
                    <li>To send marketing communications about relevant products and services</li>
                    <li>To personalize your experience and present tailored content</li>
                    <li>For business purposes such as data analysis, fraud prevention, and service improvement</li>
                    <li>To comply with legal obligations and protect our business</li>
                  </ul>
                </section>

                <section id="electronic-communications" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About Electronic Communications</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may communicate with you via electronic messages, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Service Communications:</strong> Booking confirmations, updates, security alerts, and administrative messages</li>
                    <li><strong>Marketing Communications:</strong> Information about contests, offers, promotions, and travel opportunities</li>
                    <li><strong>SMS Services:</strong> Text messages for booking updates and marketing (with your consent)</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    You can opt out of marketing communications at any time by clicking "unsubscribe" in emails or replying "STOP" to SMS messages.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-blue-800 font-medium">Contact Information for SMS Service:</p>
                    <p className="text-blue-700">Telephone: +1 (888) 830-7444</p>
                    <p className="text-blue-700">Email: support@luxeskies.com</p>
                  </div>
                </section>

                <section id="third-parties" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cases of Transmitting Information to Third Parties</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may transmit your data to third parties only in the following cases:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>With your explicit consent</li>
                    <li>When strictly necessary to provide our services</li>
                    <li>For legal proceedings or litigation</li>
                    <li>To protect the integrity and transparency of our company</li>
                    <li>With business partners for fraud detection and service improvement</li>
                  </ul>
                </section>

                <section id="data-protection" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Store and Protect Your Data</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our servers and data centers are located in many countries. We have adopted appropriate security measures to prevent unauthorized access, alteration, or disclosure of your personal data.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We restrict access to your personal data only to employees, agents, and contractors who need to know for business purposes. All personnel are subject to confidentiality obligations.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      <strong>Security Notice:</strong> If you believe your account security has been compromised, please contact us immediately at support@luxeskies.com
                    </p>
                  </div>
                </section>

                <section id="retention-period" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Retention Period</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To establish the necessary retention period for personal data, we examine the amount, nature, and vulnerability of the personal data, the purposes for processing, and applicable legal requirements.
                  </p>
                </section>

                <section id="cookies" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    A cookie is a type of message given to a web browser by a web server to determine users and prepare customized web pages. We use cookies to collect information about client preferences and browsing methods.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Types of cookies we use:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>First-party cookies:</strong> Sent from our website domain</li>
                    <li><strong>Third-party cookies:</strong> Sent from external domains</li>
                    <li><strong>Session cookies:</strong> Temporary cookies deleted when you close your browser</li>
                    <li><strong>Persistent cookies:</strong> Remain stored for a predetermined period</li>
                    <li><strong>Technical cookies:</strong> Essential for website operation</li>
                    <li><strong>Analytical cookies:</strong> Help us understand website usage</li>
                    <li><strong>Marketing cookies:</strong> Used for personalized advertising</li>
                  </ul>
                </section>

                <section id="tracking-tools" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Controlling Tracking Tools and Quitting Online Advertising</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You can control cookies through your browser settings. However, blocking cookies may affect website functionality. We may use Google Analytics to collect demographic and interest data to provide better services.
                  </p>
                </section>

                <section id="european-legislation" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information According to European Legislation</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    For users in Europe, we process personal data based on the following legal grounds:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Contract Performance:</strong> To fulfill our contractual obligations</li>
                    <li><strong>Legitimate Interest:</strong> For business operations, fraud prevention, and service improvement</li>
                    <li><strong>Legal Compliance:</strong> To meet legal and regulatory requirements</li>
                    <li><strong>Consent:</strong> Where you have given explicit permission</li>
                  </ul>
                </section>

                <section id="customer-rights" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Rights According to European Legislation</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Under European legislation, you have the following rights:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Restriction:</strong> Request limitation of processing</li>
                    <li><strong>Portability:</strong> Request transfer of your data</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interest</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                  </ul>
                </section>

                <section id="california-residents" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Notice for California Residents</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This section applies to California residents and complies with the California Consumer Privacy Act (CCPA).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Your CCPA Rights:</strong>
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Right to Know:</strong> Request information about data collection and use</li>
                    <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
                    <li><strong>Right to Opt-Out:</strong> Opt out of sale of personal information</li>
                    <li><strong>Non-Discrimination:</strong> We will not discriminate for exercising your rights</li>
                  </ul>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium">Important Note:</p>
                    <p className="text-green-700">Our Company does not sell your personal information to third parties.</p>
                  </div>
                </section>

                <section id="transitional-arrangements" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Transitional Arrangements</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Please keep in mind that our privacy policy may change over time. We will never restrict your rights to personal data protection. All changes will be announced in advance with the date of the last update posted.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Your continued use of our Website following the posting of changes constitutes your acceptance of such changes.
                  </p>
                </section>

                <section id="contact-information" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions or comments about this Privacy Policy, or wish to exercise your rights, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-800 font-medium mb-2">Luxe Skies Customer Support</p>
                    <p className="text-gray-700">Email: support@luxeskies.com</p>
                    <p className="text-gray-700">Phone: +1 (888) 830-7444</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-6">
                    <strong>Last Update:</strong> June 24, 2024
                  </p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-[#0ABAB5] hover:bg-[#089e99] text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default PrivacyPolicy;