import { useEffect, useState } from "react";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hotelData"); // Update with your backend API endpoint
        const data = await response.json();
        setHotels(data.topRatedHotels);
        
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="fp">
      {hotels.map((hotel, index) => (
        <div className="fpItem" key={hotel._id}> {/* Assuming each hotel has a unique 'id' */}
          <img
            src={hotel.photos[index]} // Use the corresponding image source from the array
            alt={hotel.name}
            className="fpImg"
          />
          <span className="fpName">
          <a href={`./hotels/${hotel._id?.$oid || hotel._id} `} target="_blank" rel="noopener noreferrer">
              {hotel.name}
            </a>
          </span>
          <span className="fpCity">{hotel.city}</span>
          <span className="fpPrice">Starting from ${hotel.price}</span>
          <div className="fpRating">
            <button>{hotel.rating}</button>
            <span>{hotel.ratingText}</span> {/* e.g. "Excellent", "Exceptional" */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
