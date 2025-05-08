// Main JavaScript file for MarketWeb

// Global variables
let allProducts = [];
let filteredProducts = [];
let cart = [];

// DOM elements
const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const sortSelect = document.getElementById("sort-select");
const priceSlider = document.getElementById("price-slider");
const maxPriceDisplay = document.getElementById("max-price");
const minPriceInput = document.getElementById("min-price-input");
const maxPriceInput = document.getElementById("max-price-input");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");
const inStockCheckbox = document.getElementById("in-stock-only");
const cartCountElement = document.querySelector(".cart-count");
const categoryCheckboxes = document.querySelectorAll(
  ".categories-filter input"
);
const modal = document.getElementById("product-modal");
const modalProductDetails = document.getElementById("modal-product-details");
const closeModalBtn = document.querySelector(".close-modal");
const cartIcon = document.querySelector(".cart-icon");
const cartModal = document.getElementById("cart-modal");
const cartModalContent = document.getElementById("cart-modal-content");
const closeCartModalBtn = document.querySelector(".close-cart-modal");

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
    setupCategories();

    // Update price inputs with the maximum price from products
    const maxProductPrice = Math.max(
      ...allProducts.map((product) => product.price)
    );
    // Set the slider max to 20% higher than the highest product price
    const sliderMax = Math.ceil(maxProductPrice * 1.2);
    priceSlider.max = sliderMax;
    priceSlider.value = sliderMax;
    maxPriceDisplay.textContent = `$${sliderMax}`;
    maxPriceInput.placeholder = `Max ($${sliderMax})`;
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = `<p>Error loading products. Please try again later.</p>`;
  }
}

// Display products in the grid
function displayProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = `<div class="no-products-message">No products found matching your criteria.</div>`;
    return;
  }

  productsContainer.innerHTML = products
    .map(
      (product, index) => `
    <article class="product-card" data-id="${
      product.id
    }" style="animation-delay: ${index * 0.05}s">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-details">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <span class="product-rating">
            ${getStarRating(product.rating)}
          </span>
        </div>
        <span class="product-category">${product.category}</span>
        <p class="product-availability ${
          product.inStock ? "in-stock" : "out-of-stock"
        }">
          ${product.inStock ? "In Stock" : "Out of Stock"}
        </p>
        <button class="add-to-cart-btn" data-id="${product.id}" ${
        !product.inStock ? "disabled" : ""
      }>
          ${product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  `
    )
    .join("");

  // Add event listeners to all product cards for modal
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", handleProductClick);
  });

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
}

// Handle product card click to open modal
function handleProductClick(e) {
  // If the click was on the Add to Cart button, don't open the modal
  if (e.target.classList.contains("add-to-cart-btn")) {
    return;
  }

  const productId = parseInt(this.dataset.id);
  const product = allProducts.find((p) => p.id === productId);

  if (product) {
    showProductModal(product);
  }
}

// Show product modal with details
function showProductModal(product) {
  modalProductDetails.innerHTML = `
    <div class="modal-product-top">
      <div class="modal-product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal-product-info">
        <h2 class="modal-product-name">${product.name}</h2>
        <span class="modal-product-category">${product.category}</span>
        <div class="modal-product-price">$${product.price.toFixed(2)}</div>
        <div class="modal-product-rating">${getStarRating(product.rating)}</div>
        <div class="modal-product-availability ${
          product.inStock ? "in-stock" : "out-of-stock"
        }">
          ${product.inStock ? "In Stock" : "Out of Stock"}
        </div>
        <p class="modal-product-description">${product.description}</p>
        <button class="modal-add-to-cart" data-id="${product.id}" ${
    !product.inStock ? "disabled" : ""
  }>
          ${product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  `;

  // Add event listener to modal Add to Cart button
  const modalAddToCartBtn = document.querySelector(".modal-add-to-cart");
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", handleAddToCart);
  }

  // Display the modal
  modal.style.display = "block";

  // Prevent scrolling of the body when modal is open
  document.body.style.overflow = "hidden";
}

// Show cart modal with cart items
function showCartModal() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  // Calculate total cost of items in cart
  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Generate the cart modal content
  cartModalContent.innerHTML = `
    <h2>Your Shopping Cart</h2>
    <div class="cart-items">
      ${cart
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p class="cart-item-price">$${item.price.toFixed(2)} × ${
            item.quantity
          }</p>
            <p class="cart-item-total">$${(item.price * item.quantity).toFixed(
              2
            )}</p>
          </div>
          <div class="cart-item-controls">
            <button class="decrease-quantity" data-id="${item.id}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="increase-quantity" data-id="${item.id}">+</button>
            <button class="remove-from-cart" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-summary">
      <div class="cart-total">
        <span>Total:</span>
        <span>$${totalCost.toFixed(2)}</span>
      </div>
      <div class="cart-actions">
        <button class="clear-cart">Clear Cart</button>
        <button class="checkout-btn">Checkout</button>
      </div>
    </div>
  `;

  // Add event listeners to cart controls
  cartModalContent.querySelectorAll(".decrease-quantity").forEach((btn) => {
    btn.addEventListener("click", handleDecreaseQuantity);
  });

  cartModalContent.querySelectorAll(".increase-quantity").forEach((btn) => {
    btn.addEventListener("click", handleIncreaseQuantity);
  });

  cartModalContent.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", handleRemoveFromCart);
  });

  // Clear cart button
  const clearCartBtn = cartModalContent.querySelector(".clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      updateCartCount();
      showToast("Cart has been cleared");
      closeCartModal();
    });
  }

  // Checkout button (placeholder functionality)
  const checkoutBtn = cartModalContent.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("Checkout functionality would go here");
    });
  }

  // Display the cart modal
  cartModal.style.display = "block";

  // Prevent scrolling of the body when modal is open
  document.body.style.overflow = "hidden";
}

// Close product modal
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Close cart modal
function closeCartModal() {
  cartModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Handle decreasing item quantity in cart
function handleDecreaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
      updateCartCount();
      showCartModal(); // Refresh the cart modal
    } else {
      handleRemoveFromCart(e);
    }
  }
}

// Handle increasing item quantity in cart
function handleIncreaseQuantity(e) {
  const productId = parseInt(e.target.dataset.id);
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity++;
    updateCartCount();
    showCartModal(); // Refresh the cart modal
  }
}

// Handle removing item from cart
function handleRemoveFromCart(e) {
  const productId = parseInt(e.target.closest(".remove-from-cart").dataset.id);
  cart = cart.filter((item) => item.id !== productId);
  updateCartCount();

  if (cart.length === 0) {
    closeCartModal();
    showToast("Your cart is now empty");
  } else {
    showCartModal(); // Refresh the cart modal
  }
}

// Generate star rating HTML
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Setup category filters based on available products
function setupCategories() {
  const allCategories = new Set(allProducts.map((product) => product.category));

  // Clear the All checkbox when any other category is selected
  document
    .querySelector('input[data-category="All"]')
    .addEventListener("change", function () {
      if (this.checked) {
        categoryCheckboxes.forEach((checkbox) => {
          if (checkbox.dataset.category !== "All") {
            checkbox.checked = false;
          }
        });
      }
    });

  // Clear the All checkbox when any other category is selected
  categoryCheckboxes.forEach((checkbox) => {
    if (checkbox.dataset.category !== "All") {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          document.querySelector('input[data-category="All"]').checked = false;
        }
      });
    }
  });
}

// Apply all filters to the products
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const maxPrice = maxPriceInput.value
    ? parseInt(maxPriceInput.value)
    : parseInt(priceSlider.value);
  const minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : 0;
  const selectedCategories = Array.from(categoryCheckboxes)
    .filter(
      (checkbox) => checkbox.checked && checkbox.dataset.category !== "All"
    )
    .map((checkbox) => checkbox.dataset.category);
  const isAllSelected = document.querySelector(
    'input[data-category="All"]'
  ).checked;
  const inStockOnly = inStockCheckbox.checked;

  filteredProducts = allProducts.filter((product) => {
    // Name and description search
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    // Price filter - match products within min and max price range
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    // Category filter
    const matchesCategory =
      isAllSelected || selectedCategories.includes(product.category);

    // Stock filter
    const matchesStock = !inStockOnly || product.inStock;

    return matchesSearch && matchesPrice && matchesCategory && matchesStock;
  });

  // Apply sorting
  sortProducts();
}

// Sort products based on the selected option
function sortProducts() {
  const sortOption = sortSelect.value;

  switch (sortOption) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // Default sorting (by id)
      filteredProducts.sort((a, b) => a.id - b.id);
  }

  displayProducts(filteredProducts);
}

// Handle adding items to the cart
function handleAddToCart(e) {
  // Stop event propagation to prevent modal opening when clicking the button in product card
  e.stopPropagation();

  const productId = parseInt(e.target.dataset.id);
  const product = allProducts.find((p) => p.id === productId);

  if (product && product.inStock) {
    // Check if product is already in cart
    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    // Update cart count with animation
    updateCartCount(true);

    // Show success message with animation
    showToast(`${product.name} added to cart!`);
  }
}

// Update the cart count
function updateCartCount(animate = false) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = totalItems;

  // Add animation class if requested
  if (animate) {
    cartCountElement.classList.add("updated");

    // Remove the class after animation completes
    setTimeout(() => {
      cartCountElement.classList.remove("updated");
    }, 500);
  }

  // Save cart to localStorage
  localStorage.setItem("marketwebCart", JSON.stringify(cart));
}

// Display toast message
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  // Set toast message and show it
  toast.textContent = message;
  toast.classList.add("show");

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Synchronize price slider and input fields
function syncPriceInputs() {
  // When slider changes, update max input
  maxPriceDisplay.textContent = `$${priceSlider.value}`;
  if (!maxPriceInput.value) {
    maxPriceInput.placeholder = `Max ($${priceSlider.value})`;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Fetch products
  fetchProducts();

  // Load cart from localStorage
  const savedCart = localStorage.getItem("marketwebCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }

  // Price slider
  priceSlider.addEventListener("input", syncPriceInputs);

  // Apply filters button
  applyFiltersBtn.addEventListener("click", () => {
    applyFilters();
  });

  // Reset filters button
  resetFiltersBtn.addEventListener("click", () => {
    // Reset search
    searchInput.value = "";

    // Reset price inputs
    minPriceInput.value = "";
    maxPriceInput.value = "";

    // Reset price slider
    const maxProductPrice = Math.max(
      ...allProducts.map((product) => product.price)
    );
    const sliderMax = Math.ceil(maxProductPrice * 1.2);
    priceSlider.value = sliderMax;
    maxPriceDisplay.textContent = `$${sliderMax}`;

    // Reset categories
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = checkbox.dataset.category === "All";
    });

    // Reset stock filter
    inStockCheckbox.checked = false;

    // Reset sort
    sortSelect.value = "default";

    // Apply reset
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
  });

  // Search input
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  });

  // Search button
  searchBtn.addEventListener("click", () => {
    applyFilters();
  });

  // Sort select
  sortSelect.addEventListener("change", () => {
    sortProducts();
  });

  // Close product modal with close button
  closeModalBtn.addEventListener("click", closeModal);

  // Close cart modal with close button
  if (closeCartModalBtn) {
    closeCartModalBtn.addEventListener("click", closeCartModal);
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
    if (e.target === cartModal) {
      closeCartModal();
    }
  });

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.style.display === "block") {
        closeModal();
      }
      if (cartModal && cartModal.style.display === "block") {
        closeCartModal();
      }
    }
  });

  // Cart icon click to open cart modal
  cartIcon.addEventListener("click", showCartModal);

  // Logo animation on hover
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("mouseenter", () => {
      logo.style.transform = "scale(1.05)";
      logo.style.transition = "transform 0.3s ease";
    });

    logo.addEventListener("mouseleave", () => {
      logo.style.transform = "scale(1)";
    });
  }
});
