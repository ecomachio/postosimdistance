import React, { useState, useEffect } from "react";
import gasStations from "./gasStations";

interface GasStation {
  name: string;
  latitude: number;
  longitude: number;
  url: string;
}

interface Location {
  lat: number;
  lng: number;
}

const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_userLocation, setUserLocation] = useState<Location | null>(null);
  const [closestLocation, setClosestLocation] = useState<GasStation | null>(
    null
  );

  // Function to calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLon / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to find the closest gas station
  const findClosestGasStation = (userLat: number, userLng: number) => {
    let closest: GasStation | null = null;
    let minDistance = Infinity;

    gasStations.forEach((station) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        station.latitude,
        station.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = station;
      }
    });

    setClosestLocation(closest);
  };

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          findClosestGasStation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };
    getLocation();
  }, []);

  // Generate Google Maps URL
  // const getGoogleMapsLink = (lat: number, lng: number): string => {
  //   return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  // };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs_XuIIHCtBbXCt3G_1g7ca5Z45TWOyfUKtw&s"
        alt="Logo"
        className="mb-4"
      />

      <div className=" bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h3 className="text-2xl font-bold text-center text-blue-600 mb-6 flex flex-col items-center">
            Posto SIM mais perto kkkkkkk
          </h3>
          {closestLocation ? (
            <div className="text-center">
              <p>O posto SIM mais próximo é:</p>
              <p className="text-lg font-semibold mb-4">
                {closestLocation.name}
              </p>
              <a
                href={closestLocation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                  Open in Google Maps
                </button>
              </a>
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              Achando posto SIM mais próximo...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
