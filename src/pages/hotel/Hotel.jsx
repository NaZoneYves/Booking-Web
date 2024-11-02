// Hotel.js
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../../components/BookingForm/BookingForm";

const Hotel = () => {
  const { hotelID } = useParams();
  const [hotelData, setHotelData] = useState(null);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [user, setUser] = useState(null);
  // const currentUsername = "Louis123"; // Replace with the actual logic to get the current username

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/username/Louis`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hotelData/${hotelID}`);
        if (!response.ok) {
          throw new Error("Error fetching hotel data");
        }
        const data = await response.json();
        setHotelData(data);
      } catch (error) {
        console.error("Failed to fetch hotel data:", error);
      }
    };

    fetchHotelData();
  }, [hotelID]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? hotelData.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === hotelData.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  if (!hotelData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={hotelData.photos[slideNumber]} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow">Reserve or Book Now!</button>
          <h1 className="hotelTitle">{hotelData.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{hotelData.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {hotelData.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${hotelData.cheapestPrice} at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {hotelData.photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of {hotelData.city}</h1>
              <p className="hotelDesc">
                {hotelData.desc}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-night stay!</h1>
              <span>
                Located in the real heart of {hotelData.city}, this property has an excellent location score of {hotelData.locationScore}!
              </span>
              <h2>
                <b>${hotelData.cheapestPrice * 9}</b> (9 nights)
              </h2>
              <button onClick={() => setShowBookingForm(!showBookingForm)}>
                Reserve or Book Now!
              </button>
            </div>
          </div>
        </div>

        {showBookingForm && <BookingForm user={user} onClose={() => setShowBookingForm(false)} />}

        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
