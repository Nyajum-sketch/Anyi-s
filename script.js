// Product Data
const products = [
    {
        id: 1,
        name: "Amigurumi Bunny",
        description: "Adorable hand-crocheted bunny with soft yarn",
        price: 25.99,
        category: "amigurumi",
    image: "images/bunny_front.png",
    images: ["images/bunny_front.png", "images/bunny_side.png"],
        colors: ["Pink", "White", "Brown"],
        inStock: true
    },
    {
        id: 2,
        name: "Dachshund Amigurumi",
        description: "Cute crocheted dachshund with charming details",
        price: 32.99,
        category: "amigurumi",
    image: "images/dachshund1.png",
    images: ["images/dachshund1.png", "images/dachshund_no_cap.png"],
        colors: ["Brown", "Black", "White"],
        inStock: true
    },
    {
        id: 3,
        name: "Dinosaur Amigurumi",
        description: "Friendly crocheted dinosaur for kids",
        price: 28.99,
        category: "amigurumi",
    image: "images/dino.png",
        colors: ["Green", "Blue", "Purple"],
        inStock: true
    },
    {
        id: 4,
        name: "Christmas Elf",
        description: "Festive crocheted elf for holiday decoration",
        price: 35.99,
        category: "amigurumi",
    image: "images/elf.png",
        colors: ["Red", "Green", "White"],
        inStock: true
    },
    {
        id: 5,
        name: "Cow Amigurumi",
        description: "Adorable crocheted cow with spots",
        price: 30.99,
        category: "amigurumi",
        image: "images/moo.png",
        colors: ["Black & White", "Brown", "Pink"],
        inStock: true
    },
    {
        id: 6,
        name: "Custom Amigurumi Set",
        description: "Mix and match from our collection",
        price: 45.99,
        category: "amigurumi",
    image: "images/bunny_front.png",
        colors: ["Various", "Custom", "Mixed"],
        inStock: true
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const productModalBody = document.getElementById('productModalBody');
const closeProduct = document.getElementById('closeProduct');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    console.log('Products:', products);
    displayProducts(products);
    updateCartDisplay();
    setupEventListeners();
    console.log('Initialization complete');
});

// Event Listeners
function setupEventListeners() {
    // Cart functionality
    cartBtn.addEventListener('click', () => cartModal.classList.add('show'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('show'));
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Product modal
    closeProduct.addEventListener('click', () => productModal.classList.remove('show'));
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterProducts(filter);
        });
    });
    
    // Mobile menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close modals when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('show');
    });
    
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.classList.remove('show');
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', handleContactForm);
}

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    console.log('Creating card for:', product.name);
    const card = document.createElement('div');
    // add display-card-yarn so cards use the yarn background texture
    card.className = 'product-card display-card-yarn';
    
    // Add gallery indicator and arrows if product has multiple images
    const hasMultipleImages = product.images && product.images.length > 1;
    const galleryIndicator = hasMultipleImages ? 
        `<div class="gallery-indicator" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.6rem; border-radius: 15px; font-size: 0.8rem;">
            <i class="fas fa-images"></i> ${product.images.length}
        </div>` : '';
    
    const navigationArrows = hasMultipleImages ? 
        `<button class="card-nav-arrow left" onclick="event.stopPropagation(); changeCardImage(${product.id}, -1)" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="card-nav-arrow right" onclick="event.stopPropagation(); changeCardImage(${product.id}, 1)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            <i class="fas fa-chevron-right"></i>
        </button>` : '';
    
    const clickHint = hasMultipleImages ? 
        `<div class="click-hint" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; opacity: 0; transition: opacity 0.3s ease;">
            <i class="fas fa-expand"></i> Click to view gallery
        </div>` : '';
    
    // if this product's artwork has transparency (no white box), add a class to avoid forcing a white background
    const imgClass = (product.id === 5) ? 'no-image-bg' : '';
    // scale amigurumi thumbnails a bit larger for emphasis
    const imgWidth = product.category === 'amigurumi' ? '92%' : '84%';
    const imgMaxH = product.category === 'amigurumi' ? '220px' : '160px';
    // use cover for specific artwork that benefits from filling the thumbnail (dino, elf)
    const coverIds = new Set([3, 4]); // product ids for Dino (3) and Elf (4)
    const objectFit = coverIds.has(product.id) ? 'cover' : 'contain';

    card.dataset.category = product.category; // allow CSS hooks as well

    card.innerHTML = `
        <div class="product-image" style="position: relative; text-align: center;">
            <img id="card-image-${product.id}" class="${imgClass}" src="${product.image}" alt="${product.name}" style="width: ${imgWidth}; max-height: ${imgMaxH}; height: auto; object-fit: ${objectFit}; border-radius: 10px; transition: opacity 0.3s ease;">
            ${galleryIndicator}
            ${navigationArrows}
            ${clickHint}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    // Store current image index for this product
    if (hasMultipleImages) {
        window[`cardImageIndex_${product.id}`] = 0;
    }
    
    // Add click event to open product modal
    card.addEventListener('click', (e) => {
        console.log('Card clicked for:', product.name);
        console.log('Target:', e.target);
        console.log('Target classes:', e.target.classList);
        if (!e.target.classList.contains('add-to-cart') && 
            !e.target.closest('.card-nav-arrow') && 
            !e.target.classList.contains('gallery-indicator')) {
            console.log('Opening modal for:', product.name);
            openProductModal(product);
        } else {
            console.log('Click blocked by target element');
        }
    });
    
    return card;
}

// Change Card Image
function changeCardImage(productId, direction) {
    console.log('changeCardImage called for product:', productId, 'direction:', direction);
    const product = products.find(p => p.id === productId);
    if (!product || !product.images) {
        console.log('Product not found or no images');
        return;
    }
    
    const currentIndex = window[`cardImageIndex_${productId}`] || 0;
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = product.images.length - 1;
    if (newIndex >= product.images.length) newIndex = 0;
    
    // Update the image with smooth transition
    const cardImage = document.getElementById(`card-image-${productId}`);
    if (cardImage) {
        cardImage.style.opacity = '0';
        setTimeout(() => {
            cardImage.src = product.images[newIndex];
            cardImage.style.opacity = '1';
        }, 150);
    }
    
    // Update stored index
    window[`cardImageIndex_${productId}`] = newIndex;
}

// Filter Products
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Update Cart Display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff6b6b; margin-left: 0.5rem;">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Open Product Modal
function openProductModal(product) {
    const images = product.images || [product.image];
    const currentImageIndex = 0;
    
    productModalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
            <div class="product-modal-image" style="text-align: center; position: relative;">
                <div class="image-gallery" style="position: relative; display: inline-block;">
                    <img id="modalMainImage" src="${images[currentImageIndex]}" alt="${product.name}" style="width: 100%; max-width: 400px; height: auto; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: opacity 0.3s ease;">
                    ${images.length > 1 ? `
                        <button class="gallery-nav prev" onclick="changeGalleryImage(${product.id}, -1)" style="position: absolute; left: -20px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.2rem;">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-nav next" onclick="changeGalleryImage(${product.id}, 1)" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.2rem;">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <div class="gallery-dots" style="text-align: center; margin-top: 1rem;">
                            ${images.map((_, index) => `<span class="gallery-dot ${index === currentImageIndex ? 'active' : ''}" onclick="changeGalleryImage(${product.id}, ${index - currentImageIndex})" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${index === currentImageIndex ? '#8FBC8F' : '#ccc'}; margin: 0 5px; cursor: pointer; transition: background 0.3s ease;"></span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="product-modal-info">
                <h2 style="font-family: 'Kalam', cursive; margin-bottom: 1rem; color: #2C3E50;">${product.name}</h2>
                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${product.description}</p>
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #FF6B6B; font-size: 1.5rem;">$${product.price}</strong>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Available Colors:</strong>
                    <div style="margin-top: 0.5rem;">
                        ${product.colors.map(color => `<span style="display: inline-block; padding: 0.3rem 0.8rem; margin: 0.2rem; background: #8FBC8F; color: white; border-radius: 15px; font-size: 0.9rem;">${color}</span>`).join('')}
                    </div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <button onclick="addToCart(${product.id}); productModal.classList.remove('show');" 
                        style="width: 100%; background: #8FBC8F; color: white; border: none; padding: 1rem; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 1.1rem; transition: all 0.3s ease;"
                        onmouseover="this.style.background='#FF6B6B'; this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.background='#8FBC8F'; this.style.transform='translateY(0)'">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    // Store current product and image index for gallery navigation
    window.currentProduct = product;
    window.currentImageIndex = currentImageIndex;
    
    // Add touch/swipe support for mobile
    if (images.length > 1) {
        addSwipeSupport(productId);
    }
    
    productModal.classList.add('show');
}

// Change Gallery Image
function changeGalleryImage(productId, direction) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const images = product.images || [product.image];
    const currentIndex = window.currentImageIndex || 0;
    let newIndex;
    
    if (typeof direction === 'number' && direction >= 0) {
        // Direct index selection
        newIndex = direction;
    } else {
        // Direction-based navigation (-1 for prev, 1 for next)
        newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = images.length - 1;
        if (newIndex >= images.length) newIndex = 0;
    }
    
    // Update the image
    const modalImage = document.getElementById('modalMainImage');
    if (modalImage) {
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.src = images[newIndex];
            modalImage.style.opacity = '1';
        }, 150);
    }
    
    // Update dots
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.style.background = index === newIndex ? '#8FBC8F' : '#ccc';
    });
    
    // Update current index
    window.currentImageIndex = newIndex;
}

// Add Swipe Support for Mobile
function addSwipeSupport(productId) {
    const modalImage = document.getElementById('modalMainImage');
    if (!modalImage) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    modalImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    modalImage.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - previous image
                changeGalleryImage(productId, -1);
            } else {
                // Swipe left - next image
                changeGalleryImage(productId, 1);
            }
        }
    });
}

// Handle Checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Simple checkout simulation
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (confirm(`Proceed to checkout with ${itemCount} items for $${total.toFixed(2)}?`)) {
        // Simulate checkout process
        showNotification('Redirecting to checkout...', 'success');
        
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
            saveCart();
            cartModal.classList.remove('show');
            showNotification('Thank you for your purchase!', 'success');
        }, 2000);
    }
}

// Handle Contact Form
function handleContactForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    if (name && email && message) {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#8FBC8F' : '#FF6B6B'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-card {
        transition: all 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
    }
    
    .add-to-cart:hover {
        transform: translateY(-2px);
    }
    
    .filter-btn:hover {
        transform: translateY(-2px);
    }
    
    .contact-item:hover {
        transform: translateX(10px);
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
