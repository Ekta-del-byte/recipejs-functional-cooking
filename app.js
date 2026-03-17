const RecipeApp = (function () {

    // ---------------- DATA ----------------
    const recipes = [
        { id:1,title:"Pizza",time:30,difficulty:"easy",ingredients:["cheese","flour"],description:"tasty pizza",steps:["make dough","bake"] },
        { id:2,title:"Pasta",time:20,difficulty:"easy",ingredients:["pasta","sauce"],description:"italian dish",steps:["boil","mix"] },
        { id:3,title:"Burger",time:25,difficulty:"medium",ingredients:["bread","patty"],description:"fast food",steps:["cook","assemble"] },
        { id:4,title:"Biryani",time:60,difficulty:"hard",ingredients:["rice","chicken"],description:"indian dish",steps:["cook","serve"] }
    ];

    // ---------------- STATE ----------------
    let currentFilter = "all";
    let currentSort = "none";
    let searchQuery = "";
    let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
    let debounceTimer;

    // ---------------- DOM ----------------
    const recipeContainer = document.getElementById("recipe-container");
    const searchInput = document.getElementById("search-input");
    const clearBtn = document.getElementById("clear-search");
    const counter = document.getElementById("recipe-count");

    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // ---------------- FUNCTIONS ----------------

    const createCard = (r) => {
        const isFav = favorites.includes(r.id);

        return `
        <div class="recipe-card">
            <h3>${r.title}</h3>
            <p>${r.description}</p>

            <span class="favorite-btn ${isFav ? "favorite":""}" data-id="${r.id}">❤️</span>

            <button data-id="${r.id}" data-type="steps">Steps</button>
            <button data-id="${r.id}" data-type="ingredients">Ingredients</button>

            <div class="steps-container" id="steps-${r.id}">
                <ul>${r.steps.map(s=>`<li>${s}</li>`).join("")}</ul>
            </div>

            <div class="ingredients-container" id="ingredients-${r.id}">
                <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
            </div>
        </div>`;
    };

    const render = (data) => {
        recipeContainer.innerHTML = data.map(createCard).join("");
        counter.textContent = `Showing ${data.length} of ${recipes.length}`;
    };

    // SEARCH
    const applySearch = (data) => {
        if (!searchQuery) return data;
        return data.filter(r =>
            r.title.toLowerCase().includes(searchQuery) ||
            r.ingredients.some(i => i.toLowerCase().includes(searchQuery))
        );
    };

    // FILTER
    const applyFilter = (data) => {
        if (currentFilter === "favorites") {
            return data.filter(r => favorites.includes(r.id));
        }
        if (currentFilter === "easy") return data.filter(r => r.difficulty==="easy");
        if (currentFilter === "medium") return data.filter(r => r.difficulty==="medium");
        if (currentFilter === "hard") return data.filter(r => r.difficulty==="hard");
        if (currentFilter === "quick") return data.filter(r => r.time < 30);
        return data;
    };

    // SORT
    const applySort = (data) => {
        const arr = [...data];
        if (currentSort === "name") return arr.sort((a,b)=>a.title.localeCompare(b.title));
        if (currentSort === "time") return arr.sort((a,b)=>a.time-b.time);
        return data;
    };

    const update = () => {
        let data = applySearch(recipes);
        data = applyFilter(data);
        data = applySort(data);
        render(data);
    };

    // FAVORITES
    const toggleFavorite = (id) => {
        id = Number(id);

        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
        } else {
            favorites.push(id);
        }

        localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
        update();
    };

    // EVENTS
    const setupEvents = () => {

        // SEARCH (DEBOUNCE)
        searchInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                searchQuery = searchInput.value.toLowerCase();
                update();
            }, 300);
        });

        // CLEAR
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            searchQuery = "";
            update();
        });

        // FILTER
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;
                update();
            });
        });

        // SORT
        sortButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentSort = btn.dataset.sort;
                update();
            });
        });

        // CARD EVENTS
        recipeContainer.addEventListener("click", (e) => {

            // TOGGLE FAVORITE
            if (e.target.classList.contains("favorite-btn")) {
                toggleFavorite(e.target.dataset.id);
            }

            // TOGGLE STEPS / INGREDIENTS
            if (e.target.dataset.type) {
                const box = document.getElementById(`${e.target.dataset.type}-${e.target.dataset.id}`);
                box.classList.toggle("visible");
            }
        });
    };

    // INIT
    const init = () => {
        setupEvents();
        update();
        console.log("App Ready 🚀");
    };

    return { init };

})();

RecipeApp.init();