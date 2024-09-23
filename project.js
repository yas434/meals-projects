// Toggle the hamburger menu visibility
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Fetch and display categories in the hamburger menu
function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            displayCategoriesInMenu(data.categories);
            displayCategoriesOnPage(data.categories); // Display categories on the page
        })
        .catch(error => console.log('Error:', error));
}

// Display categories inside the hamburger menu
function displayCategoriesInMenu(categories) {
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = ''; // Clear previous items

    categories.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.textContent = category.strCategory;
        categoryLink.href = '#'; // Dummy link
        categoryLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            fetchMealsByCategory(category.strCategory);
            toggleMenu(); // Hide the menu after clicking a category
        });
        menuDiv.appendChild(categoryLink);
    });
}

// Display categories on the page
function displayCategoriesOnPage(categories) {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = ''; // Clear previous items

    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.dataset.category = category.strCategory;

        categoryItem.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <p>${category.strCategory}</p>
        `;

        categoryItem.addEventListener('click', function () {
            fetchMealsByCategory(this.dataset.category); // Fetch meals for selected category
            // Optionally, you could hide categories or move them if needed
        });

        categoriesContainer.appendChild(categoryItem);
    });

    // Ensure categories are positioned below other content
    document.body.appendChild(categoriesContainer);
}

// Fetch meals by selected category
function fetchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        })
        .catch(error => console.log('Error:', error));
}

// Display meals for the selected category
function displayMeals(meals) {
    const mealsContainer = document.getElementById('meals');
    const categoriesContainer = document.getElementById('categories');
    mealsContainer.innerHTML = ''; // Clear previous content

    meals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.dataset.mealId = meal.idMeal; // Store meal ID for later use

        mealItem.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3 style="color: black;">${meal.strMeal}</h3>
        `;

        mealItem.addEventListener('click', function () {
            fetchMealDetails(this.dataset.mealId); // Fetch meal details using the stored ID
        });

        mealsContainer.appendChild(mealItem);
    });

    // Ensure categories are positioned below meal items
    document.body.appendChild(categoriesContainer);
}

// Fetch meal details by meal ID
function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                displayMealDetails(data.meals[0]); // Pass the meal object to display function
            } else {
                console.log('No details found for this meal.');
            }
        })
        .catch(error => console.error('Error fetching meal details:', error));
}

// Display detailed information of the selected meal
function displayMealDetails(meal) {
    const mealDetailsContainer = document.getElementById('meal-details');
    const mealsContainer = document.getElementById('meals');
    const categoriesContainer = document.getElementById('categories');

    mealDetailsContainer.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredientsList(meal)}
        </ul>
    `;
    mealDetailsContainer.style.display = 'block'; // Show meal details

    // Clear meal items when meal details are displayed
    mealsContainer.innerHTML = '';
}

// Helper function to get ingredients list from meal object
function getIngredientsList(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
    }
    return ingredients;
}

// Initialize by fetching categories
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories(); // Fetch categories and display them on the page and in the menu
});

// Function to search recipes
function searchRecipes() {
    const query = document.getElementById('searchInput').value.trim();

    if (query === '') {
        alert('Please enter a recipe name to search.');
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.meals);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

// Function to display search results
function displaySearchResults(meals) {
    const mealsContainer = document.getElementById('meals');
    const categoriesContainer = document.getElementById('categories');

    mealsContainer.innerHTML = ''; // Clear previous search results

    if (!meals) {
        mealsContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    meals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');

        mealItem.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        `;

        mealItem.addEventListener('click', function () {
            fetchMealDetails(meal.idMeal); // Fetch meal details using the stored ID
        });

        mealsContainer.appendChild(mealItem);
    });

    // Ensure meal items and categories are positioned correctly
    document.body.appendChild(mealsContainer);
    document.body.appendChild(categoriesContainer);
}

// Attach event listener for search button
document.querySelector('.search-button').addEventListener('click', searchRecipes);
