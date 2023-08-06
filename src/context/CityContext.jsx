import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
const CityContext = createContext();
const initialstate = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/created":
      return{
        ...state,
        isLoading:false,
        cities: [...state.cities,action.payload]
      }
    case "city/deleted":
      return{
        ...state,
        isLoading:false,
        cities: state.cities.filter((city)=> city.id !== action.payload)
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      };
    default:
      throw new Error("Unknown action type");
  }
}
function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialstate
  );
  useEffect(function () {
    async function fetchcities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch("http://localhost:8900/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload:"There was a error loading data",
        });
      }
    }
    fetchcities();
  }, []);
  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8900/cities/${id}`);
      const data = await res.json();
      dispatch({type :"city/loaded", payload: data})
    } catch  {
      dispatch({
        type: "rejected",
        payload: "There was a error loading data",
      });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8900/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "Application/json",
        },
      });
      const data = await res.json();
      dispatch({type:"city/created", payload:data})
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a error loading data",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:8900/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({type:"city/deleted",payload: id})
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a error loading data",
      });
  }
  }
  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}
function useCities() {
  const context = useContext(CityContext);
  return context;
}
export { CityProvider, useCities };
