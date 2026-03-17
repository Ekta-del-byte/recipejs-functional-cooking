// IIFE START
const RecipeApp = (function () {

    console.log("RecipeApp initializing...");

    // ---------------- DATA ----------------
    const recipes = [
        {
            id: 1,
            title: "Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy pasta",
            category: "pasta",
            ingredients: ["Pasta", "Eggs", "Cheese", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Beat eggs",
                        "Add cheese",
                        {
                            text: "Mix spices",
                            substeps: ["Add pepper", "Stir well"]
                        }
                    ]
                },
                "Combine and serve"
            ]
        },
        {
            id: 2,
            title: "Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spicy curry",
            category: "curry",
            ingredients: ["Chicken", "Tomato", "Cream"],
            steps: ["Cook chicken", "Prepare gravy", "Mix & cook"]
        },
        {
            id: 3,
            title: "Croissants",
            time: 180,
            difficulty: "hard",
            description: "French pastry",
            category: "baking",
            ingredients: ["Flour", "Butter", "Milk"],
            steps: ["Prepare dough", "Layer butter", "Bake"]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Healthy salad",
            category: "salad",
            ingredients: ["Tomato", "Cucumber", "Feta"],
            steps: ["Chop veggies", "Mix", "Serve"]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Premium dish",
            category: "meat",
            ingredients: ["Beef", "Mushroom", "Pastry"],
            steps: ["Prepare beef", "Wrap", "Bake"]
        },
        {
            id: 6,
            title: "Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Quick veggies",
            category: "veg",
            ingredients: ["Vegetables", "Sauce"],
            steps: ["Chop", "Cook", "Serve"]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Thai noodles",
            category: "noodles",
            ingredients: ["Noodles", "Peanuts"],
            steps: ["Cook noodles", "Mix sauce", "Serve"]
        },
        {
            id: 8,
            title: "Pizza",
            time: 60,
            difficulty: "medium",
            description: "Classic pizza",
            category: "pizza",
            ingredients: ["Dough", "Cheese", "Tomato"],
            steps: ["Prepare dough", "Add toppings", "Bake"]
        }
    ];

    // ---------------- STATE ----------------
    let currentFilter = "all";
    let currentSort = "none";

    // ---------------- DOM ----------------
    const recipeContainer = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // ---------------- RECURSION ----------------
    const renderSteps = (steps, level = 0) => {
        let html = "<ul>";
        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li>${step}</li>`;
            } else {
                html += `<li>${step.text}`;
                html += `<div class="nested">${renderSteps(step.substeps, level + 1)}</div>`;
                html += `</li>`;
            }
        });
        html += "</ul>";
        return html;
    };

    // ---------------- CARD ----------------
    const createRecipeCard = (recipe) => {
        return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
                Show Steps
            </button>

            <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
                Show Ingredients
            </button>

            <div class="steps-container" id="steps-${recipe.id}">
                ${renderSteps(recipe.steps)}
            </div>

            <div class="ingredients-container" id="ingredients-${recipe.id}">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
            </div>
        </div>
        `;
    };

    const renderRecipes = (data) => {
        recipeContainer.innerHTML = data.map(createRecipeCard).join("");
    };

    // ---------------- FILTER ----------------
    const applyFilter = (data, filter) => {
        if (filter === "easy") return data.filter(r => r.difficulty === "easy");
        if (filter === "medium") return data.filter(r => r.difficulty === "medium");
        if (filter === "hard") return data.filter(r => r.difficulty === "hard");
        if (filter === "quick") return data.filter(r => r.time < 30);
        return data;
    };

    // ---------------- SORT ----------------
    const applySort = (data, sort) => {
        const copy = [...data];
        if (sort === "name") return copy.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "time") return copy.sort((a, b) => a.time - b.time);
        return data;
    };

    // ---------------- UPDATE ----------------
    const updateDisplay = () => {
        let result = applyFilter(recipes, currentFilter);
        result = applySort(result, currentSort);
        renderRecipes(result);
    };

    // ---------------- BUTTON STATES ----------------
    const updateActiveButtons = () => {
        filterButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === currentFilter);
        });

        sortButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.sort === currentSort);
        });
    };

    // ---------------- EVENTS ----------------
    const handleToggle = (e) => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        const container = document.getElementById(`${type}-${id}`);
        container.classList.toggle("visible");

        e.target.textContent =
            container.classList.contains("visible")
                ? `Hide ${type}`
                : `Show ${type}`;
    };

    const setupEvents = () => {

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

        // Event Delegation
        recipeContainer.addEventListener("click", handleToggle);
    };

    // ---------------- INIT ----------------
    const init = () => {
        setupEvents();
        updateDisplay();
        updateActiveButtons();
        console.log("RecipeApp ready!");
    };

    return { init };

})();

// RUN
RecipeApp.init();