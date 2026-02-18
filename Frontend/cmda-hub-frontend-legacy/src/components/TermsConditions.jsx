// import React from 'react'

// import Navbar from './Navbar'
// import Footer from './Footer'

// const TermsConditions = () => {
//   return (
//     <div>
//       <Navbar/>
//       <div className='m-20 '>
//       <h1 className='text-2xl font-bold'>Terms and Conditions</h1>
//       <p>
              
//         By providing your contact information and opting to accept phone calls, emails, and SMS communication from us, you will receive program brochures, benefits, domain information, webinar participation details, and other relevant information to help you make an informed decision about enrolling in our program. Your privacy is important to us, and your preferred communication channels will be used exclusively for educational purposes related to our offerings.
// <br></br>
//        <h4> Academic Regulations</h4>
//         All academic and accredited programs are subject to academic rules, regulations and applicable domestic legislation which will be published and revised from over time. CMDA Learning is obligated to make personal academic information available to regulatory and administrative bodies for academic and statistical purposes, if required.

//        <h4> Application Fee</h4>

//         Fees are different as per each course and as prescribed by the admission team. CMDA reserves the right to amend fee for any of the courses from time to time.

//        <h4> Enrollment</h4>

//         By enrolling as a student, the student agrees to abide by the Rules and Regulations of CMDA. These currently include general disciplinary rules and regulations relating to examinations, assessments, learning, training, fees, and placements. Please note these may change from time to time at the sole discretion of CMDA. CMDA will make reasonable efforts to keep you informed of any such changes.
//       </p>
//       </div>
//       <div className='m-20'>
//       <h1 className='text-2xl font-bold'>Privacy Policy</h1>
//         <h3>Overview</h3>
//         <p>
            
//             ‘CMDA’ respects its user’s privacy and is committed to protecting any personal information you share with us. This Privacy Policy (“Privacy Policy”) describes how we, CMDA Pvt. Ltd. (“CMDA” or “we”) collect, use and share information about our users (“you/ your”) through our Platform.

//             This Privacy Policy applies to your use of all our websites, products or services, and any interaction with us at any time by email, telephone or any other means.

//             CMDA has taken every eﬀort to ensure your information is secure. This privacy policy covers what information is collected, how it is used, and what you can do about it. It also describes your choices regarding the use, access and correction of your personal information. The use of information collected through our Service(s) shall be limited to the purpose of providing the service for which you have engaged CMDA. In the event of a sale or a transfer of all or a portion of our business assets, consumer information may be one of the business assets that are transferred as part of the transaction. If you do not agree with these Terms, then please do not provide any Personally Identiﬁable Information to us. If you refuse or withdraw your consent, or if you choose not to provide us with any required Personally Identiﬁable Information, we may not be able to provide you with the services that can be oﬀered on our Platform.
//             <br></br>
//             <br></br>

//                   <b> BY USING OUR SERVICES OR BY GIVING US YOUR INFORMATION, YOU AGREE TO THE TERMS OF THIS PRIVACY POLICY.</b> <br>
//                   </br>
//         Please read this Privacy Policy carefully, as it governs how you use CMDA and its aﬃliate products.
//         <br></br>
//        <h2> Use of your Personal Information and Other</h2>
       
//         <h4> Data Purpose</h4>
//         <br></br>
//         We collect personal information as part of the usage of our website, products and services

//        <h4> Legal Basis for collecting personal information</h4>
//        <ul>
//         <li>
//         the user has given consent to the processing of his or her personal data for one or more speciﬁc purposes;
       
//         </li>
//         <li>
//         Processing is necessary for the performance of a contract to which the data subject is the party or in order to take steps at the request of the data subject prior to entering into a contract;
//         </li>
//        </ul>
//         You have complete control over the privacy of your information. Your information will never be sold, exchanged or disclosed to third parties for marketing purposes. You can opt to receive oﬀers from us. You can browse our website without registration. We may collect and store the information that you voluntarily disclose to us, in order to access our free tests and discussion forum.

//       <h4>  What information do we collect?</h4>
//         Personally Identiﬁable Information

//         We may collect the below-mentioned personal information from you in the following situations

//         When you visit our website and voluntarily provide the following information via one of our contact forms, via a chat or phone session, or as part of a purchase of one of our courses or register on our site:

//       <ul>
//         <li>
//         Contact Information, such as name, email address, mailing address, phone number, IP address
//         </li>
//         <li>
//         Information about your business, such as company name, company size, business type</li>
//         <li>
//         Billing Information, such as credit card number and billing address
//         Note: All payment transactions are processed through secure payment gateway providers. We do not store any card information (other than the last 4 digits of your card) on our servers.
//         </li>
//       </ul>

//         When you use our Learning Management System (such as StartOnboard) or our support system or respond to our surveys:

//         Contact Information, such as name, email address, mailing address, IP address, geographic location, or phone number
//         Unique Identiﬁers, such as username, or password
//         Name and e-mail address when you provide feedback from the Service(s)Users may visit our Website anonymously. We will collect personal identiﬁcation information from Users only if they voluntarily submit such information to us.
//         </p>
//       <h3>  Contact Imarticus Learning/Privacy Oﬃcer</h3>
// For any questions regarding this privacy policy, you can email us  at {' '}
//         <a href='mailto:info@example.com'>CMDA123@gmail.com</a> or{' '}
//         <a href='tel:+1234567890'>8378895600</a>.
//       </div>
//       <Footer/>
//     </div>
//   )
// }

// export default TermsConditions




import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-slate-800 dark:text-white">
      <Navbar />
      <div className="container mx-auto pt-24 sm:px-6 ">
        {/* Terms and Conditions Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-sky-600 pb-3 dark:text-white">
            Terms and Conditions
          </h1>
          <div className="prose prose-sm max-w-none text-gray-700 space-y-6 dark:text-white">
            <p>
              By providing your contact information and opting to accept phone calls, emails, and SMS communication from us, you will receive program brochures, benefits, domain information, webinar participation details, and other relevant information to help you make an informed decision about enrolling in our program. Your privacy is important to us, and your preferred communication channels will be used exclusively for educational purposes related to our offerings.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white">Academic Regulations</h2>
              <p>
                All academic and accredited programs are subject to academic rules, regulations, and applicable domestic legislation, which will be published and revised from time to time. CMDA Learning is obligated to make personal academic information available to regulatory and administrative bodies for academic and statistical purposes, if required.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white" >Application Fee</h2>
              <p>
                Fees vary by course and are prescribed by the admission team. CMDA reserves the right to amend fees for any of the courses from time to time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white">Enrollment</h2>
              <p>
                By enrolling as a student, you agree to abide by the Rules and Regulations of CMDA. These currently include general disciplinary rules and regulations relating to examinations, assessments, learning, training, fees, and placements. Please note these may change from time to time at the sole discretion of CMDA. CMDA will make reasonable efforts to keep you informed of any such changes.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-sky-600 pb-3 dark:text-white">
            Privacy Policy
          </h1>
          <div className="prose prose-sm max-w-none text-gray-700 space-y-6 dark:text-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white">Overview</h2>
              <p>
                CMDA respects its users’ privacy and is committed to protecting any personal information you share with us. This Privacy Policy (“Privacy Policy”) describes how we, CMDA Pvt. Ltd. (“CMDA” or “we”), collect, use, and share information about our users (“you/your”) through our Platform.
              </p>
              <p>
                This Privacy Policy applies to your use of all our websites, products, or services, and any interaction with us at any time by email, telephone, or any other means.
              </p>
              <p>
                CMDA has taken every effort to ensure your information is secure. This Privacy Policy covers what information is collected, how it is used, and what you can do about it. It also describes your choices regarding the use, access, and correction of your personal information. The use of information collected through our Service(s) shall be limited to the purpose of providing the service for which you have engaged CMDA. In the event of a sale or a transfer of all or a portion of our business assets, consumer information may be one of the business assets that are transferred as part of the transaction. If you do not agree with these Terms, then please do not provide any Personally Identifiable Information to us. If you refuse or withdraw your consent, or if you choose not to provide us with any required Personally Identifiable Information, we may not be able to provide you with the services that can be offered on our Platform.
              </p>
              <p className="font-semibold text-gray-800 dark:text-white">
                BY USING OUR SERVICES OR BY GIVING US YOUR INFORMATION, YOU AGREE TO THE TERMS OF THIS PRIVACY POLICY.
              </p>
              <p>
                Please read this Privacy Policy carefully, as it governs how you use CMDA and its affiliate products.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white">Use of Your Personal Information</h2>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3 dark:text-white">Data Purpose</h3>
              <p>
                We collect personal information as part of the usage of our website, products, and services.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3 dark:text-white">Legal Basis for Collecting Personal Information</h3>
              <ul className="list-disc pl-5 space-y-2 dark:text-white">
                <li>The user has given consent to the processing of his or her personal data for one or more specific purposes;</li>
                <li>Processing is necessary for the performance of a contract to which the data subject is a party or in order to take steps at the request of the data subject prior to entering into a contract;</li>
              </ul>
              <p>
                You have complete control over the privacy of your information. Your information will never be sold, exchanged, or disclosed to third parties for marketing purposes. You can opt to receive offers from us. You can browse our website without registration. We may collect and store the information that you voluntarily disclose to us, in order to access our free tests and discussion forum.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3 dark:text-white">What Information Do We Collect?</h3>
              <p className="font-medium dark:text-white">Personally Identifiable Information</p>
              <p>
                We may collect the below-mentioned personal information from you in the following situations:
              </p>
              <p>
                When you visit our website and voluntarily provide the following information via one of our contact forms, via a chat or phone session, or as part of a purchase of one of our courses or register on our site:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact Information, such as name, email address, mailing address, phone number, IP address</li>
                <li>Information about your business, such as company name, company size, business type</li>
                <li>
                  Billing Information, such as credit card number and billing address
                  <br />
                  <span className="italic text-gray-600 dark:text-white">
                    Note: All payment transactions are processed through secure payment gateway providers. We do not store any card information (other than the last 4 digits of your card) on our servers.
                  </span>
                </li>
              </ul>
              <p>
                When you use our Learning Management System (such as StartOnboard) or our support system or respond to our surveys:
              </p>
              <ul className="list-disc pl-5 space-y-2 dark:text-white">
                <li>Contact Information, such as name, email address, mailing address, IP address, geographic location, or phone number</li>
                <li>Unique Identifiers, such as username, or password</li>
                <li>Name and e-mail address when you provide feedback from the Service(s)</li>
              </ul>
              <p>
                Users may visit our Website anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 dark:text-white">Contact CMDA Learning/Privacy Officer</h2>
              <p>
                For any questions regarding this privacy policy, you can email us at{' '}
                <a href="mailto:CMDA123@gmail.com" className="text-sky-600 hover:text-cyan-600 transition-colors duration-200 dark:text-sky-500">
                  admin@aycanalytics.com
                </a>{' '}
                or call{' '}
                <a href="tel:+919860998411" className="text-sky-600 hover:text-cyan-600 transition-colors duration-200 dark:text-sky-500">
                  +91 9860998411
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;