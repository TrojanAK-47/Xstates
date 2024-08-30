// import React, { useEffect, useState } from "react";
// import "./State.css";

// const State = () => {
//   const [data, setData] = useState({
//     countries: ["Selected Country"],
//     state: [],
//     city: [],
//   });
//   const [isSelected, setIsSelected] = useState({
//     country: "",
//     state: "",
//     city: "",
//   });
//   const fetchCountry = async () => {
//     try {
//       const res = await fetch(
//         "https://crio-location-selector.onrender.com/countries"
//       );
//       const jsonData = await res.json();
//       setData({ ...data, countries: jsonData });
//     } catch (err) {
//       if (err.response && err.response.status === 500) {
//         console.log("Internal Server Error");
//       } else {
//         console.log("An error occurred");
//       }
//     }
//   };
//   const handleFetch = async (name, value) => {
//     console.log(name, value);
//     if (name === "country" && value) {
//       try {
//         const res = await fetch(
//           `https://crio-location-selector.onrender.com/country=${value}/states`
//         );
//         const jsonData = await res.json();
//         setData({ ...data, state: jsonData });
//       } catch (err) {
//         if (err.response && err.response.status === 500) {
//           console.log("Internal Server Error");
//         } else {
//           console.log("An error occurred");
//         }
//       }
//     } else if (name === "state" && value) {
//       try {
//         const res = await fetch(
//           `https://crio-location-selector.onrender.com/country=${isSelected.country}/state=${value}/cities`
//         );
//         const jsonData = await res.json();
//         setData({ ...data, city: jsonData });
//       } catch (err) {
//         if (err.response && err.response.status === 500) {
//           console.log("Internal Server Error");
//         } else {
//           console.log("An error occurred");
//         }
//       }
//     }
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setIsSelected({ ...isSelected, [name]: value });
//     handleFetch(name, value);
//   };

//   useEffect(() => {
//     fetchCountry();
//   }, []);
//   Object.keys(data).map((items) => console.log(items));
//   return (
//     <div className='state_container'>
//       <h2>Select Location</h2>
//       <div className='state_wrapper'>
//         <div>
//           <select
//             name='country'
//             onChange={handleChange}
//             className='country'
//             required
//           >
//             <option value='0' selected>
//               Select Country
//             </option>
//             {data.countries.map((item) => (
//               <option value={item} key={item}>
//                 {item}
//               </option>
//             ))}
//           </select>
//           <select
//             name='state'
//             // value={isSelected.country}
//             onChange={handleChange}
//             className='state'
//             required
//             disabled={isSelected.country === ""}
//           >
//             <option value='0' selected>
//               Select State
//             </option>
//             {data.state.map((item) => (
//               <option value={item} key={item}>
//                 {item}
//               </option>
//             ))}
//           </select>
//           <select
//             name='city'
//             onChange={handleChange}
//             // value={isSelected.city}
//             className='city'
//             required
//             disabled={isSelected.state === ""}
//           >
//             <option value='0' selected>
//               Select City
//             </option>
//             {data.city.map((item) => (
//               <option value={item} key={item}>
//                 {item}
//               </option>
//             ))}
//           </select>
//         </div>
//         {isSelected.city && isSelected.country && isSelected.state && (
//           <p>
//             <b>You selected {isSelected.city}</b>, {isSelected.state},&nbsp;
//             {isSelected.country}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default State;

















import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CitySelector.module.css";

const CitySelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        )
        .then((response) => {
          setStates(response.data);
          setSelectedState(""); // Reset state selection
          setCities([]); // Clear cities
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        )
        .then((response) => {
          setCities(response.data);
          setSelectedCity(""); // Reset city selection
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className={styles["city-selector"]}>
      <h1>Select Location</h1>
      <div className={styles.dropdowns}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {selectedCity && (
        <h2 className={styles.result}>
          You selected <span className={styles.highlight}>{selectedCity}</span>,
          <span className={styles.fade}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
};

export default CitySelector;

