(() => {
    const CART_KEY = "proBunCart";

    const getCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            if (!Array.isArray(cart)) return 0;
            return cart.reduce((total, item) => total + Math.max(0, Number(item?.quantity) || 0), 0);
        } catch {
            return 0;
        }
    };

    const updateCartBadges = () => {
        const count = getCartCount();
        document.querySelectorAll("[data-cart-count], #cartCountDesktop, #cartCountMobile").forEach((element) => {
            element.textContent = `(${count})`;
            element.setAttribute("aria-label", `${count} item${count === 1 ? "" : "s"} in cart`);
        });
    };

    window.proBunCartSync = {
        key: CART_KEY,
        getCartCount,
        update: updateCartBadges
    };

    window.addEventListener("storage", (event) => {
        if (event.key === CART_KEY || event.key === null) updateCartBadges();
    });

    window.addEventListener("proBunCartUpdated", updateCartBadges);

    updateCartBadges();
})();
