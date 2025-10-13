import React from "react";
import "../../CSS/Home/Highlight.css";
import img from "../../assets/necklace.JPG";
import p1 from "../../assets/premium.png";
import p2 from "../../assets/skin.png";
import p3 from "../../assets/warranty.png";

/**
 * Props:
 *  - title: small overline/title
 *  - heading: main heading
 *  - description: paragraph shown inside the card
 *  - buttonText: CTA text
 *  - imageSrc: URL/path of the image (put image in public/images or pass imported asset)
 *  - points: array of { icon: JSX (optional), title: string, text: string }  (3 items recommended)
 *
 * Example usage:
 * <Highlights
 *   title="Highlights"
 *   heading="Plan a Visit"
 *   description="Hand-finished 1gm gold-plated jewellery with long-lasting shine and skin-safe materials. Visit our store to experience the collection."
 *   buttonText="Book an Appointment"
 *   imageSrc="/images/highlight.jpg"
 * />
 */
export default function Highlights({
  title = "Highlights",
  heading = "Plan a Visit",
  description = "Discover our handcrafted 1gm gold-plated jewellery — lightweight, elegant and perfect for everyday wear.",
  buttonText = "Book an Appointment",
  imageSrc = img,
  points = [
    {
      title: "Premium 1gm Gold Plating",
      text: "High-quality plating that gives a rich, durable finish — looks & feels premium.",
      image:p1,
    },
    {
      title: "Hypoallergenic & Skin-safe",
      text: "Made with skin-friendly base metals and tested for everyday comfort.",
      image:p2,
    },
    {
      title: "Affordable Luxury & Warranty",
      text: "Affordable pieces with quality control — easy exchanges and warranty support.",
      image:p3,
    },
  ],
}) {
  return (
    <section className="hl-section" aria-label="Highlights">
      <div className="hl-inner">
        {/* Left: card */}
        <div className="hl-card-wrap">
          <div className="hl-card">
            <div className="hl-overline">{title}</div>
            <h2 className="hl-heading">{heading}</h2>
            <p className="hl-desc">{description}</p>
            <button
              className="hl-cta"
              onClick={() => {
                // placeholder: replace with navigate or modal open
                alert("CTA clicked — hook this to your appointment flow.");
              }}
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* Right: image */}
        <div
          className="hl-image-wrap"
          role="img"
          aria-label="Jewellery highlight image"
        >
          <img src={imageSrc} alt="Highlight" className="hl-image" />
        </div>
      </div>

      {/* Bottom: three points */}
      <div className="hl-points">
        {points.map((p, idx) => (
          <div className="hl-point" key={idx}>
            <div aria-hidden="true">
              <img src={p.image} alt="" className="h1-point-icon" />
            </div>
            <h4 className="hl-point-title">{p.title}</h4>
            <p className="hl-point-text">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
