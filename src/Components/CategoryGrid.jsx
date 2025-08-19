import React from 'react';

function CategoryGrid() {
  const categories = [
    { title: 'Bridal Sets', img: '/assets/heroimg.jpg' },
    { title: 'Earrings', img: '/assets/heroimg.jpg' },
    { title: 'Bangles', img: '/assets/heroimg.jpg' },
    { title: 'Men’s Jewelry', img: '/assets/heroimg.jpg' },
    { title: 'Festive Picks', img: '/assets/heroimg.jpg' },
    { title: 'Limited Edition', img: '/assets/heroimg.jpg' }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {categories.map((cat, index) => (
            <div className="col-md-4" key={index}>
              <div className="category-card text-center">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="img-fluid rounded shadow-sm"
                />
                <h5 className="mt-3">{cat.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
