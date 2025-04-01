import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { chatSession } from "@/services/AImodel";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelerList,
} from "@/constants/options";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/fireBaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaWallet,
  FaUsers,
  FaArrowRight,
  FaArrowLeft,
  FaPlaneDeparture,
  FaCheck,
} from "react-icons/fa";

export const HomePage = () => {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { id: "destination", title: "Destination", icon: <FaMapMarkedAlt /> },
    { id: "duration", title: "Duration", icon: <FaCalendarAlt /> },
    { id: "budget", title: "Budget", icon: <FaWallet /> },
    { id: "travelers", title: "Travelers", icon: <FaUsers /> },
  ];

  const handleInputChanges = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    // Validation for current step
    if (currentStep === 0 && !formData?.location) {
      toast.error("Please select a destination first!");
      return;
    }
    if (
      currentStep === 1 &&
      (!formData?.noOfDays || formData?.noOfDays < 1 || formData?.noOfDays > 15)
    ) {
      toast.error("Please enter a valid number of days (1-15)!");
      return;
    }
    if (currentStep === 2 && !formData?.budget) {
      toast.error("Please select your budget preference!");
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      formData?.noOfDays > 15 ||
      formData?.noOfDays < 1 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.people
    ) {
      toast.error("Please fill all details!");
      return;
    }

    setLoading(true);
    toast("Creating your dream journey... This might take a moment! ✨", {
      duration: 10000,
    });

    const FINAL_PROMPT = AI_PROMPT.replace("{noOfDays}", formData?.noOfDays)
      .replace("{people}", formData?.people)
      .replace("{location}", formData?.location?.label)
      .replace("{budget}", formData?.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result?.response?.text();
      console.log("--", responseText);

      const responseJSON = JSON.parse(responseText);
      setLoading(false);
      saveAiTrip(responseJSON);
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
      toast.error("Something went wrong. Please try again!");
    }
  };

  const saveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "AItrip", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
      });
      setLoading(false);
      toast.success("Your journey awaits!", {
        description: "Let's explore your personalized travel plan.",
      });
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      setLoading(false);
      toast.error("Failed to save your trip. Please try again!");
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkedAlt className="text-blue-700 dark:text-customGreen text-xl" />
                <Label className="text-lg font-medium">
                  Where would you like to explore?
                </Label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your dream destination and we'll craft the perfect
                journey
              </p>
            </div>

            {/* Enhanced Google Places Autocomplete with explicit styling for dropdown */}
            <div className="relative z-30">
              <div className="absolute -z-10 -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-500 dark:to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="dark:text-slate-800 border-2 dark:border-customGreen border-blue-700 rounded-lg overflow-visible shadow-md relative z-30">
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_APIKEY}
                  selectProps={{
                    place,
                    onChange: (val) => {
                      setPlace(val);
                      handleInputChanges("location", val);
                    },
                    placeholder: "Search for cities, countries or landmarks...",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: "4px",
                        borderRadius: "0.375rem",
                        border: "none",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 50,
                        marginTop: "4px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        borderRadius: "0.375rem",
                        background: "white",
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        padding: "8px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? "#EBF4FF" : "white",
                        color: "#1a202c",
                        borderRadius: "0.25rem",
                        padding: "8px 12px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#EBF4FF",
                        },
                      }),
                      container: (provided) => ({
                        ...provided,
                        width: "100%",
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: "#1a202c",
                      }),
                    },
                    menuPlacement: "auto",
                    menuPosition: "fixed",
                    className: "text-slate-800",
                  }}
                />
              </div>
            </div>

            {formData?.location?.label && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2"
              >
                <FaCheck className="text-green-500" />
                <p className="text-sm">
                  <span className="font-medium">Selected destination:</span>{" "}
                  {formData?.location?.label}
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-700 dark:text-customGreen text-xl" />
                <Label className="text-lg font-medium">
                  Duration of your adventure?
                </Label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How many days would you like to explore{" "}
                {formData?.location?.label || "your destination"}?
              </p>
            </div>

            <div className="relative">
              <div className="absolute -z-10 -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-500 dark:to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <Input
                id="days"
                type="number"
                placeholder="Number of days (1-15)"
                min="1"
                max="15"
                value={formData?.noOfDays || ""}
                onChange={(e) => handleInputChanges("noOfDays", e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-2 dark:border-customGreen border-blue-700 bg-white text-slate-800 text-lg p-6 shadow-md"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((days) => (
                <motion.button
                  key={days}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInputChanges("noOfDays", days)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData?.noOfDays == days
                      ? "border-blue-700 dark:border-customGreen bg-blue-50 dark:bg-green-900/20 shadow-md"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {days} days
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaWallet className="text-blue-700 dark:text-customGreen text-xl" />
                <Label className="text-lg font-medium">
                  What's your budget preference?
                </Label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select the option that best fits your spending plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SelectBudgetOptions.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleInputChanges("budget", item.title)}
                  className={`relative group p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData?.budget === item.title
                      ? "border-blue-700 dark:border-customGreen shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {formData?.budget === item.title && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 text-blue-700 dark:text-customGreen"
                    >
                      <FaCheck />
                    </motion.div>
                  )}
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="text-3xl group-hover:scale-125 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.des}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-700 dark:text-customGreen text-xl" />
                <Label className="text-lg font-medium">
                  Who's joining you on this journey?
                </Label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Let us know who you're traveling with
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {SelectTravelerList.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleInputChanges("people", item.people)}
                  className={`relative h-full p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    formData?.people === item.people
                      ? "border-blue-700 dark:border-customGreen shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {formData?.people === item.people && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-2 right-2 text-blue-700 dark:text-customGreen"
                    >
                      <FaCheck />
                    </motion.div>
                  )}
                  <div className="flex flex-col items-center text-center gap-2 h-full justify-center">
                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.des}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <FaPlaneDeparture className="text-blue-700 dark:text-customGreen text-2xl" />
                <h2 className="text-2xl font-bold">Ready for Takeoff!</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Let's review your preferences before we create your personalized
                trip
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkedAlt className="text-blue-700 dark:text-customGreen" />
                  <h3 className="font-medium">Destination</h3>
                </div>
                <p className="ml-6">
                  {formData?.location?.label || "Not specified"}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-blue-700 dark:text-customGreen" />
                  <h3 className="font-medium">Duration</h3>
                </div>
                <p className="ml-6">{formData?.noOfDays || "0"} days</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaWallet className="text-blue-700 dark:text-customGreen" />
                  <h3 className="font-medium">Budget</h3>
                </div>
                <p className="ml-6">{formData?.budget || "Not specified"}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-blue-700 dark:text-customGreen" />
                  <h3 className="font-medium">Travelers</h3>
                </div>
                <p className="ml-6">{formData?.people || "Not specified"}</p>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Click "Generate Trip" below to create your personalized
                adventure!
              </motion.div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-14 lg:px-14 xl:px-40 font-serif">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-6 border-y-4 p-6 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20"></div>

          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="pt-5 text-left text-lg md:text-2xl lg:text-3xl font-bold tracking-wider md:tracking-widest">
                Create Your Dream Journey ✨
              </CardTitle>
              <CardDescription className="pt-3 pb-3 text-justify md:text-left font-light text-sm md:text-lg lg:text-xl tracking-tighter md:tracking-wide">
                Let us craft a personalized itinerary that matches your travel
                style and preferences
              </CardDescription>
            </motion.div>

            {/* Progress steps */}
            <div className="mt-6 mb-2">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative"
                  >
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full z-10 transition-colors
                        ${
                          currentStep >= index
                            ? "bg-blue-700 dark:bg-customGreen text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (currentStep > index) {
                          setCurrentStep(index);
                        }
                      }}
                    >
                      {index < currentStep ? (
                        <FaCheck className="text-white" />
                      ) : (
                        step.icon
                      )}
                    </motion.div>

                    <span
                      className={`text-xs mt-2 font-medium ${
                        currentStep >= index
                          ? "text-blue-700 dark:text-customGreen"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>

                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 -right-full w-full h-0.5 ${
                          currentStep > index
                            ? "bg-blue-700 dark:bg-customGreen"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 min-h-[300px]">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between mt-5">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className="gap-2"
            >
              <FaArrowLeft /> Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-blue-700 hover:bg-blue-800 dark:bg-customGreen dark:hover:bg-green-600 dark:text-slate-900 text-white transition-all duration-300 gap-2"
              >
                Continue <FaArrowRight />
              </Button>
            ) : (
              <Button
                onClick={onGenerateTrip}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-green-500 dark:to-teal-600 hover:from-blue-700 hover:to-indigo-800 dark:hover:from-green-600 dark:hover:to-teal-700 dark:text-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating your journey...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaPlaneDeparture className="text-lg" />
                    Generate Trip
                  </div>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
