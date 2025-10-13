import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [currentImage, setCurrentImage] = useState(""); // for main image display
  const [slideIndex, setSlideIndex] = useState(0); // for slider

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://nakshi.onrender.com/api/products/${id}`
        );
        const data = res.data.product || res.data;
        setProduct(data);
        setCurrentImage(data.mainPhoto);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, { user: "Guest", text: newReview }]);
      setNewReview("");
    }
  };

  // Slider: next / previous
  const handleNext = () => {
    if (product) {
      const allImages = [product.mainPhoto, ...(product.photos || [])];
      setSlideIndex((prev) => (prev + 1) % allImages.length);
      setCurrentImage(allImages[(slideIndex + 1) % allImages.length]);
    }
  };

  const handlePrev = () => {
    if (product) {
      const allImages = [product.mainPhoto, ...(product.photos || [])];
      setSlideIndex(
        (prev) => (prev - 1 + allImages.length) % allImages.length
      );
      setCurrentImage(allImages[(slideIndex - 1 + allImages.length) % allImages.length]);
    }
  };

  if (!product)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Loading product details...
      </Typography>
    );

  const allImages = [product.mainPhoto, ...(product.photos || [])];

  return (
    <Box sx={{ p: "4vh" }}>
      <Grid container spacing={4}>
        {/* LEFT: Product Images */}
        <Grid item xs={12} md={6}>
          {/* Main Image Slider */}
          <Box sx={{ position: "relative", textAlign: "center" }}>
            <Box
              component="img"
              src={currentImage}
              alt={product.name}
              sx={{
                width: "100%",
                height: "60vh",
                objectFit: "cover",
                borderRadius: "1.5vh",
                boxShadow: 3,
              }}
            />
            {/* Slider Buttons */}
            <Button
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: "2%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              ◀
            </Button>
            <Button
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: "2%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              ▶
            </Button>
          </Box>

          {/* Thumbnails */}
          <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: "2vh" }}>
            {allImages.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`thumb-${index}`}
                onClick={() => {
                  setCurrentImage(img);
                  setSlideIndex(index);
                }}
                sx={{
                  width: "10vw",
                  height: "10vh",
                  objectFit: "cover",
                  borderRadius: "1vh",
                  cursor: "pointer",
                  border: currentImage === img ? "2px solid #d4af37" : "2px solid transparent",
                  transition: "0.3s",
                }}
              />
            ))}
          </Stack>
        </Grid>

        {/* RIGHT: Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="error" gutterBottom>
            ₹{product?.price?.toLocaleString() || "0"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {product.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: "1vh", color: "gray" }}>
            Gender: {product.gender} | Category: {product.category} | Occasion:{" "}
            {product.occasion}
          </Typography>

          {/* Wishlist & Rating */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: "2vh" }}>
            <IconButton onClick={() => setWishlist(!wishlist)} color="error">
              {wishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Rating
              name="product-rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </Stack>

          <Button variant="contained" color="primary" sx={{ mt: "3vh", px: "4vw", py: "1vh" }}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: "6vh" }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        {reviews.map((review, index) => (
          <Paper key={index} sx={{ p: "2vh", mb: "2vh", backgroundColor: "#fff7e6" }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {review.user}
            </Typography>
            <Typography variant="body2">{review.text}</Typography>
          </Paper>
        ))}
        <Stack direction="row" spacing={2} sx={{ mt: "2vh" }}>
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
