import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../context/CityContext";

import { useGeolocation } from "../Hooks/useGeolocation";
import Button from "./Button"
import { useUrlPosition } from "../Hooks/useUrlPosition";
export default function Map() {
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const { cities } = useCities();

  const {isLoading:isLoadingGeolocation, position:geolocationPosition, getPosition} = useGeolocation()
  
const [maplat,maplng] = useUrlPosition()

  useEffect(function(){
    if(maplat && maplng) setMapPosition([maplat,maplng])
  },[maplat,maplng])
  useEffect(function(){
    if(geolocationPosition) setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
  },[geolocationPosition])
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type="position" onClick={getPosition}>
        {isLoadingGeolocation ? 'Loading...' : "Use your position"}
      </Button>}
      <MapContainer
        center={mapPosition}
        zoom={7}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition}/>
        <DetectCity />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView( position );
  return null;
}
function DetectCity(){
  const navigate = useNavigate()
  useMapEvents({
    click: (e)=> navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}
