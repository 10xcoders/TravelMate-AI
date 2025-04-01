import { db } from "@/services/fireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InfoSection } from "../components/Trip/InfoSection";
import { Hotels } from "../components/Trip/Hotels";
import { Itinerary } from "../components/Trip/Itinerary";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FaArrowLeft,
  FaMapMarkedAlt,
  FaHotel,
  FaRoute,
  FaShareAlt,
  FaPrint,
  FaDownload,
  FaChevronUp,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const ViewTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("info");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);

  // Intersection observers for each section
  const [infoRef, infoInView] = useInView({ threshold: 0.3 });
  const [hotelsRef, hotelsInView] = useInView({ threshold: 0.3 });
  const [itineraryRef, itineraryInView] = useInView({ threshold: 0.3 });

  // Update active section based on scroll position
  useEffect(() => {
    if (infoInView) setActiveSection("info");
    else if (hotelsInView) setActiveSection("hotels");
    else if (itineraryInView) setActiveSection("itinerary");
  }, [infoInView, hotelsInView, itineraryInView]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  const getTripData = async () => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "AItrip", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        setError("Trip not found. Please try again with a valid trip ID.");
        toast.error("Trip not found");
      }
    } catch (err) {
      console.error("Error fetching trip:", err);
      setError("Failed to load trip data. Please try again later.");
      toast.error("Error loading trip data");
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const printTrip = () => {
    window.print();
  };

  const shareTrip = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `My Trip to ${
            trip?.userSelection?.location?.label || "Destination"
          }`,
          text: `Check out my trip to ${
            trip?.userSelection?.location?.label || "Destination"
          }!`,
          url: window.location.href,
        })
        .catch((err) => {
          toast.error("Error sharing trip");
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Trip link copied to clipboard!");
    }
  };

  const downloadAsPDF = async () => {
    if (!contentRef.current) return;

    toast("Generating PDF...", { duration: 5000 });

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `Trip-to-${trip?.userSelection?.location?.label || "Destination"}.pdf`
      );

      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-24 h-24"
        >
          <motion.div
            className="absolute inset-0 rounded-full border-t-4 border-blue-700 dark:border-customGreen"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-4 flex items-center justify-center">
            <FaMapMarkedAlt className="text-blue-700 dark:text-customGreen text-3xl" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xl font-medium text-center"
        >
          Loading your adventure...
        </motion.p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto bg-red-50 dark:bg-red-900/20 rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Something Went Wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => navigate("/my-trips")} className="mx-auto">
            <FaArrowLeft className="mr-2" /> Back to My Trips
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Floating navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-blue-700 dark:bg-customGreen text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
            >
              <FaChevronUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating section navigation */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex flex-col gap-3"
        >
          <button
            onClick={() => scrollToSection("trip-info")}
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
              activeSection === "info"
                ? "bg-blue-100 dark:bg-customGreen/20 text-blue-700 dark:text-customGreen"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaMapMarkedAlt className="text-lg mb-1" />
            <span className="text-xs">Overview</span>
          </button>
          <button
            onClick={() => scrollToSection("trip-hotels")}
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
              activeSection === "hotels"
                ? "bg-blue-100 dark:bg-customGreen/20 text-blue-700 dark:text-customGreen"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaHotel className="text-lg mb-1" />
            <span className="text-xs">Hotels</span>
          </button>
          <button
            onClick={() => scrollToSection("trip-itinerary")}
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${
              activeSection === "itinerary"
                ? "bg-blue-100 dark:bg-customGreen/20 text-blue-700 dark:text-customGreen"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaRoute className="text-lg mb-1" />
            <span className="text-xs">Itinerary</span>
          </button>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container py-6 print:py-0">
        {/* Back button and actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center mb-6 print:hidden"
        >
          <Button
            variant="outline"
            onClick={() => navigate("/my-trips")}
            className="flex items-center gap-2"
          >
            <FaArrowLeft /> Back to My Trips
          </Button>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              onClick={shareTrip}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaShareAlt /> Share
            </Button>
            <Button
              onClick={printTrip}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaPrint /> Print
            </Button>
            <Button
              onClick={downloadAsPDF}
              className="flex items-center gap-2 bg-blue-700 dark:bg-customGreen text-white dark:text-slate-900"
            >
              <FaDownload /> Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Trip content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          ref={contentRef}
          className="space-y-8"
        >
          {/* Trip info section */}
          <section id="trip-info" ref={infoRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <InfoSection trip={trip} />
            </motion.div>
          </section>

          {/* Hotels section */}
          <section id="trip-hotels" ref={hotelsRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Hotels trip={trip} />
            </motion.div>
          </section>

          {/* Itinerary section */}
          <section id="trip-itinerary" ref={itineraryRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Itinerary trip={trip} />
            </motion.div>
          </section>
        </motion.div>
      </div>
    </>
  );
};
