import React from "react";

function Card({ name, image }) {
  return <img className="Card" name={name} src={image} alt={name} />;
}

export default Card;
