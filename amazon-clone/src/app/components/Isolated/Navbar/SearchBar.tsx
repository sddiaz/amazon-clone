"use client";

import HelperFunctions from "@/app/services/Helpers";
import { StoreService } from "@/app/services/StoreService";
import { Department, Product } from "@/app/types";
import { debounce } from "lodash";
import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DepartmentData from "../../../../../public/data/departments.json";
import Overlay from "../../Shared/Overlay";

type Suggestion = {
  id: string;
  title: string;
};

export default function SearchBar() {
  //#region Variables

  // -1 means "All Departments"
  const [selectedDepartment, setSelectedDepartment] = useState(-1);
  const selectedCategory = (DepartmentData as Department[]).find(
    (dept) => dept.id === selectedDepartment
  )?.name;
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //#endregion

  const loadRecentSearches = () => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        const parsedSuggestions = JSON.parse(stored);
        setSuggestions(parsedSuggestions);
      } catch (error) {
        console.error("Error parsing recent searches:", error);
        setSuggestions([]);
      }
    }
  };

  const fetchProductSuggestions = async (query: string) => {
    if (!query.trim()) {
      loadRecentSearches();
      return;
    }

    setLoading(true);
    try {
      const result = await StoreService.searchProducts(query);
      const newSuggestions = result?.products
        ?.filter(
          (item: Product) =>
            !selectedCategory || item.category === selectedCategory
        )
        .map((item: Product) => ({
        id: item.id,
        title: item.title,
      }));
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchProductSuggestions, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedIndex(-1);
    debouncedFetch(value);
  };

  const handleRecentSearch = (suggestion: Suggestion) => {
    try {
      // Get existing searches from localStorage
      const storedSearches = localStorage.getItem("recentSearches");
      let searches: Suggestion[] = storedSearches ? JSON.parse(storedSearches) : [];
      
      // Remove duplicate if exists
      searches = searches.filter(item => item.id !== suggestion.id);
      
      // Add new suggestion to the beginning
      searches.unshift(suggestion);
      
      // Keep only the last 10 searches
      searches = searches.slice(0, 10);
      
      // Save back to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(searches));
      
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const handleDeleteSuggestion = (suggestionToDelete: Suggestion) => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      const localSuggestions = JSON.parse(stored).filter((item: Suggestion) => item.id !== suggestionToDelete.id);
  
      if (localSuggestions.length > 0) {
        localStorage.setItem("recentSearches", JSON.stringify(localSuggestions));
      } else {
        localStorage.removeItem("recentSearches"); // Remove key if array is empty
      }
  
      setSuggestions(localSuggestions);
    }
  };
  

  const runSearch = () => {
    const query = searchInput.trim();
    // Department picked but nothing typed: browse that department.
    if (!query && selectedCategory) {
      setIsSearching(false);
      inputRef.current?.blur();
      router.push(`/category/${selectedCategory}`);
      return;
    }
    if (!query) return;
    // Typed searches are remembered with a "q:" id; product suggestions use
    // the product id.
    handleRecentSearch({ id: `q:${query.toLowerCase()}`, title: query });
    setIsSearching(false);
    inputRef.current?.blur();
    router.push(
      `/search?q=${encodeURIComponent(query)}${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearching) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          const selected = suggestions[selectedIndex];
          setSearchInput(
            typeof selected === "string" ? selected : selected.title
          );
        } else {
          runSearch();
        }
        break;
      case "Escape":
        setIsSearching(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isSearching && <Overlay />}
      <div
        ref={containerRef}
        id="searchFill"
        className="w-[100%] h-[100%] flex p-[6px] md:p-[10px] text-white items-center justify-between"
      >
        <div
          id="search"
          className="w-[100%] h-[100%] flex justify-center items-center"
        >
          <div className="relative h-[100%] shrink-0">
          <select
            id="searchDropdown"
            className={`amazon-focus cursor-pointer focus:z-10 relative ${isSearching ? "z-50" : ""} bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 appearance-none pl-2 md:pl-3 pr-6 md:pr-8 max-w-[84px] md:max-w-[170px] truncate rounded-l-lg h-[100%] text-[12px] [&>option]:bg-white [&>option]:text-gray-900`}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          >
            <option value={-1}>All Departments</option>
            {(DepartmentData as Department[])?.map((dept) => {
              const formattedName = HelperFunctions.formatDepartmentName(
                dept.name
              );
              return (
                <option className="w-auto" key={dept.id} value={dept.id}>
                  {formattedName}
                </option>
              );
            })}
          </select>
          <ChevronDown
            size={16}
            className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 ${
              isSearching ? "z-50" : ""
            }`}
          />
          </div>
          <div className="relative flex-1 h-full">
            <input
              ref={inputRef}
              value={searchInput}
              onChange={handleInputChange}
              onFocus={() => {
                setIsSearching(true);
                loadRecentSearches(); // Load recent searches when input is focused
              }}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Search Amazon-Clone"
              className={`${
                isSearching ? "relative z-50" : ""
              } amazon-focus focus:z-90 relative w-full min-w-0 h-full placeholder-gray-500 text-black text-sm pl-3 pr-4 font-normal`}
            />

            {/* Suggestions Panel */}
            {isSearching && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-b shadow-lg z-50">
                <ul className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <li className="px-4 py-2 text-gray-500">Loading...</li>
                  ) : suggestions.length > 0 ? (
                    <>
                      {isSearching && searchInput == "" && (
                        <li className="px-4 py-2 text-gray-500 text-sm">
                          Recent Searches
                        </li>
                      )}
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={suggestion.id}
                          className={`px-4 py-2 cursor-pointer text-gray-700 ${
                            index === selectedIndex
                              ? "bg-gray-100"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[#000] text-[14px]">
                            <Link
                              href={
                                String(suggestion.id).startsWith("q:")
                                  ? `/search?q=${encodeURIComponent(suggestion.title)}`
                                  : `/product/${suggestion.id}`
                              }
                              className="block w-full h-full relative"
                              onClick={() => {
                                handleRecentSearch(suggestion);
                                setIsSearching(false);
                              }}
                            >
                              {suggestion.title}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSuggestion(suggestion);
                              }}
                            >
                              <X size={16} className="mr-2" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </>
                  ) : searchInput.trim() ? (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  ) : null}
                </ul>
              </div>
            )}
          </div>
          <button
            id="searchButton"
            className={`amazon-focus rounded-r-lg focus:z-10 relative ${isSearching ? "z-50" : ""} bg-orange-300 hover:bg-orange-400 h-[100%] w-[52px] md:w-[90px] shrink-0 flex justify-center items-center`}
            onClick={runSearch}
          >
            <div className="text-gray-600">
              <Search size={23} />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
