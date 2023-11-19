import React, { useState } from "react";
import { useRef } from "react";
import './App.css';
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer} from '@react-google-maps/api' ;

const center = {lat:48.124, lng:2.294} ;
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey : process.env.GOOGLE_API ,
    libraries : ['places'] ,
  })
  
  const [map, setMap] = useState(/** @type google.maps.Map */ (null)) ;
  const [directionResponse, setdirectionResponse] = useState(null) ;
  const [distance, setdistance] = useState('') ;
  const [duration, setduration] = useState('') ;
  const originRef = useRef() ;
  const destRef = useRef() ;

  if(!isLoaded){
    console.log("Not working properly") ;
  }

  async function calculateRoute(){
    if(originRef.current.value === '' || destRef.current.value === ''){
      return ;
    }
    //eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()
    const results = await directionService.route({
      origin: originRef.current.value ,
      destination: destRef.current.value ,
      //eslint-disable-next-line no-undef
      travelMode : google.maps.TravelMode.DRIVING 
    })
    setdirectionResponse(results) ;
    setdistance(results.routes[0].legs[0].distance.text) ;
    setduration(results.routes[0].legs[0].duration.text) ;
  }

  function clearRoute(){
    setdistance('') ;
    setduration('') ;
    setdirectionResponse('') ;
    originRef.current.value = '' ;
    destRef.current.value = '' ;
  }
  return (
    <div className="App">
      <div className="fullMap">
        <Autocomplete>
        <input type="text" placeholder="from" ref={originRef}/>
        </Autocomplete>
        <Autocomplete>
        <input type="text" placeholder="to" ref={destRef}/>
        </Autocomplete>
        <button
        style={{ backgroundColor: 'primary' }}
        arial-label='center-back'
        onClick={()=>map.panTo(center)}>Re-Center
        </button>
        <button onClick={calculateRoute}>
          Calculate Route
        </button>
        <button onClick={clearRoute}>
          Clear Route
        </button>
        <p> Distance = {distance}</p>
        <p> Duration = {duration}</p>
        <GoogleMap center={center} zoom={15} mapContainerStyle={{width:"100%", height:"100%"}} options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl :false,
          fullscreenControl :false,
        }}
        onLoad={(map)=>setMap(map)}>
          <Marker position={center}/>
          {directionResponse && <DirectionsRenderer directions={directionResponse}/>}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;
