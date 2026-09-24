(() => {
    const catalog = [
        { id: 'smash-pro-feature', name: 'Smash Pro', category: 'Burgers', description: 'Crispy-edged smashed beef, melted cheese and house sauce.', keywords: 'smash beef burger cheese' },
        { id: 'classic-pro', name: 'Classic Pro', category: 'Burgers', description: 'Classic beef burger with fresh toppings and signature sauce.', keywords: 'classic beef burger' },
        { id: 'cheese-melt', name: 'Cheese Melt', category: 'Burgers', description: 'Juicy beef, melted cheese and a toasted bun.', keywords: 'cheese burger beef' },
        { id: 'double-stack', name: 'Double Stack', category: 'Burgers', description: 'Two beef patties, double cheese and serious sauce.', keywords: 'double beef burger stack cheese' },
        { id: 'smoke-bomb', name: 'Smoke Bomb', category: 'Burgers', description: 'Smoky beef, bold sauce and a toasted bun.', keywords: 'smoke smoky beef burger' },
        { id: 'fire-stack', name: 'Fire Stack', category: 'Burgers', description: 'Bold beef burger with a spicy kick.', keywords: 'spicy hot beef burger' },
        { id: 'crispy-pro', name: 'Crispy Pro', category: 'Chicken', description: 'Crunchy chicken, cool sauce and a toasted bun.', keywords: 'crispy chicken burger' },
        { id: 'hot-chicken', name: 'Firespark chicken', category: 'Chicken', description: 'Crispy chicken with a hot, flavour-packed finish.', keywords: 'hot spicy chicken' },
        { id: 'chicken-tenders', name: 'Chicken Tenders', category: 'Chicken', description: 'Crispy golden chicken tenders with dipping sauce.', keywords: 'tenders strips chicken' },
        { id: 'loaded-fries', name: 'Loaded Fries', category: 'Fries & Sides', description: 'Golden fries loaded with cheese and signature toppings.', keywords: 'loaded fries cheese fries' },
        { id: 'cheese-fries', name: 'Cheese Fries', category: 'Fries & Sides', description: 'Crispy fries covered in rich melted cheese.', keywords: 'cheesy fries cheese fries' },
        { id: 'fries', name: 'Classic Fries', category: 'Fries & Sides', description: 'Crispy golden fries, seasoned and ready to share.', keywords: 'fries chips side' },
        { id: 'pro-cola', name: 'Pro Cola', category: 'Drinks', description: 'Ice-cold cola made for the perfect burger pairing.', keywords: 'cola coke soft drink soda' },
        { id: 'pro-lemonade', name: 'Lemon Ice', category: 'Drinks', description: 'Cold, refreshing lemonade with a bright citrus kick.', keywords: 'lemon lemonade drink' },
        { id: 'mineral-water', name: 'Mineral Water', category: 'Drinks', description: 'Chilled bottled mineral water.', keywords: 'water drink' },
        { id: 'garlic-dip', name: 'Garlic Dip', category: 'Dips & Sauces', description: 'Creamy garlic dip made for dunking.', keywords: 'garlic sauce dip' },
        { id: 'pro-sauce', name: 'Pro Sauce', category: 'Dips & Sauces', description: 'Our signature sauce with a bold, savoury finish.', keywords: 'signature sauce dip' },
        { id: 'pro-meal', name: 'Pro Meal', category: 'Deals', description: 'A complete PRO BUN meal built around your craving.', keywords: 'meal deal combo', image: './assets/images/products/pro-meal.png' }
    ];

    const normalize = (value) => String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    const score = (item, query) => {
        const q = normalize(query);
        if (!q) return 0;
        const fields = [item.name, item.category, item.description, item.keywords].map(normalize);
        let points = 0;
        fields.forEach((field, index) => {
            if (field === q) points += 100 - index * 10;
            if (field.includes(q)) points += 45 - index * 5;
            q.split(' ').filter(Boolean).forEach(word => {
                if (field.includes(word)) points += 8;
            });
        });
        return points;
    };

    const styles = `
        .pro-search-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:7vh 20px 30px;background:rgba(33,26,22,.68);backdrop-filter:blur(7px);opacity:0;visibility:hidden;transition:opacity 180ms ease,visibility 180ms ease}
        .pro-search-overlay.is-open{opacity:1;visibility:visible}
        .pro-search-panel{width:min(680px,100%);overflow:hidden;border:1px solid rgba(33,26,22,.12);border-radius:12px;background:#F7F2E9;box-shadow:0 30px 80px rgba(33,26,22,.28);transform:translateY(-12px);transition:transform 220ms ease}
        .pro-search-overlay.is-open .pro-search-panel{transform:translateY(0)}
        .pro-search-head{display:flex;align-items:center;gap:12px;padding:18px 18px 14px;border-bottom:1px solid rgba(33,26,22,.1)}
        .pro-search-input-wrap{display:flex;align-items:center;gap:12px;flex:1;border:1px solid rgba(33,26,22,.18);border-radius:7px;background:#fff;padding:0 13px;height:50px;transition:border-color 160ms ease,box-shadow 160ms ease}
        .pro-search-input-wrap:focus-within{border-color:#C7352D;box-shadow:0 0 0 3px rgba(199,53,45,.10)}
        .pro-search-input{width:100%;border:0;outline:0;background:transparent;color:#211A16;font:600 14px 'DM Sans',sans-serif}
        .pro-search-input::placeholder{color:rgba(33,26,22,.42)}
        .pro-search-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(33,26,22,.15);border-radius:6px;background:transparent;color:#211A16;cursor:pointer;transition:.16s ease}
        .pro-search-close:hover{border-color:#C7352D;color:#C7352D}
        .pro-search-meta{padding:15px 20px 8px;font:700 9px 'DM Sans',sans-serif;text-transform:uppercase;letter-spacing:.18em;color:rgba(33,26,22,.48)}
        .pro-search-results{max-height:min(58vh,520px);overflow:auto;padding:0 12px 14px}
        .pro-search-result{display:flex;align-items:center;gap:14px;width:100%;padding:13px 10px;border-radius:8px;text-align:left;background:transparent;border:0;cursor:pointer;color:#211A16;transition:background 150ms ease}
        .pro-search-result:hover,.pro-search-result:focus-visible{background:#EDE4D8;outline:none}
        .pro-search-icon{display:flex;align-items:center;justify-content:center;flex:0 0 42px;width:42px;height:42px;border-radius:6px;background:#211A16;color:#E5A93A;overflow:hidden}.pro-search-icon img{width:100%;height:100%;object-fit:cover;display:block}
        .pro-search-result-main{min-width:0;flex:1}.pro-search-result-name{font:800 20px/1 'Barlow Condensed',sans-serif;text-transform:uppercase}.pro-search-result-desc{margin-top:5px;font:400 11px/1.5 'DM Sans',sans-serif;color:rgba(33,26,22,.52);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pro-search-result-cat{font:700 9px/1 'DM Sans',sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#C7352D}
        .pro-search-empty{padding:34px 24px 38px;text-align:center}.pro-search-empty-icon{display:flex;align-items:center;justify-content:center;margin:0 auto 15px;width:48px;height:48px;border-radius:50%;background:#211A16;color:#E5A93A}.pro-search-empty-title{font:800 27px/1 'Barlow Condensed',sans-serif;text-transform:uppercase}.pro-search-empty-copy{max-width:430px;margin:9px auto 0;font:400 12px/1.7 'DM Sans',sans-serif;color:rgba(33,26,22,.56)}
        .pro-search-hint{padding:10px 20px 15px;font:400 9px 'DM Sans',sans-serif;color:rgba(33,26,22,.38)}
        @media(max-width:640px){.pro-search-overlay{padding:18px 12px 20px;align-items:flex-start}.pro-search-head{padding:12px}.pro-search-results{max-height:65vh}.pro-search-result-name{font-size:18px}.pro-search-result-desc{white-space:normal}.pro-search-hint{display:none}}
    `;

    const init = () => {
        if (document.getElementById('proSearchOverlay')) return;

        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'proSearchOverlay';
        overlay.className = 'pro-search-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <section class="pro-search-panel" role="dialog" aria-modal="true" aria-labelledby="proSearchTitle">
                <div class="pro-search-head">
                    <div class="pro-search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass text-[#C7352D]" aria-hidden="true"></i>
                        <input id="proSearchInput" class="pro-search-input" type="search" autocomplete="off" placeholder="Search burgers, chicken, fries, drinks..." aria-label="Search PRO BUN menu">
                    </div>
                    <button id="proSearchClose" class="pro-search-close" type="button" aria-label="Close search"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div id="proSearchMeta" class="pro-search-meta">Search the PRO BUN menu</div>
                <div id="proSearchResults" class="pro-search-results"></div>
                <div class="pro-search-hint">Press Enter to open the first result · Press Esc to close</div>
            </section>
        `;
        document.body.appendChild(overlay);

        const input = document.getElementById('proSearchInput');
        const results = document.getElementById('proSearchResults');
        const meta = document.getElementById('proSearchMeta');
        const close = document.getElementById('proSearchClose');

        const render = (query = '') => {
            const clean = normalize(query);
            if (!clean) {
                meta.textContent = 'Search the PRO BUN menu';
                results.innerHTML = '<div class="pro-search-empty"><div class="pro-search-empty-icon"><img src="./assets/images/brand/pro-bun-logo.svg" alt="PRO BUN" class="h-auto w-[145px] sm:w-[165px]"></div><div class="pro-search-empty-title">What are you craving?</div><p class="pro-search-empty-copy">Search for a burger, chicken, fries, drink, dip or deal. We will take you straight to it.</p></div>';
                return;
            }

            const matches = catalog
                .map(item => ({ item, score: score(item, clean) }))
                .filter(entry => entry.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 8)
                .map(entry => entry.item);

            if (!matches.length) {
                meta.textContent = `No exact matches for “${query.trim()}”`;
                results.innerHTML = `<div class="pro-search-empty"><div class="pro-search-empty-icon"><i class="fa-solid fa-face-smile-wink"></i></div><div class="pro-search-empty-title">That craving is not on our menu yet.</div><p class="pro-search-empty-copy">You are craving <strong>“${query.trim().replace(/[<>]/g, '')}”</strong> — and we respect it. It looks like we do not have that one right now. Try a burger, chicken, fries, drink or deal instead.</p></div>`;
                return;
            }

            meta.textContent = `${matches.length} ${matches.length === 1 ? 'item' : 'items'} found`;
            results.innerHTML = matches.map(item => `
                <button class="pro-search-result" type="button" data-product-id="${item.id}">
                    <span class="pro-search-icon"><img src="${item.image || `./assets/images/products/${item.id}.jpg`}" alt="${item.name}" loading="lazy"></span>
                    <span class="pro-search-result-main">
                        <span class="pro-search-result-name">${item.name}</span>
                        <span class="pro-search-result-desc">${item.description}</span>
                    </span>
                    <span class="pro-search-result-cat">${item.category}</span>
                    <i class="fa-solid fa-arrow-right text-xs text-[#C7352D]"></i>
                </button>
            `).join('');
        };

        const open = () => {
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            input.value = '';
            render('');
            requestAnimationFrame(() => input.focus());
            document.body.style.overflow = 'hidden';
        };

        const hide = () => {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('[data-pro-search-trigger], #searchButton, #mobileSearchButton').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                open();
            });
        });

        input.addEventListener('input', () => render(input.value));
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                const first = results.querySelector('[data-product-id]');
                if (first) first.click();
            }
            if (event.key === 'Escape') hide();
        });

        results.addEventListener('click', event => {
            const button = event.target.closest('[data-product-id]');
            if (!button) return;
            window.location.href = `./product.html?id=${encodeURIComponent(button.dataset.productId)}`;
        });

        close.addEventListener('click', hide);
        overlay.addEventListener('click', event => {
            if (event.target === overlay) hide();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && overlay.classList.contains('is-open')) hide();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();