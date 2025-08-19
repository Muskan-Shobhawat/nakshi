import React from 'react';

function PromoSection() {
  return (
    <section className="bg-light py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">Our Highlights</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>New Arrivals</h5>
              <p>Discover our latest luxury jewelry designs.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>Festive Picks</h5>
              <p>Perfect for celebrations and gifting.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>Best Sellers</h5>
              <p>Customer favorites, crafted with love.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
