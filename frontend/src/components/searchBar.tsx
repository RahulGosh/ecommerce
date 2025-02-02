import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { SearchContext } from "../context/searchContext";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const context = useContext(SearchContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  if (!context) {
    throw new Error(
      "SearchContext must be used within a SearchContextProvider"
    );
  }

  const { search, setSearch, showSearch, setShowSearch } = context;

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <img className="w-4" src={assets.search_icon} alt="search icon" />
      </div>

      <img
        src={assets.cross_icon}
        alt="clear icon"
        className="inline w-3 cursor-pointer"
        onClick={() => setShowSearch(false)}
      />
    </div>
  ) : null;
};

export default SearchBar;
