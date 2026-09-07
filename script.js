document.addEventListener("DOMContentLoaded", () => {

    let cart = [];
    let ordersList = [];

    const cartButton = document.getElementById("cartButton");
    const cartDrawer = document.getElementById("cartDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const closeCart = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.querySelector(".cart-count");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // Fix images and ensure every category has at least 2 items in a proper grid
    function fixMenuAndAddCategoryItems() {
        // 1. Fix Crispy Fried Chicken image
        document.querySelectorAll(".food-card").forEach(card => {
            const name = (card.dataset.name || "").toLowerCase();
            const imgEl = card.querySelector("img");
            if (name.includes("crispy") || name.includes("chicken")) {
                if (imgEl) {
                    imgEl.src = "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=700&q=80";
                }
            }
        });

        // 2. Ensure Menu Grid has proper layout styling
        const menuContainer = document.querySelector(".food-grid") || document.getElementById("menuGrid") || document.querySelector("#menu .container") || document.querySelector("main");
        if (menuContainer && !menuContainer.style.display.includes("grid")) {
            menuContainer.style.display = "grid";
            menuContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
            menuContainer.style.gap = "20px";
        }

        // 3. Add extra items so every category has at least 2 items
        const additionalItems = [
            { name: "Sprite Can", category: "Drinks", price: 150, desc: "Refreshing 330ml lemon-lime drink", img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=700&q=80" },
            { name: "Zinger Burger", category: "Fast Food", price: 450, desc: "Crispy chicken fillet with spicy mayo", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80" },
            { name: "Pepperoni Pizza", category: "Pizza", price: 1200, desc: "Loaded with extra cheese and pepperoni", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80" },
            { name: "Chocolate Brownie", category: "Desserts", price: 250, desc: "Fudgy rich chocolate brownie slice", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80" }
        ];

        const targetGrid = document.querySelector(".food-grid") || document.getElementById("menuGrid") || document.body;

        additionalItems.forEach(newItem => {
            const exists = Array.from(document.querySelectorAll(".food-card")).some(card => 
                (card.dataset.name || "").toLowerCase() === newItem.name.toLowerCase()
            );

            if (!exists && targetGrid) {
                const card = document.createElement("div");
                card.className = "food-card";
                card.dataset.name = newItem.name;
                card.dataset.category = newItem.category;
                card.innerHTML = `
                    <div class="food-image">
                        <img src="${newItem.img}" alt="${newItem.name}" style="width:100%; height:180px; object-fit:cover; border-radius:12px;">
                    </div>
                    <div class="food-content" style="padding: 12px 0;">
                        <span class="food-category" style="color: var(--accent); font-size: 12px; font-weight: bold; text-transform: uppercase;">${newItem.category}</span>
                        <h4 style="margin: 5px 0; color: white;">${newItem.name}</h4>
                        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 10px;">${newItem.desc}</p>
                        <div class="food-footer" style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="price" style="font-weight: bold; color: white;">Rs. ${newItem.price}</span>
                            <button type="button" class="add-btn" data-name="${newItem.name}" data-price="${newItem.price}" data-img="${newItem.img}" style="background: var(--accent); border: none; color: white; padding: 6px 14px; border-radius: 8px; cursor: pointer;">
                                <i class="bi bi-plus"></i> Add
                            </button>
                        </div>
                    </div>
                `;
                targetGrid.appendChild(card);
            }
        });
    }

    function openCart() {
        if (!cartDrawer || !drawerOverlay) return;
        cartDrawer.classList.add("open");
        drawerOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeCartDrawer() {
        if (!cartDrawer || !drawerOverlay) return;
        cartDrawer.classList.remove("open");
        drawerOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    if (cartButton) cartButton.addEventListener("click", openCart);
    if (closeCart) closeCart.addEventListener("click", closeCartDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeCartDrawer);

    function bindAddButtons() {
        document.querySelectorAll(".add-btn").forEach(button => {
            button.onclick = () => addToCart(button);
        });
    }

    function addToCart(button) {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const img = button.dataset.img;

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }

        updateCart();
        openCart();
    }

    function updateCart() {
        if (!cartItems || !cartTotal || !cartCount) return;

        cartItems.innerHTML = "";
        let total = 0;
        let totalQuantity = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align:center; padding:50px 10px; color:#777;">
                    <i class="bi bi-cart-x" style="font-size:45px; color:#ff5722;"></i>
                    <p style="margin-top:15px;">Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = "Rs. 0";
            cartCount.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalQuantity += item.quantity;

            const cartItem = document.createElement("div");
            cartItem.style.cssText = "display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #292929;";
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}" style="width:65px; height:65px; object-fit:cover; border-radius:9px;">
                <div style="flex:1;">
                    <strong style="display:block; color:white; font-size:14px; margin-bottom:5px;">${item.name}</strong>
                    <span style="color:#ff5722; font-size:13px;">Rs. ${item.price.toLocaleString()}</span>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:9px;">
                        <button class="qty-minus" data-index="${index}" type="button" style="width:27px; height:27px; border:1px solid #444; background:#1b1b1b; color:white; border-radius:5px;">−</button>
                        <span style="color:white; min-width:18px; text-align:center;">${item.quantity}</span>
                        <button class="qty-plus" data-index="${index}" type="button" style="width:27px; height:27px; border:none; background:#ff5722; color:white; border-radius:5px;">+</button>
                        <button class="remove-item" data-index="${index}" type="button" style="margin-left:auto; border:none; background:transparent; color:#ff7043;"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
        cartCount.textContent = totalQuantity;

        cartItems.querySelectorAll(".qty-plus").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);
                if (cart[index]) { cart[index].quantity++; updateCart(); }
            });
        });

        cartItems.querySelectorAll(".qty-minus").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);
                if (!cart[index]) return;
                cart[index].quantity--;
                if (cart[index].quantity <= 0) cart.splice(index, 1);
                updateCart();
            });
        });

        cartItems.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);
                if (cart[index]) { cart.splice(index, 1); updateCart(); }
            });
        });
    }

    let selectedCategory = "All";
    let searchTerm = "";

    function filterFood() {
        const foodCards = document.querySelectorAll(".food-card");
        let visibleCount = 0;
        foodCards.forEach(card => {
            const name = (card.dataset.name || "").toLowerCase();
            const category = (card.dataset.category || "").toLowerCase();
            const categoryMatch = selectedCategory === "All" || category === selectedCategory.toLowerCase();
            const searchMatch = name.includes(searchTerm) || category.includes(searchTerm);

            if (categoryMatch && searchMatch) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });
        const noFood = document.getElementById("noFood");
        if (noFood) noFood.style.display = visibleCount === 0 ? "block" : "none";
    }

    function setCategory(category) {
        selectedCategory = category;
        document.querySelectorAll(".category-card").forEach(card => card.classList.toggle("active", card.dataset.category === category));
        document.querySelectorAll(".filter-btn").forEach(button => button.classList.toggle("active", button.dataset.category === category));
        filterFood();
    }

    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            setCategory(card.dataset.category);
            document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
        });
    });

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => setCategory(button.dataset.category));
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchTerm = searchInput.value.trim().toLowerCase();
            filterFood();
        });
    }

    function showBottomToast(message, isSuccess = true) {
        const existingToast = document.getElementById("bottomToastMessage");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.id = "bottomToastMessage";
        toast.innerText = message;
        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = isSuccess ? "#28a745" : "#ff5722";
        toast.style.color = "#ffffff";
        toast.style.padding = "12px 24px";
        toast.style.borderRadius = "8px";
        toast.style.zIndex = "99999";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "bold";
        toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
        toast.style.transition = "opacity 0.3s ease";

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("login-error");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");

            if (!emailInput || !passwordInput) return;

            const email = emailInput.value.trim();
            const username = email.split('@')[0];
            const initials = username.substring(0, 2).toUpperCase();

            if (loginError) loginError.textContent = "";
            showBottomToast("Login successful!", true);

            updateUserProfile(email, initials, username);

            setTimeout(() => {
                const modalEl = document.getElementById("loginModal");
                if (modalEl && window.bootstrap) {
                    bootstrap.Modal.getInstance(modalEl)?.hide();
                }
                loginForm.reset();
            }, 800);
        });
    }

    function updateUserProfile(email, initials, username) {
        const profileMini = document.querySelector(".profile-mini");
        if (profileMini) {
            profileMini.innerHTML = `
                <span class="avatar" style="background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 50%; width: 32px; height: 32px;">${initials}</span>
                <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${username}</span>
            `;
        }

        const profileSection = document.getElementById("profile");
        if (profileSection) {
            profileSection.innerHTML = `
                <div class="section-heading">
                    <div>
                        <span class="eyebrow">ACCOUNT</span>
                        <h2>Profile</h2>
                    </div>
                </div>
                <div class="profile-card">
                    <div class="profile-avatar">${initials}</div>
                    <div>
                        <h4 style="color: var(--text-main);">${username}</h4>
                        <p style="color: var(--text-muted); margin: 5px 0;">${email}</p>
                        <span style="color: #28a745; font-size: 13px; font-weight: bold;"><i class="bi bi-check-circle-fill"></i> Logged In Successfully</span>
                    </div>
                </div>
            `;
        }
    }

    const vendorForm = document.getElementById("vendorForm");
    const vendorError = document.getElementById("vendor-error");
    const vendorGrid = document.getElementById("vendorGrid");

    if (vendorForm) {
        vendorForm.addEventListener("submit", event => {
            event.preventDefault();
            const name = document.getElementById("vendorName")?.value.trim() || "";
            const type = document.getElementById("vendorType")?.value || "";
            const bio = document.getElementById("vendorBio")?.value.trim() || "";

            if (vendorError) vendorError.textContent = "";

            if (vendorGrid) {
                const card = document.createElement("article");
                card.className = "vendor-card";
                card.innerHTML = `
                    <div class="vendor-image"><img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80" alt="${name}"></div>
                    <div class="vendor-content">
                        <span class="vendor-tag">${type}</span>
                        <h4>${name}</h4>
                        <p>${bio}</p>
                        <button type="button" class="outline-btn vendor-view-btn">View Menu</button>
                    </div>
                `;
                vendorGrid.appendChild(card);
                attachVendorButtons();
            }

            vendorForm.reset();
            showBottomToast("Vendor added successfully!", true);

            const modalEl = document.getElementById("vendorModal");
            if (modalEl && window.bootstrap) {
                bootstrap.Modal.getInstance(modalEl)?.hide();
            }
        });
    }

    function attachVendorButtons() {
        document.querySelectorAll(".vendor-view-btn").forEach(button => {
            button.onclick = () => {
                const card = button.closest(".vendor-card");
                if (!card) return;
                const title = card.querySelector("h4")?.textContent.trim() || "";
                const type = card.querySelector(".vendor-tag")?.textContent.trim() || "";

                document.getElementById("vendorInfoTitle").textContent = title;
                document.getElementById("vendorInfoName").textContent = title;
                document.getElementById("vendorInfoType").textContent = type;

                const modalEl = document.getElementById("vendorInfoModal");
                if (modalEl && window.bootstrap) {
                    new bootstrap.Modal(modalEl).show();
                }
            };
        });
    }
    attachVendorButtons();

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }
            closeCartDrawer();
            const modalEl = document.getElementById("checkoutModal");
            if (modalEl && window.bootstrap) {
                new bootstrap.Modal(modalEl).show();
            }
        });
    }

    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutError = document.getElementById("checkout-error");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("checkoutName")?.value.trim() || "";
            const phone = document.getElementById("checkoutPhone")?.value.trim() || "";
            const address = document.getElementById("checkoutAddress")?.value.trim() || "";
            const account = document.getElementById("checkoutAccount")?.value.trim() || "";

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const newOrder = {
                id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
                name: name,
                phone: phone,
                address: address,
                account: account,
                items: [...cart],
                total: total,
                date: new Date().toLocaleDateString()
            };

            ordersList.unshift(newOrder);
            renderOrders();

            const modalEl = document.getElementById("checkoutModal");
            if (modalEl && window.bootstrap) {
                bootstrap.Modal.getInstance(modalEl)?.hide();
            }

            showBottomToast(`Order placed successfully! Total: Rs. ${total.toLocaleString()}`, true);

            checkoutForm.reset();
            if (checkoutError) checkoutError.textContent = "";
            cart = [];
            updateCart();
        });
    }

    function renderOrders() {
        const ordersSection = document.getElementById("orders");
        if (!ordersSection) return;

        if (ordersList.length === 0) {
            ordersSection.innerHTML = `
                <div class="section-heading">
                    <div>
                        <span class="eyebrow">YOUR ACTIVITY</span>
                        <h2>Orders</h2>
                    </div>
                </div>
                <div class="empty-section" id="ordersEmpty">
                    <i class="bi bi-bag-x" style="font-size: 40px; color: var(--accent);"></i>
                    <h4 style="margin-top: 10px;">No orders yet</h4>
                    <p>Your placed orders will appear here.</p>
                </div>
            `;
            return;
        }

        let ordersHTML = `
            <div class="section-heading">
                <div>
                    <span class="eyebrow">YOUR ACTIVITY</span>
                    <h2>Orders</h2>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 15px;">
        `;

        ordersList.forEach(order => {
            ordersHTML += `
                <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 20px; border-radius: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <strong style="color: var(--accent);">${order.id}</strong>
                        <span style="color: var(--text-muted); font-size: 13px;">${order.date}</span>
                    </div>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${order.name}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${order.phone}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${order.address}</p>
                    <div style="margin-top: 10px; font-size: 14px;">
                        <strong>Items:</strong>
                        <ul style="margin: 5px 0 0 20px; color: var(--text-muted);">
                            ${order.items.map(i => `<li>${i.name} (x${i.quantity}) - Rs. ${i.price * i.quantity}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="margin-top: 15px; text-align: right; font-size: 16px;">
                        <strong>Total: Rs. ${order.total.toLocaleString()}</strong>
                    </div>
                </div>
            `;
        });

        ordersHTML += `</div>`;
        ordersSection.innerHTML = ordersHTML;
    }

    // Execute everything on load
    fixMenuAndAddCategoryItems();
    bindAddButtons();
    updateCart();
    filterFood();
});
