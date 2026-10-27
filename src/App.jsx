import { useState, useCallback } from "react";
import { Gallery } from "./components/Gallery";

function App() {
  const [searchAuthor, setSearchAuthor] = useState("");

  //useCallback hook
  const handleSearch = useCallback((e) => {
    setSearchAuthor(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-600 ">
      <div className="flex justify-center p-2 bg-gray-800 h-1/2">
        <input
          type="text"
          placeholder="search"
          value={searchAuthor}
          onChange={handleSearch}
          className="p-2 m-1 min-w-0  text-center border-[1.5px]  rounded bg-white border-white focus:border-sky-500 focus:outline focus:outline-sky-500"
        />
      </div>
      <Gallery searchAuthor={searchAuthor}></Gallery>
    </div>
  );
}

export default App;
