// src/components/CategorySection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../CSS/Home/Category.css';
import necklace from '../../assets/necklace.JPG'
import earring from '../../assets/earring.JPG'
import bangle from '../../assets/bangle.JPG'
import bracelet from '../../assets/bracelet.JPG'
import ring from '../../assets/ring.JPG'
import kada from '../../assets/kada.JPG'

const categories = [
  // initial: 'text' -> shows text block first, 'image' -> shows image first
  { id: 1, title: 'Stylish Necklace', image: necklace, initial: 'text' },
  { id: 2, title: 'Earrings', image: earring, initial: 'image' },
  { id: 3, title: 'Bangles', image: bangle, initial: 'text' },
  { id: 4, title: 'Bracelets', image: bracelet, initial: 'image' },
  { id: 5, title: 'Rings', image: ring, initial: 'text' },
  { id: 6, title: 'Kada', image: kada, initial: 'image' },
];

const CategoryCard = ({ title, subtitle, image, initial }) => {
  return (
    <div className={`category-card ${initial === 'text' ? 'initial-text' : 'initial-image'}`} tabIndex="0" role="button" aria-pressed="false">
      {/* front = text block */}
      <div className="card-front">
        <div className="card-content">
          <div className="subtitle">{subtitle}</div>
          <div className="title">{title}</div>
        </div>
      </div>

      {/* back = image block */}
      <div className="card-back" aria-hidden={initial === 'text'}>
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default function CategorySection() {
  return (
    <section className="category-section">
      <Container>
        <h2 className="section-heading">SHOP BY <strong>CATEGORY</strong></h2>
        <p className="section-desc">Explore our curated categories</p>

        <Row className="category-grid">
          {categories.map((cat) => (
            <Col key={cat.id} xs={12} sm={6} md={4} className="mb-4">
              <CategoryCard {...cat} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
