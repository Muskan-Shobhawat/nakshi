// src/components/CategoriesGrid.jsx
import React from "react";
import "../../CSS/Home/Trending.css";

// replace these with your real images in /src/assets
import imgNecklace from "../../assets/t2.JPG";
import imgSets from "../../assets/t4.JPG";
import imgRing from "../../assets/t1.JPG";
import imgWatch from "../../assets/t3.JPG";

const CATEGORIES = [
  {
    id: "necklaces",
    title: "NECKLACES",
    subtitle: "Delicate & bold pieces",
    image: imgNecklace,
    link: "/shop?cat=necklaces",
  },
  {
    id: "sets",
    title: "JEWELRY SETS",
    subtitle: "Coordinated elegance",
    image: imgSets,
    link: "/shop?cat=sets",
  },
  {
    id: "rings",
    title: "RINGS",
    subtitle: "Statement & everyday",
    image: imgRing,
    link: "/shop?cat=rings",
  },
  {
    id: "watches",
    title: "WATCHES",
    subtitle: "Timeless timepieces",
    image: imgWatch,
    link: "/shop?cat=watches",
  },
];

export default function CategoriesGrid() {
  return (
    <section className="cg-root" aria-label="Categories">
      {CATEGORIES.map((c) => (
        <article
          key={c.id}
          className="cg-tile"
          role="link"
          tabIndex={0}
          onClick={() => (window.location.href = c.link)}
          onKeyDown={(e) => {
            if (e.key === "Enter") window.location.href = c.link;
          }}
          style={{ backgroundImage: `url(${c.image})` }}
        >
          <div className="cg-overlay" />
          <div className="cg-content">
            <h3 className="cg-title">{c.title}</h3>
            <p className="cg-sub">{c.subtitle}</p>
            <button
              className="cg-cta"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = c.link;
              }}
            >
              Shop Now
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
