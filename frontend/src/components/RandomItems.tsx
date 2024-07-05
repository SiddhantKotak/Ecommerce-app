import { itemInputType } from "@anshpatel2434/ecommerce";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { useItems } from "../hooks/useItems";

const RandomItems = () => {
  const { items, loading } = useItems();
  const [cards, setCards] = useState<itemInputType[]>([]);

  function shuffle(array: itemInputType[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  useEffect(() => {
    shuffle(items);
    setCards(
      items.filter((item, index) => {
        return index <= 9;
      })
    );
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-start">
          <div className="w-full md:w-11/12 md:ml-24 pl-4 h-14 font-bold mt-[-10rem] text-2xl md:text-4xl text-white border-b-4 border-blue-600 ">
            Recommended Products
          </div>
          <div className="w-screen mb-20 mt-20 bg-gray-900 flex flex-col px-8 items-center">
            <div className="flex flex-wrap gap-10 md:gap-32 justify-center my-5">
              {cards.map((item, index) => (
                <ItemCard
                  key={index}
                  category={item.category}
                  itemName={item.itemName}
                  itemPrice={item.itemPrice}
                  itemQuantity={item.itemQuantity}
                  itemDescription={item.itemDescription}
                  itemImage={item.itemImage}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomItems;