import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [contDraw, setContDraw] = useState(false);
  const [hideBtn, setHideBtn] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    async function getDeck() {
      const res = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(res.data);
    }
    getDeck();
  }, [setDeck]);

  useEffect(() => {
    async function drawCard() {
      let { deck_id } = deck;
      try {
        const res = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
        );

        const card = res.data.cards[0];

        setDrawn((c) => [
          {
            id: card.code,
            name: card.value + " of " + card.suit,
            image: card.image
          },
          ...c
        ]);

        if (res.data.remaining === 0) {
          setHideBtn(true);
          toggleContDraw();
          throw new Error("No cards remaining!");
        }
      } catch (err) {
        if (err.message !== "No cards remaining!") {
          console.log(err);
        } else alert(err);
      }
    }

    if (contDraw && !timer.current) {
      timer.current = setInterval(async () => {
        await drawCard();
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [contDraw, setContDraw, deck]);

  const toggleContDraw = () => {
    setContDraw((cont) => !cont);
  };

  const cards = drawn.map((c) => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      <button
        className="Deck-draw"
        onClick={toggleContDraw}
        style={{ visibility: hideBtn ? "hidden" : null }}
      >
        {contDraw ? "Stop" : "Draw"}
      </button>
      <div className="Deck-cards">{cards}</div>
    </div>
  );
};

export default Deck;
