import { GetPlaceDetails } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";

function MyTripsCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/trip.jpg");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhotos();
    }
  }, [trip]);

  const PHOTO_REF_URL =
    "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
    import.meta.env.VITE_GOOGLE_PLACE_APIKEY;

  const GetPlacePhotos = async () => {
    setIsLoading(true);
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };

    try {
      const result = await GetPlaceDetails(data);
      // Check if response has the expected data structure
      if (result?.data?.places?.[0]?.photos?.[0]?.name) {
        const photoRef = result.data.places[0].photos[0].name;
        const url = PHOTO_REF_URL.replace("{NAME}", photoRef);
        setPhotoUrl(url);
      } else {
        // Use fallback image if data isn't available
        setPhotoUrl("/trip.jpg");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      // Use fallback image on error
      setPhotoUrl("/trip.jpg");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="my-4 border-x-4 p-2">
      <Link to={"/view-trip/" + trip?.id}>
        <div className="font-serif xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl hover:scale-105 transition-all rounded-2xl px-1 cursor-pointer">
          <div
            className={`h-56 w-full ${
              isLoading ? "animate-pulse bg-slate-300 dark:bg-slate-700" : ""
            }`}
          >
            <img
              className="h-56 w-full rounded-2xl p-2 object-cover"
              src={photoUrl}
              alt={`Trip to ${
                trip?.userSelection?.location?.label || "destination"
              }`}
              onError={(e) => {
                e.target.src = "/trip.jpg";
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="my-6 mx-2">
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              📍 {trip?.userSelection?.location?.label || "Destination"}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              📅 No of Days: {trip?.userSelection?.noOfDays || "N/A"}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              💰 Budget: {trip?.userSelection?.budget || "N/A"}
            </h2>
            <h2 className="font-semibold text-sm md:text-lg mt-2 text-left">
              👥 Traveler: {trip?.userSelection?.people || "N/A"}
            </h2>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default MyTripsCard;
