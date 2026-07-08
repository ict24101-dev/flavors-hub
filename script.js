document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 🛒 1. CART SYSTEM INITIALIZATION
    // ==========================================
    let cart = [];

    const cartCountElement = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalPriceElement = document.getElementById("cart-total-price");
    const cartSidebar = document.getElementById("cart-sidebar");
    const floatingCart = document.querySelector(".floating-cart");
    const closeCartBtn = document.getElementById("close-cart");
    const orderButtons = document.querySelectorAll(".order-btn");

    // Sidebar විවෘත කිරීම සහ වැසීම
    floatingCart?.addEventListener("click", () => cartSidebar?.classList.add("open"));
    closeCartBtn?.addEventListener("click", () => cartSidebar?.classList.remove("open"));

    // Order Now බටන් ක්ලික් ඉවෙන්ට්ස්
    orderButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cardContent = this.closest(".card-content");
            const itemName = cardContent.querySelector(".item-header h3, h3").innerText;
            const priceText = cardContent.querySelector(".item-header .price, .price").innerText;
            const itemPrice = parseInt(priceText.replace("Rs.", "").trim());

            addToCart(itemName, itemPrice);

            // Button Feedback එක
            const originalText = this.innerText;
            this.innerText = "✓ Added";
            this.style.pointerEvents = "none";
            setTimeout(() => {
                this.innerText = originalText;
                this.style.pointerEvents = "auto";
            }, 1000);
        });
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartUI();
    }

    function updateCartUI() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = "";
        
        let totalCount = 0;
        let totalPrice = 0;

        cart.forEach((item, index) => {
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;

            const itemRow = document.createElement("div");
            itemRow.classList.add("cart-item");
            itemRow.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price * item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemRow);
        });

        if (cartCountElement) cartCountElement.innerText = totalCount;
        if (cartTotalPriceElement) cartTotalPriceElement.innerText = `Rs. ${totalPrice}`;
    }

    // 🔥 OPTIMIZATION 1 (Event Delegation): 
    // පරණ Listener බග් එක සම්පූර්ණයෙන්ම විසඳීමට මුළු Container එකටම එක ඉවෙන්ට් එකක් දීම.
    cartItemsContainer?.addEventListener("click", (e) => {
        const btn = e.target.closest(".qty-btn");
        if (!btn) return;

        const index = parseInt(btn.getAttribute("data-index"));
        
        if (btn.classList.contains("plus")) {
            cart[index].quantity++;
        } else if (btn.classList.contains("minus")) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
        }
        updateCartUI();
    });


    // ==========================================
    // 🎂 2. CATEGORY FILTER SYSTEM (ULTRA-SMOOTH)
    // ==========================================
    const filterButtons = document.querySelectorAll(".tab-btn");
    const menuCards = document.querySelectorAll(".menu-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".tab-btn.active")?.classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                
                // මුලින්ම හැම එකක්ම Reset කරනවා
                card.classList.add("hide", "completely-hidden");

                // 🔥 OPTIMIZATION 2: setTimeout වෙනුවට ක්ෂණිකව Layout එක Render කර සුමටව පෙන්වීම
                setTimeout(() => {
                    if (filterValue === "all" || filterValue === cardCategory) {
                        card.classList.remove("completely-hidden");
                        setTimeout(() => card.classList.remove("hide"), 20);
                    }
                }, 50);
            });
        });
    });
});