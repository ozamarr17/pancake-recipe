const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const toTopButton = document.getElementById('toTopBtn');
const yieldInput = document.getElementById('yield');
const yieldUnitDisplay = document.getElementById('yield-unit');
const ingredientList = document.getElementById('ingredient-list');
const originalYield = parseInt(document.getElementById('original-yield').textContent, 10);
const originalServings = parseInt(document.getElementById('original-servings').textContent, 10);
const galleryLink = document.querySelector('nav ul li a[href="#gallery"]');
const nutritionList = document.getElementById('nutrition-facts');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggle.textContent = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Check for saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Toggle Light Mode';
    }
}

// Scroll to top button functionality
if (toTopButton) {
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            toTopButton.style.display = "block";
        } else {
            toTopButton.style.display = "none";
        }
    }

    toTopButton.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
}

function updateIngredients() {
    const desiredYield = parseInt(yieldInput.value, 10);
    if (isNaN(desiredYield) || desiredYield <= 0) {
        return;
    }

    const servingsDisplay = document.getElementById('original-servings');
    const yieldDisplay = document.getElementById('original-yield');
    const yieldUnitName = document.getElementById('yield-unit-name');


    if (desiredYield === 1) {
        yieldUnitName.textContent = 'pancake';
    } else {
        yieldUnitName.textContent = 'pancakes';
    }

    const multiplier = desiredYield / originalYield;
    servingsDisplay.textContent = Math.ceil(originalServings * multiplier);


    Array.from(ingredientList.children).forEach(item => {
        const originalQuantity = parseFloat(item.dataset.originalQuantity);
        const originalUnit = item.dataset.originalUnit;
        const ingredientName = item.dataset.ingredientName;
        let displayUnit = originalUnit;
        let displayText = '';
        let newQuantity = originalQuantity * multiplier;
        let displayQuantityValue;

        if (Number.isInteger(newQuantity)) {
            displayQuantityValue = newQuantity;
        } else {
            displayQuantityValue = newQuantity.toFixed(2);
        }

        if (ingredientName === "egg") {
            displayText = displayQuantityValue === 1 ? `1 egg` : `${displayQuantityValue} eggs`;
        } else {
            displayText = `${displayQuantityValue} ${displayUnit}`;
            if (displayQuantityValue !== 1 && displayUnit) {
                displayText += 's';
            }
            displayText += ` ${ingredientName}`;
        }

        item.textContent = displayText;
    });

    updateNutrition(multiplier);
}

function updateNutrition(multiplier) {
    Array.from(nutritionList.children).forEach(item => {
        const originalValue = parseFloat(item.dataset.originalValue);
        const unit = item.dataset.unit;

        if (!isNaN(originalValue)) {
            const newValue = originalValue * multiplier;
            let displayValue;

            if (Number.isInteger(newValue)) {
                displayValue = newValue;
            } else {
                displayValue = newValue.toFixed(2);
            }
            item.textContent = `${unit}: ${displayValue}${unit ? 'g' : ''}`;
        }
    });
}


if (yieldInput) {
    yieldInput.addEventListener('input', updateIngredients);
    updateIngredients();
}

if (galleryLink) {
    galleryLink.addEventListener('click', (event) => {
        event.preventDefault();
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}