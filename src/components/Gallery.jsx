import { useMemo, useReducer } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";
import { favReducer } from "../reducer/favReducer";
import { useEffect } from "react";

function loadFavPhotos() {
  try {
    const saved = localStorage.getItem("fav_Photos");
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("could not load fav Photos");
    return [];
  }
}

export function Gallery({ searchAuthor }) {
  const [favourites, dispatch] = useReducer(favReducer, [], loadFavPhotos);

  useEffect(() => {
    try {
      localStorage.setItem("fav_Photos", JSON.stringify(favourites));
    } catch (err) {
      console.error("could not save fav Photos");
    }
  }, [favourites]);

  const { data, loading, err } = useFetchPhotos(
    "https://picsum.photos/v2/list?limit=30",
  );

  //useMemo hook to filter photos by author name
  const filterAuthor = useMemo(() => {
    const search = searchAuthor.trim().toLowerCase();

    return (data ?? []).filter((photo) =>
      photo.author.toLowerCase().includes(search),
    );
  }, [data, searchAuthor]);
  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <svg
          className="animate-spin h-15 w-15 text-amber-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );

  if (err)
    return (
      <div className="text-amber-500  flex justify-center items-center md:text-3xl h-50 my-20">
        {err}
      </div>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-2 mt-2 px-1">
      {filterAuthor?.map((u) => (
        <div key={u.id} className="relative">
          <img
            key={u.id}
            src={u.download_url}
            className="w-full h-full object-cover p-1"
            alt={u.author}
          />

          <p className=" text-white italic absolute bottom-1 p-1 ml-2 ">
            {u.author}
          </p>
          <button
            className="absolute top-3 right-2 cursor-pointer"
            aria-label={
              favourites.includes(u.id)
                ? "Remove from favourites"
                : "Add to favourites"
            }
            onClick={() =>
              dispatch({ type: "favourites_Toggle", payload: u.id })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill={favourites.includes(u.id) ? "#ffc34a" : "#ffffff"}
              stroke={favourites.includes(u.id) ? "#ffd754" : ""}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26 6.91 1.01-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </button>
        </div>
      ))}
      {filterAuthor.length === 0 && (
        <p className="md:text-3xl col-span-full mt-10 text-center text-white">
          No author found
        </p>
      )}
    </div>
  );
}
