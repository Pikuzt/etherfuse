import Navbar from "./components/layout/navbar/nav";
import axios from "axios";
import { groupBy } from "./components/layout/util/utils";
import { Fragment, useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl";
import { Helmet } from "react-helmet-async";



const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGlrdXp0IiwiYSI6ImNsamNrZTAwZDFxdXIzcW14azRlM3d2MHkifQ.QVAFj_MyEK9idPUzgUrfRA";



export default function About() {
  const [markers, setMarkers] = useState([]);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const markersArray = [];
  useEffect(() => {
    axios
      .get("https://api.stakewiz.com/validators")
      .then((response) => {
        
        const dataGroupedByCity = groupBy(response.data, "ip_city");
        // console.log(dataGroupedByCity);
        
        Object.keys(dataGroupedByCity).forEach((city) => {
          if (
            dataGroupedByCity[city][0].ip_city &&
            dataGroupedByCity[city][0].ip_country &&
            dataGroupedByCity[city][0].ip_latitude &&
            dataGroupedByCity[city][0].ip_longitude
          ) {
            markersArray.push({
              ip_city: dataGroupedByCity[city][0].ip_city,
              country: dataGroupedByCity[city][0].ip_country,
              ip_latitude: dataGroupedByCity[city][0].ip_latitude,
              ip_longitude: dataGroupedByCity[city][0].ip_longitude,
              count: dataGroupedByCity[city].length,
            });
          }
        });
        setMarkers(markersArray);
        // console.log(markersArray);
        // console.log(markers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Navbar />
      <Fragment>  
        <h1>Solana’s Validator Network</h1>
        <Map
        initialViewState={{
          longitude: 0,
          latitude: 30,
          zoom: 2,
        }}
        renderWorldCopies={false}
        style={{
          width: "100%",
          height: "800px",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {markers.map((marker) => (
          <Marker
            longitude={marker.ip_longitude}
            latitude={marker.ip_latitude}
            anchor="top"
            key={marker.ip_city}
          >
            { console.log(marker.ip_longitude)}
            <img
              className="marker-img"
              onMouseEnter={() => setHoveredMarker(marker)}
              onMouseLeave={() => setHoveredMarker(null)}
              src="./pin.png"
            />
            {/* { console.log(hoveredMarker)} */}

          </Marker>
        ))}
        {hoveredMarker && (
          <Popup
          
            anchor="bottom"
            closeButton={false}
            latitude={hoveredMarker?.ip_latitude || 0}
            longitude={hoveredMarker?.ip_longitude || 0}
          >
            <label>
              Ip city: <b>{hoveredMarker.ip_city}</b>
            </label>
            <br></br>
            <label>
              Country: <b>{hoveredMarker.country}</b>
            </label>
            <br></br>
            <label>
              Ip Latitude: <b>{hoveredMarker.ip_latitude}</b>
            </label>
            <br></br>
            <label>
              Ip Longitude: <b>{hoveredMarker.ip_longitude}</b>
            </label>
            <br></br>
            <label>
              Count: <b>{hoveredMarker.count}</b>
            </label>
          </Popup>
        )}
      </Map>
      <br />

      </Fragment>

    </>)
}