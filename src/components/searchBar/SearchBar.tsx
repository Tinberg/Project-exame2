import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./searcBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchVenues } from "../../hooks/useVenues";
import { Venue } from "../../schemas/venue";

function SearchBar() {
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [venueResults, setVenueResults] = useState<Venue[]>([]);

  // Search hook
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchVenues(searchQuery);

  // Update venue results
  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowSearchResults(true);
      setVenueResults(searchResults ?? []);
    } else {
      setShowSearchResults(false);
      setVenueResults([]);
    }
  }, [searchQuery, searchResults]);

  // click outside will close the search
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigation to venue details
  const handleResultClick = (venue: Venue) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigate(`/venueDetails/${venue.id}`);
  };

  return (
    <div className="search-bar-container px-2 my-4 w-100 position-relative" ref={searchRef}>
      <div className="search-bar position-relative w-100">
        <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search venues"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.length > 0) setShowSearchResults(true);
            }}
          />
          <button className="btn btn-outline-primary" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="search-results position-absolute bg-white w-100 shadow rounded">
            {isLoading ? (
              <div className="p-2">Loading...</div>
            ) : error ? (
              <div className="p-2 text-danger">Error fetching results</div>
            ) : venueResults.length > 0 ? (
              venueResults.map((venue) => (
                <div
                  key={venue.id}
                  className="search-result-item p-2 d-flex align-items-center"
                  onClick={() => handleResultClick(venue)}
                >
                  <img
                    src={venue.media[0]?.url || "../../assets/images/venueImage/noVenueImage.jpg"}
                    alt={venue.media[0]?.alt || venue.name}
                    className="me-2 rounded"
                  />
                  <span>{venue.name}</span>
                </div>
              ))
            ) : (
              <div className="p-2">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
