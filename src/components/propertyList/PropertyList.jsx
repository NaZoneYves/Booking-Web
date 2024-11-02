import React, { useEffect, useState } from 'react';
import './propertyList.css';

const PropertyList = () => {
  const [propertyCounts, setPropertyCounts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotelData');
        const data = await response.json();
        setPropertyCounts(data.countByType); // Lưu trữ số lượng khách sạn theo từng loại
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchData();
  }, []);

  if (!propertyCounts) return <p>Loading...</p>;

  return (
    <div className="pList">
      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o="
          alt="Hotels"
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>Hotels</h1>
          <h2>{propertyCounts.Hotels || 0} hotels</h2>
        </div>
      </div>

      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg"
          alt="Apartments"
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>Apartments</h1>
          <h2>{propertyCounts.Apartments || 0} apartments</h2>
        </div>
      </div>

      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg"
          alt="Resorts"
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>Resorts</h1>
          <h2>{propertyCounts.Resorts || 0} resorts</h2>
        </div>
      </div>

      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg"
          alt="Villas"
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>Villas</h1>
          <h2>{propertyCounts.Villas || 0} villas</h2>
        </div>
      </div>

      <div className="pListItem">
        <img
          src="https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
          alt="Cabins"
          className="pListImg"
        />
        <div className="pListTitles">
          <h1>Cabins</h1>
          <h2>{propertyCounts.Cabins || 0} cabins</h2>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
