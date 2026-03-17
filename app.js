// Recipe Data
const recipes = [
    { id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy", description: "A creamy Italian pasta dish.", category: "pasta" },
    { id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium", description: "Spiced tomato curry.", category: "curry" },
    { id: 3, title: "Homemade Croissants", time: 180, difficulty: "hard", description: "Flaky French pastry.", category: "baking" },
    { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh salad with feta.", category: "salad" },
    { id: 5, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Beef wrapped in pastry.", category: "meat" },
    { id: 6, title: "Vegetable Stir Fry", time: 20, difficulty: "easy", description: "Quick veggie dish.", category: "vegetarian" },
    { id: 7, title: "Pad Thai", time: 30, difficulty: "medium", description: "Thai noodles dish.", category: "noodles" },
    { id: 8, title: "Margherita Pizza", time: 60, difficulty: "medium", description: "Classic pizza.", category: "pizza" }
];

// State
let currentFilter = "all";
let currentSort = "none";

// DOM
const recipeContainer = document.querySelector("#recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// Create Card
const createRecipeCard = (recipe) => {
    return `
    <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
            <span>⏱ ${recipe.time} min</span>
            <span class="difficulty ${recipe.difficulty}">
                ${recipe.difficulty}
            </span>
        </div>
        <p>${recipe.description}</p>
    </div>
    `;
};

// Render
const renderRecipes = (data) => {
    recipeContainer.innerHTML = data.map(createRecipeCard).join("");
};

// ---------------- FILTER FUNCTIONS ----------------
const filterByDifficulty = (recipes, type) => {
    return recipes.filter(r => r.difficulty === type);
};

const filterByTime = (recipes, maxTime) => {
    return recipes.filter(r => r.time < maxTime);
};

const applyFilter = (recipes, filter) => {
    switch (filter) {
        case "easy":
        case "medium":
        case "hard":
            return filterByDifficulty(recipes, filter);
        case "quick":
            return filterByTime(recipes, 30);
        default:
            return recipes;
    }
};

// ---------------- SORT FUNCTIONS ----------------
const sortByName = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.time - b.time
    );
};

const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);
        case "time":
            return sortByTime(recipes);
        default:
            return recipes;
    }
};

// ---------------- UPDATE DISPLAY ----------------
const updateDisplay = () => {
    let result = recipes;

    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);

    console.log(`Showing ${result.length} recipes`);
};

// ---------------- BUTTON UI ----------------
const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === currentFilter
        );
    });

    sortButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.sort === currentSort
        );
    });
};

// ---------------- EVENTS ----------------
filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        currentFilter = e.target.dataset.filter;
        updateActiveButtons();
        updateDisplay();
    });
});

sortButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        currentSort = e.target.dataset.sort;
        updateActiveButtons();
        updateDisplay();
    });
});

// ---------------- INIT ----------------
updateDisplay();
updateActiveButtons();