import FavouritesList from "@/components/Favourites";

const Favourites = () => {
  return (
    <>
      <h1 className="text-xl md:text-3xl font-medium patrick-hand">
        Favourites
      </h1>
      <div className="my-4">
        <FavouritesList />
      </div>
    </>
  );
};

export default Favourites;
