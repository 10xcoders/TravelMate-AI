import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "../AuthDialog/AuthDialog";
import { useGoogleAuth } from "@/services/Auth";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaUserFriends, FaRegClock } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { PiAirplaneTakeoffDuotone } from "react-icons/pi";

export default function LandingPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleAuth(() => {
    setOpenDialog(false);
    navigate("/create-trip");
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/create-trip");
    }
  }, [navigate]);

  const features = [
    {
      icon: <FaMapMarkedAlt className="w-6 h-6" />,
      title: "AI-Powered Itineraries",
      description:
        "Smart algorithms create personalized travel plans that match your unique preferences.",
    },
    {
      icon: <MdOutlineAttachMoney className="w-6 h-6" />, // Updated this icon
      title: "Budget-Friendly Options",
      description:
        "Find accommodations and activities that fit your budget, from economy to luxury.",
    },
    {
      icon: <FaUserFriends className="w-6 h-6" />,
      title: "For Solo or Groups",
      description:
        "Whether traveling alone, as a couple, or with friends and family, we optimize for your group size.",
    },
    {
      icon: <FaRegClock className="w-6 h-6" />,
      title: "Save Planning Time",
      description:
        "Skip hours of research and get comprehensive, ready-to-use travel plans in minutes.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-indigo-900/30 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 z-0"></div>

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-600/10 dark:bg-blue-400/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 pt-14 pb-16 md:pt-20 md:pb-24 lg:pt-32 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - hero content */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                <span className="text-blue-700 dark:text-customGreen block mb-2">
                  Explore Your Next Adventure
                </span>
                <span className="text-slate-800 dark:text-white">
                  with AI-Powered Itineraries
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Your dedicated travel companion, crafting personalized journeys
                that match your passions and budget with the power of AI
                technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center px-8 py-4 font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 dark:from-green-500 dark:to-customGreen shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user) {
                      navigate("/create-trip");
                    } else {
                      setOpenDialog(true);
                    }
                  }}
                >
                  <PiAirplaneTakeoffDuotone className="w-5 h-5 mr-2" />
                  Plan Your Trip Now
                </motion.button>

                <a
                  href="#how-it-works"
                  className="flex items-center justify-center px-6 py-4 font-medium rounded-lg text-blue-700 dark:text-customGreen bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Learn How It Works
                </a>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-blue-400 dark:bg-green-400 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span>Joined by 10,000+ travelers</span>
              </div>
            </motion.div>

            {/* Right side - floating image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute -inset-5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/landing.png"
                  alt="TravelMate AI Dashboard"
                  className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <GrMapLocation className="text-blue-600 dark:text-customGreen w-5 h-5" />
                <span className="text-sm font-medium">200+ Destinations</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="text-sm font-medium">4.9/5 rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/20 z-0"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-blue-800 dark:text-customGreen"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How TravelMate Works
            </motion.h2>
            <motion.p
              className="text-gray-700 dark:text-gray-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Let AI handle the complexities of trip planning while you focus on
              the excitement of your journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-customGreen rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="mt-24">
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Enter Your Preferences",
                    description:
                      "Tell us your destination, budget, travel dates and preferences.",
                  },
                  {
                    step: "02",
                    title: "AI Creates Your Itinerary",
                    description:
                      "Our AI analyzes thousands of options to craft your perfect trip.",
                  },
                  {
                    step: "03",
                    title: "Enjoy Your Journey",
                    description:
                      "Follow your personalized plan or adjust it on the fly.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="text-5xl font-bold text-blue-200 dark:text-blue-800/30 mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>

                    {index < 2 && (
                      <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            className="text-blue-300 dark:text-blue-700"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 dark:from-blue-800/90 dark:to-indigo-900/90 z-0"></div>
        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Travel Experience?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered their perfect
              itineraries with TravelMate AI.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 font-medium text-lg rounded-lg text-blue-800 dark:text-customGreen bg-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                  navigate("/create-trip");
                } else {
                  setOpenDialog(true);
                }
              }}
            >
              Get Started, It's Free!
            </motion.button>
          </motion.div>
        </div>
      </section>

      <AuthDialog
        open={openDialog}
        loading={loading}
        onLogin={login}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
}
