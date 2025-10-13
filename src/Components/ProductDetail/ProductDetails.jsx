// src/components/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Rating,
  TextField,
  Paper,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Sample product images (in real app, fetch from backend)
import heroImage from "../../assets/heroimg.jpg";

// const sampleImages = [
//   heroImage,
//   "https://via.placeholder.com/400x400?text=Image+2",
//   "https://via.placeholder.com/400x400?text=Image+3",
//   "https://via.placeholder.com/400x400?text=Image+4",
// ];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [rating, setRating] = useState(4);
  const [reviews, setReviews] = useState([
    { user: "Aditi", text: "Loved the quality! Very shiny." },
    { user: "Rohit", text: "Perfect for gifting. Elegant design." },
  ]);
  const [newReview, setNewReview] = useState("");

  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, { user: "Guest", text: newReview }]);
      setNewReview("");
    }
  };

    // ✅ Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://nakshi.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchProduct();
  }, [id]);

   if (!product)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Loading product details...
      </Typography>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side: Product Images */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
           src={product.mainPhoto}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 3,
              mb: 2,
            }}
          />
          <Stack direction="row" spacing={2}>
            {[product.photo1, product.photo2, product.photo3]
              .filter(Boolean).map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`thumbnail-${index}`}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: "2px solid #ffd6e8",
                }}
              />
            ))}
          </Stack>
        </Grid>

        {/* Right Side: Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="error" gutterBottom>
           ₹{product.price.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
             {product.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
            Gender: {product.gender} | Category: {product.category} | Occasion:{" "}
            {product.occasion}
          </Typography>

          {/* Wishlist & Rating */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <IconButton onClick={() => setWishlist(!wishlist)} color="error">
              {wishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Rating
              name="product-rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </Stack>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, px: 4, py: 1 }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
         {reviews.length === 0 ? (
          <Typography>No reviews yet. Be the first to review!</Typography>
        ) : (
          reviews.map((review, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#fff0f6" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {review.user}
              </Typography>
              <Typography variant="body2">{review.text}</Typography>
            </Paper>
          ))
        )}

        {/* Add Review */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Write a review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <Button variant="contained" color="error" onClick={handleAddReview}>
            Post
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
