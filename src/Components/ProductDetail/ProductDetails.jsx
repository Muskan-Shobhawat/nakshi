// src/components/ProductDetails.jsx
import React, { useState } from "react";
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

const sampleImages = [
  heroImage,
  "https://via.placeholder.com/400x400?text=Image+2",
  "https://via.placeholder.com/400x400?text=Image+3",
  "https://via.placeholder.com/400x400?text=Image+4",
];

export default function ProductDetails() {
  const { id } = useParams();
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

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side: Product Images */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={sampleImages[0]}
            alt="main"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 3,
              mb: 2,
            }}
          />
          <Stack direction="row" spacing={2}>
            {sampleImages.slice(1).map((img, index) => (
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
            Product {id}
          </Typography>
          <Typography variant="h6" color="error" gutterBottom>
            ₹15,999
          </Typography>
          <Typography variant="body1" gutterBottom>
            Elegant handcrafted 1gm gold-plated necklace, perfect for weddings
            and festive occasions.
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
        {reviews.map((review, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: "#fff0f6" }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {review.user}
            </Typography>
            <Typography variant="body2">{review.text}</Typography>
          </Paper>
        ))}

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
