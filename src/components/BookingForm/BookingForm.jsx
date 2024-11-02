import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import enLocale from "date-fns/locale/en-US";
import "./BookingForm.css";

function BookingForm({ user, onClose }) {
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  const [bookingInfo, setBookingInfo] = useState({
    fullName:"",
    email:"",
    phoneNumber: "",
    cardNumber: ""
  });

  console.log("use booking", user);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleBookingInfoChange = (e) => {
    setBookingInfo({ ...bookingInfo, [e.target.name]: e.target.value });
  };

   // Handle user data when it's received
   useEffect(() => {
    if (user) {
      setBookingInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        cardNumber: ""
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (dateRange[0].startDate && dateRange[0].endDate) {
        try {
          const response = await fetch(`http://localhost:5000/api/rooms/available?startDate=${dateRange[0].startDate.toISOString()}&endDate=${dateRange[0].endDate.toISOString()}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setAvailableRooms(data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      }
    };
    fetchAvailableRooms();
  }, [dateRange]);

  useEffect(() => {
    const days = Math.ceil((dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24));
    const bill = selectedRooms.reduce((total, room) => total + room.price, 0) * days;
    setTotalBill(bill);
  }, [selectedRooms, dateRange]);

  const handleRoomSelection = (room, number) => {
    setSelectedRooms((prev) => {
      const isSelected = prev.some((selectedRoom) => selectedRoom.roomId === room._id && selectedRoom.roomNumber === number.number);
      if (isSelected) {
        return prev.filter((selectedRoom) => !(selectedRoom.roomId === room._id && selectedRoom.roomNumber === number.number));
      } else {
        return [...prev, { roomId: room._id, roomNumber: number.number, price: room.price }];
      }
    });
  };

  const handleReserveNow = async () => {
    const bookingData = {
      checkInDate: dateRange[0].startDate,
      checkOutDate: dateRange[0].endDate,
      rooms: selectedRooms.map((room) => ({ roomId: room.roomId, roomNumber: room.roomNumber })),
      ...bookingInfo,
      paymentMethod,
      totalBill
    };
  
    // Chuẩn bị dữ liệu cho transaction
    const roomIds = selectedRooms.map((room) => room.roomId.$oid); // Danh sách roomId
    let transactionData = {
      user: bookingInfo.fullName || user.username, // Hoặc sử dụng username từ user (nếu có)
      hotel: roomIds.length > 0 ? roomIds[0]: null, // Lấy hotel từ phòng đầu tiên (nếu có)
      room: roomIds, // Gửi mảng roomId
      dateStart: (new Date(bookingData.checkInDate)).toISOString(), // Ngày bắt đầu
      dateEnd: (new Date(bookingData.checkOutDate)).toISOString(), // Ngày kết thúc
      price: totalBill, // Giá tổng
      payment: paymentMethod, // Phương thức thanh toán
      status: 'Booked' // Trạng thái
    };

    console.log(transactionData)
  
    console.log('body', transactionData); // In ra để kiểm tra định dạng dữ liệu
  
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData) // Gửi transactionData
      });
  
      if (!response.ok) throw new Error("Booking failed");
      
      alert("Booking successful!");
      onClose(); // Đóng form sau khi đặt phòng thành công
      // window.location.href = "/transactions"; // Chuyển hướng đến trang giao dịch
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed. Please try again.");
    }
  };
  
  return (
    <div className="booking-form">
      <h2>Select Dates</h2>
      <DateRange
        locale={enLocale}
        editableDateInputs={true}
        onChange={(item) => setDateRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
      />
      <h2>Reserve Info</h2>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={bookingInfo.fullName}
        onChange={handleBookingInfoChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={bookingInfo.email}
        onChange={handleBookingInfoChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={bookingInfo.phoneNumber}
        onChange={handleBookingInfoChange}
      />
      <input
        type="text"
        name="cardNumber"
        placeholder="Card Number"
        value={bookingInfo.cardNumber}
        onChange={handleBookingInfoChange}
      />
      <h2>Select Rooms</h2>
      {availableRooms.map((room) => (
        <div key={room._id}>
          <h3>{room.title}</h3>
          <p>{room.desc}</p>
          <p>Max people: {room.maxPeople}</p>
          <p>${room.price}</p>
          {room.roomNumbers.map((number) => (
            <label key={number.number}>
              <input
                type="checkbox"
                checked={selectedRooms.some((selectedRoom) => selectedRoom.roomId === room._id && selectedRoom.roomNumber === number.number)}
                onChange={() => handleRoomSelection(room, number)}
              />
              {number.number}
            </label>
          ))}
        </div>
      ))}
      <div className="total-bill">
        <h3>Total Bill: ${totalBill}</h3>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      <button onClick={handleReserveNow}>Reserve Now</button>
    </div>
  );
}

export default BookingForm;
