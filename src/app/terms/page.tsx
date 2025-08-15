"use client"

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Navbar from '@/components/navbar';

const TermsOfUse = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'terms-of-use', title: 'Terms of Use' },
    { id: 'subjects', title: 'Subjects' },
    { id: 'conditions', title: 'Conditions' },
    { id: 'general-rules', title: 'General Rules and Conditions' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'baggage-allowance', title: 'Baggage Allowance' },
    { id: 'suppliers-rules', title: 'Suppliers: Rules and Restrictions' },
    { id: 'travel-requirements', title: 'Requirements for Travel' },
    { id: 'ticketing-policies', title: 'Ticketing Policies' },
    { id: 'refunds', title: 'Refunds' },
    { id: 'payment', title: 'Payment' },
    { id: 'disputes', title: 'Disputes' },
    { id: 'limitation-liability', title: 'Limitation of Liability' }
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
                
                <section id="terms-of-use" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Use</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Luxe Skies! These Terms of Use outline the rules and regulations for the use of luxeskies.com.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing this website, we assume you accept these Terms of Use in full. Do not continue to use luxeskies.com if you do not accept all of the Terms of Use stated on this page.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The following terminology applies to these Terms of Use, Privacy Statement and Disclaimer Notice and any or all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website and accepting the Company's Terms of use. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the Client or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services/products, in accordance with and subject to, prevailing law of United States. Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.
                  </p>
                </section>

                <section id="subjects" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Subjects</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>LuxeSkies</strong> – website or juridical entity furthermore referred as "we, us, our".
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>The customer</strong> – a natural or juridical person visiting our Website, furthermore referred to as "you".
                  </p>
                </section>

                <section id="conditions" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In order to use Our website or our services, products:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
                    <li>You must be at least 18 years of age;</li>
                    <li>You must use LuxeSkies in accordance with these Terms of Use;</li>
                    <li>You must have the legal capacity to enter into a binding legal agreement;</li>
                    <li>You must only use the services of LuxeSkies to make reservations of any form offered by Our services, only if You are authorized to do so both on your behalf and on behalf of third parties;</li>
                    <li>All information supplied by You must be true, accurate, current and complete.</li>
                  </ul>
                </section>

                <section id="general-rules" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">General Rules and Conditions</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When You book services using LuxeSkies, You authorize Us, or a third party service provider, to act as Your representative during the process of booking such services from the selected Travel Supplier (defined below). By doing so, You also authorize us to make a payment for the above-mentioned products/and/or services in Your name and on Your behalf, as required. We shall ensure the tickets are issued and will charge You, accordingly, depending on which product You book. The amount You are going to be charged will be displayed before Your booking is confirmed by You. Travel Supplier shall include any travel service providers, including but not limited to airlines, online travel agents, rental car companies, cruise operators, hotels and other short-term lodging facilities, and other providers of travel services.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You are obliged to deliver all data complete and error free, which is necessary for booking. In case the information is inaccurate, incorrect or payment is processed with a credit card from a third person, We may require additional verification.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We are not responsible for scheduled changes or cancellations of Your travel or travel plans by the Travel Supplier. Airlines and other Travel Suppliers may modify, cancel or reschedule the flights, or other travel services, they process. If there are any issues related to the travel booking that have been contracted through Our services, do not hesitate to let Us know about this. We are looking to resolve any situation as soon as possible and within commercially reasonable standards.
                  </p>
                </section>

                <section id="intellectual-property" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Information accessible via the Company site, its original content, features and functionality are and will remain the exclusive property of LuxeSkies and its licensors. The Website is protected by copyright, trademark, and other intellectual property laws. The reproduction or use of the trademarks, commercial names or any other distinctive signs, including the website of LuxeSkies, is prohibited and it will be prosecuted, according to the applicable national and international legislation.
                  </p>
                </section>

                <section id="baggage-allowance" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Baggage Allowance</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Baggage Allowance is reflected on the order confirmation with LuxeSkies and as well as on the e-ticket receipt.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Customer should check directly with the airline, indicated on Your itinerary, for the latest baggage allowance information in order to learn about the permitted count, size, and weight for every type of item You would like to bring on the trip.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Some airlines offer lower fares that do not include luggage. Once You have selected your flight, check the order confirmation to find out if luggage is included in Your fare.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With regard to the policy of charging baggage fees, it can be changed at any time by each airline company. LuxeSkies does not control and has no input into luggage fees charged by airlines. There are airlines that charge baggage fees for any luggage You carry. If Your luggage exceeds the weight, size or number specified in the airline policy, the airline may charge additional charges for carrying luggage. LuxeSkies bears no responsibility or liability for luggage fees you incur and are charged by the airline.
                  </p>
                </section>

                <section id="suppliers-rules" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Suppliers: Rules and Restrictions</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms of Use extend to all services provided by Us related to LuxeSkies, including the services you book through Us from Travel Suppliers; however, Travel Suppliers may have additional terms that may apply to your booking.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We encourage You to study in detail both these Terms of Use and those of the Travel Suppliers, so that You are aware of all the terms, conditions and policies that apply to Your travel services.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Since You are contracting for the booking of travel services through Us, You hereby agree to all fees charged for these travel services, including those additional fees that Travel Suppliers may require. We reserve the right to cancel Your booking if full payment is not received in a timely fashion. Some Travel Suppliers may require You to present a credit card or cash deposit upon check-in to cover additional expenses incurred during Your travel. Such a deposit is unrelated to any payment received by LuxeSkies for Your booking. As such, LuxeSkies bears no responsibility or liability for any additional expenses incurred by You during Your travel.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You agree and understand that any breach of the rules and restrictions of the Travel Suppliers by You may result in the cancellation of Your reservation, the denial of access to the applicable product or travel services, the loss of any funds paid for such reservations and, or the debit of Your account for any costs We incur as a result of such an infringement.
                  </p>
                </section>

                <section id="travel-requirements" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements for Travel</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Not all documents listed below are required for all travel, and requirements vary depending on your destination, connections and visa/passport status. Please consult your local embassy or the government department responsible for posting travel requirements.
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2 mb-4">
                    <li>"Real ID-compliant" – Driver's License, US military ID, US passport or other accepted identification to fly within the United States</li>
                    <li>Valid passport</li>
                    <li>Sometimes visa requirements (for more information contact the Embassy of the visiting country)</li>
                    <li>Depending on the destination, a negative Covid-19 test is required (for more information check the entry requirements of Your destination country)</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    We are not responsible for any risks associated with traveling to different countries or the specific risks that particular countries pose, and We disclaim all liability for any damages or losses related to travel to those particular countries.
                  </p>
                </section>

                <section id="ticketing-policies" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ticketing Policies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Once You have completed Your booking via LuxeSkies, You will receive an Order Confirmation from Us to the email address You provided. This email serves as a proof that You have successfully made an order via LuxeSkies and it reflects Your Passenger(s) details, Itinerary Details and Summary of Charges.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Please note that with the Order Confirmation we acknowledge that the order was received and it is processed by Us or by the third party. The Order Confirmation shall not serve in any case as an electronic ticket or a guarantee to board the plane. Once the payment is received and Your reservation is ticketed, You will receive a separate email with the e-ticket receipt.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The ability to cancel or modify a booked flight is restricted and will depend on the airline's fare rules or other terms and conditions. While some airlines may allow free cancellation within 24 hours after the ticket issuance, this possibility is limited for specific airfares and ticket types. If You wish to cancel Your reservation, please contact Our Support Team representatives and request the cancellation policy of Your ticket.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Changes to name details are restricted by many airlines, therefore in case any change is required, You should be aware that modifications are only allowed in accordance with the airline's policy. Most airlines treat a name change as a cancellation, to which standard conditions and charges would apply.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In case that You request any changes and/or modifications caused by a change in Your travel plans or Your personal circumstances (cancellation or modification), in addition to the terms and conditions of the airline company, Our processing fees will apply.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Post-Ticketing processing fees. Quoted per passenger</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li><strong>Void</strong> – Cancellation requested within 24 hours of booking resulting in refund or reservation changes: <strong>Free</strong></li>
                      <li><strong>Cancellation and refunds</strong> beyond 24 of booking but prior to current scheduled trip departure: <strong>$150.00</strong></li>
                      <li><strong>Changes/exchanges</strong> to existing tickets, prior to current scheduled trip departure: <strong>$150.00</strong></li>
                      <li><strong>Schedule changes handling</strong>, including rebooking to new travel dates or ticket cancellations and refunds: <strong>$50.00</strong></li>
                      <li><strong>Agent assisted waivers</strong>, including name corrections, refund and exchange exceptions, or no-shows: <strong>$50.00</strong></li>
                    </ul>
                  </div>
                </section>

                <section id="refunds" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Refunds</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Voluntary Cancellation by Passengers</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We understand that travel plans can often change. If You wish to cancel Your booking, depending on Your ticket policy, You may be eligible for a partial refund.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Ticket cancellation must be done at least 24 hours prior to the scheduled departure time. Passengers holding tickets that were not canceled prior to the departure, passengers who did not show up for the flight or did not board after the check-in process, might not be eligible for a refund.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Refunds must be requested only within the ticket validity period and are only possible if/should the fare rules of the purchased ticket permit it. If You purchased a discounted fare, this may be partially or completely non-refundable.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    For partially used tickets, the refundable amount will be recalculated according to the unused sector and only if the airline policy allows. If there is no ticket value left, the unused tax (if any) will be refunded.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If Your ticket is not eligible for a refund, We will offer You alternative options according to the fare rules of your ticket (e-credit or exchange if available).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    When refunding the ticket, additional flight services purchased from third parties (e.g. insurance, airport transfer) are not canceled automatically. To cancel these services, please request them directly from the third-party provider of the specific service.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule Changes and Involuntary Cancellation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If the airline company cancels a flight or fails to operate it according to the originally scheduled time, You will have the possibility to choose one of the offered alternatives for Your travel arrangements. We will ensure that You are notified of any significant changes once We become aware of them and We accept no liability for any changes or costs incurred that may result.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You will have the choice of accepting the change of timing or a new travel arrangement offered by the airline. If the changes are not acceptable, You might have the possibility to apply for a refund in accordance with the conditions of carriage. In case You are eligible for a refund, Our processing fee applies, as well as the deduction of non-refundable fees.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Applicable surcharges in case of cancellation of the reservation</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The ability to refund Your ticket is subject to the rules of the ticketed fare and specific terms and conditions of the airline company, therefore administrative fees and penalties may apply.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our services are provided in full by Our agents. By services We mean processing any requests made by You to cancel, change or refund Your ticket. For these services offered by Our company via Our service center, social media, or all other channels, a processing fee of $100 applies. All penalties and fees are calculated per ticket.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Processing fee for customers holding tickets with a Support Package included will be charged in accordance with the type of Package purchased.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Administrative Fees, tips, and/or Support Packages are considered non-refundable charges. Also, any applicable airline penalty or cancellation fee is non-refundable by default and will be deducted from the amount to be returned to You.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We have no influence and therefore cannot be held liable for the outcome of the cancellation/change/refund process, which is the total discretion of the airlines. Nevertheless, the processing fee paid to process Your request, which is not the airline's fee to cancel/change/refund the ticket, is a service provided by Our company and cannot be returned.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Processing Time</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In most cases, the refundable amount will be credited back to the original method of payment; however, there are exceptional situations in which tickets will be refunded via alternative methods such as check or PayPal. We will issue refunds for eligible tickets within 20 business days for credit/debit card purchases, but please note that this does not include Your own bank processing time.
                  </p>
                </section>

                <section id="payment" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When You make a booking via LuxeSkies, You will need to provide us with the accurate credit or debit card details. By providing Your credit or debit card information, you authorize LuxeSkies, or a third party service provider of LuxeSkies, to charge You for the total amount of travel services. You may see multiple charges: "Fares" and "Taxes and Fees" for the travel services equally the Total Amount as quoted in your booking.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If We encounter any issues while processing Your payment, We will notify You. We will not be liable for any subsequent price increase as a result of payment failure. Any price increases are reviewed with and agreed upon by You before the booking will be made.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Neither LuxeSkies nor any third party service provider will be under any obligation to issue tickets before the payment process has been completed. You will receive Your booking confirmation and electronic invoice via email to the address You provided at the time of your booking.
                  </p>
                </section>

                <section id="disputes" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Disputes</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The dispute resolution methods arising from Your use of LuxeSkies will be settled via compulsory arbitration by the American Arbitration Association ("AAA"). By using the LuxeSkies, You agree to the dispute resolution via AAA. These Terms of Use, and any dispute between You and TripRobotics Inc., shall be governed by the laws of the state of Delaware without regard to principles of conflicts of law. You can decline agreeing to arbitrate by sending an arbitration opt out letter to hello@luxeskies.com within thirty (30) days of first accepting these Terms of Use.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing the Website to use LuxeSkies, you agree with the Terms of Use that we impose. We are not responsible for the fact that You have not thoroughly studied all that is stated in these Terms of use.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Procedure for Resolution of Disputes</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Prior to initiating arbitration, We endeavor to solve the problem in the most economical and benevolent manner for all the parties involved. Respectively, You agree to solve any conflict or petition relating in any way to LuxeSkies any interaction with our customer service agents, and any services and products furnished by Travel Suppliers by getting in touch with Our customer support.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Credit Card Chargebacks</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have the ability to dispute charges with credit card companies ("chargebacks"). If You have a question about a charge on your credit card statement, we encourage you to call customer support and the Travel Supplier prior to disputing a charge with Your credit card company to discuss any questions or concerns about the charges. We retain the right to cancel any travel reservation in the event of a chargeback related to that reservation.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By using LuxeSkies to make a reservation with a Travel Supplier, You accept and agree to the relevant cancellation policy of that Travel Supplier. In all cases, the cancellation policy of each reservation is made available on our Website when you are making your booking. Please note that certain rates or special offers are not eligible for cancellation or change. By using our service to make a reservation with a Supplier, you waive the right to any chargeback claims mentioned below. LuxeSkies and its Travel Suppliers deem the following chargeback scenarios as improper and retains the right to investigate and rebut any such chargeback claims, including the right to recover costs of such chargeback claims from You:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
                    <li>Chargebacks resulting from non-cancellable reservations in the event that LuxeSkies or the Travel Supplier cannot provide a refund, whether or not the reservation is used.</li>
                    <li>Chargebacks resulting from cardholder decision to not use a service made available by a Travel Supplier and did not have the right to a refund (e.g., cardholder did not show up for a scheduled flight, and did not cancel in advance).</li>
                    <li>Chargebacks arising from the non-compliance with these Terms of Use and policies regarding the cancellation, the refund.</li>
                    <li>Chargebacks resulting from charges authorized by family, friends, associates or other third parties with direct access to You, the User's, credit card.</li>
                    <li>Chargebacks arising from the Travel Supplier's failure to deliver a product or service in a manner that's consistent with the Travel Supplier's product description but that You may no longer want or need.</li>
                    <li>Chargebacks resulting from the cardholder's decline to use the available services due to concerns related to COVID-19 or of travel restrictions on the cardholder.</li>
                    <li>Chargebacks resulting from force majeure or other circumstances (including the bankruptcy of the LuxeSkies or Travel Suppliers) that are beyond the control of LuxeSkies or its affiliates.</li>
                  </ul>
                </section>

                <section id="limitation-liability" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All information contained on Our website is disseminated as is and without any guarantee of accuracy or being free from errors or omissions. We do not guarantee in any way the timeliness, accuracy or availability of information unless these are guaranteed by statute or other laws and international treaties.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In no event, including, but not limited to negligence, will, LuxeSkies, including its respective officers, directors, employees, representatives, parents, subsidiaries, affiliates, distributors, suppliers, licensors, agents or others involved in creating, sponsoring, promoting, or otherwise making available the Website, LuxeSkies and its contents (collectively the "Covered Parties"), be liable to any person or entity for any injury, loss, claim, damage or for any special, punitive, exemplary, direct, indirect, incidental, compensatory or consequential damages of any kind, regardless of whether are based on the contract, tort, negligence, offenses, strict liability or otherwise, arising out of or in any way related with the activities or business of our Company.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This includes but is not limited to: (i) loss of goodwill, profits, business interruption, data or other intangible losses; (ii) the use, or inability to use, unauthorized use of, performance or non-performance of the Website or the services or materials on the Website or the reserved travel reservations through the call center, even if they are informed about the possibility of such damages; (iii) unauthorized access to or tampering with Your personal information or transmissions.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You agree to these terms and conditions by accessing or using our product. You may not purchase or use the product if you disagree with these terms.
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
        className="fixed bottom-8 right-8 bg-[#0ABAB5] hover:bg-[#089e99] text-white p-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default TermsOfUse;