import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import BookingForm from "./components/BookingForm/BookingForm";
import TransactionDashboard from "./pages/home/TransationDashboard/TransationDashboard";
import { useState, useEffect } from "react";
function App() {
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List/>} />
        <Route path="/hotels/:hotelID" element={<Hotel />} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/login" element={<Login></Login>} />
        {/* <Route
          path="/booking"
          element={<BookingForm user={user}></BookingForm>}
        /> */}
        <Route
          path="/transactions"
          element={<TransactionDashboard></TransactionDashboard>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
