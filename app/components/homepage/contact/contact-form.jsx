"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import { useState, useEffect, useRef, useCallback } from "react";
import { TbMailForward } from "react-icons/tb";
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheck, FiShield } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { m as motion, AnimatePresence } from "framer-motion";
import { personalData } from '@/utils/data/personal-data';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

function ContactFormContent({ executeRecaptcha, configuration, configurationLoading, retryVerification }) {
  const [formState, setFormState] = useState({
    name: { value: "", focused: false, valid: true },
    email: { value: "", focused: false, valid: true },
    message: { value: "", focused: false, valid: true },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submitting = useRef(false);
  const resetTimer = useRef(null);
  useEffect(() => () => clearTimeout(resetTimer.current), []);
  const formRef = useRef(null);

  // Validate form fields
  const validateField = (field, value) => {
    if (field === 'email') {
      return value.trim() !== "" && isValidEmail(value.trim());
    }
    return value.trim() !== "";
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        valid: validateField(field, value)
      }
    }));
  };

  // Handle focus state
  const handleFocus = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        focused: true
      }
    }));
  };

  // Handle blur state
  const handleBlur = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        focused: false,
        valid: validateField(field, prev[field].value)
      }
    }));
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    const updatedFormState = Object.fromEntries(Object.entries(formState).map(([field, state]) => [field, { ...state, valid: validateField(field, state.value) }]));
    setFormState(updatedFormState);
    if (Object.values(updatedFormState).some(state => !state.valid)) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    if (!configuration?.ready) {
      setSubmissionError("The form is temporarily unavailable. Please use the email link below, or retry verification.");
      return;
    }
    if (!executeRecaptcha) {
      setSubmissionError("Verification hasn't loaded. Check your connection, allow Google reCAPTCHA, then retry verification.");
      return;
    }
    submitting.current = true;
    setIsLoading(true);
    setSubmissionError("");
    try {
      let token;
      let timeout;
      try {
        token = await Promise.race([
          executeRecaptcha('contact_form'),
          new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Verification timed out. Please retry verification.')), 12000); })
        ]);
        if (!token) throw new Error('Verification did not complete. Please retry verification.');
      } catch (error) {
        throw new Error(error.message?.includes('Verification') ? error.message : 'Verification could not load. Please retry verification.');
      } finally { clearTimeout(timeout); }
      const { default: axios } = await import("axios");
      const response = await axios.post('/api/contact', {
        name: formState.name.value.trim(),
        email: formState.email.value.trim(),
        message: formState.message.value.trim(),
        recaptchaToken: token
      }, { timeout: 30000 });
      if (!response.data.success) throw new Error(response.data.message || 'Your message could not be sent. Please try again.');
      setFormSubmitted(true);
      toast.success(response.data.message || "Message sent successfully!");
      resetTimer.current = setTimeout(() => {
        setFormState({
          name: { value: "", focused: false, valid: true },
          email: { value: "", focused: false, valid: true },
          message: { value: "", focused: false, valid: true },
        });
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      const message = error?.response?.data?.message || (error.code === 'ECONNABORTED'
        ? 'Sending took too long. Please contact Plan by email before retrying to avoid a duplicate message.'
        : error.message === 'Network Error' ? 'Unable to connect. Your text is still here; check your connection and try again.' : error.message) || 'Your message could not be sent. Please try again.';
      setSubmissionError(message);
      toast.error(message);
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-[#16f2b3]"></div>
        <h2 className="font-bold text-[#16f2b3] text-xl uppercase tracking-wider">Connect with me</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.2
        }}
        className="max-w-3xl text-white rounded-xl border border-[#464c6a] p-6 lg:p-8 backdrop-blur-sm bg-gradient-to-br from-[#10172d]/90 to-[#0d1424]/90 shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm md:text-base text-[#d3d8e8] mb-8 leading-relaxed"
        >
          {"If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."}
        </motion.p>

        <AnimatePresence>
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}
                >
                  <FiCheck className="text-white text-4xl" />
                </motion.div>
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Thank You!
              </motion.h3>
              <motion.p
                className="text-center text-[#d3d8e8] max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Your message has been received. I'll get back to you as soon as possible.
              </motion.p>
            </motion.div>
          ) : (
            <motion.form
              ref={formRef}
              onSubmit={handleSendMail}
              className="mt-6 flex flex-col gap-5"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Name Input */}
              <div className="relative">
                <div className={`absolute left-3 top-3 transition-all duration-300 ${formState.name.focused || formState.name.value ? 'text-[#16f2b3] -translate-y-9' : 'text-gray-400'}`}>
                  <FiUser className="inline mr-2" />
                  <label htmlFor="contact-name" className="text-sm font-medium">Your Name</label>
                </div>
                <input
                  type="text"
                  className={`bg-[#1a1e2e] w-full border-2 rounded-lg ${!formState.name.valid ? 'border-red-500' : formState.name.focused ? 'border-[#16f2b3]' : 'border-[#353a52]'} focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-4 py-3 pt-3 text-white placeholder-transparent`}
                  id="contact-name"
                  name="name"
                  aria-invalid={!formState.name.valid}
                  placeholder="Your Name"
                  value={formState.name.value}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  maxLength="100"
                />
                <AnimatePresence>
                  {!formState.name.valid && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      Please enter your name
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className={`absolute left-3 top-3 transition-all duration-300 ${formState.email.focused || formState.email.value ? 'text-[#16f2b3] -translate-y-9' : 'text-gray-400'}`}>
                  <FiMail className="inline mr-2" />
                  <label htmlFor="contact-email" className="text-sm font-medium">Your Email</label>
                </div>
                <input
                  type="email"
                  className={`bg-[#1a1e2e] w-full border-2 rounded-lg ${!formState.email.valid ? 'border-red-500' : formState.email.focused ? 'border-[#16f2b3]' : 'border-[#353a52]'} focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-4 py-3 pt-3 text-white placeholder-transparent`}
                  id="contact-email"
                  name="email"
                  aria-invalid={!formState.email.valid}
                  placeholder="Your Email"
                  value={formState.email.value}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  maxLength="100"
                />
                <AnimatePresence>
                  {!formState.email.valid && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      Please enter a valid email address
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="relative">
                <div className={`absolute left-3 top-3 transition-all duration-300 ${formState.message.focused || formState.message.value ? 'text-[#16f2b3] -translate-y-9' : 'text-gray-400'}`}>
                  <FiMessageSquare className="inline mr-2" />
                  <label htmlFor="contact-message" className="text-sm font-medium">Your Message</label>
                </div>
                <textarea
                  className={`bg-[#1a1e2e] w-full border-2 rounded-lg ${!formState.message.valid ? 'border-red-500' : formState.message.focused ? 'border-[#16f2b3]' : 'border-[#353a52]'} focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-4 py-3 pt-3 text-white placeholder-transparent`}
                  id="contact-message"
                  name="message"
                  aria-invalid={!formState.message.valid}
                  placeholder="Your Message"
                  value={formState.message.value}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  rows="4"
                  maxLength="5000"
                />
                <AnimatePresence>
                  {!formState.message.valid && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      Please enter your message
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* reCAPTCHA v3 is invisible, no UI component needed */}
              <AnimatePresence>
                {submissionError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-400 mt-1"
                  >
                    {submissionError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="text-xs text-slate-400 leading-relaxed" aria-live="polite">
                {configurationLoading ? 'Loading verification…' : !configuration?.ready ? 'The message form is temporarily unavailable. ' : !executeRecaptcha ? 'Loading Google reCAPTCHA… ' : ''}
                Protected by reCAPTCHA. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline">Terms</a>
                {(submissionError || (!configurationLoading && !configuration?.ready)) && <div className="mt-2 flex flex-wrap gap-4"><button type="button" onClick={retryVerification} disabled={isLoading || configurationLoading} className="text-[#16f2b3] underline">Retry verification</button><a href={`mailto:${personalData.email}`} className="text-[#16f2b3] underline">Email Plan directly</a></div>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="self-center mt-6 relative overflow-hidden group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 rounded-full shadow-lg shadow-blue-500/20"
                disabled={isLoading || configurationLoading}
                aria-busy={isLoading}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <span className="relative flex items-center gap-2 px-8 py-3 bg-[#10172d] rounded-full transition-all duration-300 group-hover:bg-opacity-0">
                  {isLoading ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-5 w-5 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
                      <span className="font-medium">Sending...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-medium">Send Message</span>
                      <TbMailForward size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.div>
                  )}
                </span>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Keep the form mounted when retrying the Google script, so typed messages survive.
const captchaScriptProps = { async: true, defer: true, appendTo: 'head' };
function CaptchaBridge({ onReady }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    onReady(executeRecaptcha);
    return () => onReady(undefined);
  }, [executeRecaptcha, onReady]);
  return null;
}

function ContactForm() {
  const [configuration, setConfiguration] = useState(null);
  const [configurationLoading, setConfigurationLoading] = useState(true);
  const [executeRecaptcha, setExecuteRecaptcha] = useState();
  const [attempt, setAttempt] = useState(0);
  const onReady = useCallback(execute => setExecuteRecaptcha(() => execute), []);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;
    setConfigurationLoading(true);
    fetch('/api/contact', { signal: controller.signal, cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error('Configuration unavailable'); return response.json(); })
      .then(config => { if (active) setConfiguration(config); })
      .catch(() => { if (active) setConfiguration(null); })
      .finally(() => { clearTimeout(timeout); if (active) setConfigurationLoading(false); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  const retryVerification = () => { setExecuteRecaptcha(undefined); setAttempt(value => value + 1); };
  return (
    <div>
      {configuration?.ready && configuration.siteKey && <GoogleReCaptchaProvider key={attempt} reCaptchaKey={configuration.siteKey} scriptProps={captchaScriptProps}>
        <CaptchaBridge onReady={onReady} />
      </GoogleReCaptchaProvider>}
      <ContactFormContent executeRecaptcha={executeRecaptcha} configuration={configuration} configurationLoading={configurationLoading} retryVerification={retryVerification} />
      <ToastContainer />
    </div>
  );
}

export default ContactForm;
