import SearchResultsScreen from "@/src/modules/search-bus/screens/SearchResultsScreen";
import React, { useEffect } from "react";

export default function SearchResults(){
  useEffect(() => {
    console.log('App search-results wrapper mounted');
  }, []);

  return (
    <SearchResultsScreen />
  )
}