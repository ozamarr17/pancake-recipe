function updateIngredients() {
    const desiredYield = parseInt(yieldInput.value, 10);
    if (isNaN(desiredYield) || desiredYield <= 0) return;

    const servingsDisplay = document.getElementById('original-servings');
    const yieldUnitName = document.getElementById('yield-unit-name');

    // Formula: $$multiplier = \frac{desiredYield}{originalYield}$$
    const multiplier = desiredYield / originalYield;
    servingsDisplay.textContent = Math.ceil(originalServings * multiplier);

    if (desiredYield === 1) {
        yieldUnitName.textContent = 'pancake';
    } else {
        yieldUnitName.textContent = 'pancakes';
    }

    Array.from(ingredientList.children).forEach(item => {
        const originalQuantity = parseFloat(item.dataset.originalQuantity);
        const originalUnit = item.dataset.originalUnit;
        const ingredientName = item.dataset.ingredientName;
        
        let newQuantity = originalQuantity * multiplier;
        let displayQuantityValue = Number.isInteger(newQuantity) ? newQuantity : newQuantity.toFixed(2);

        // Fix: Use the numeric newQuantity for the comparison
        if (ingredientName === "egg") {
            item.textContent = newQuantity === 1 ? `1 egg` : `${displayQuantityValue} eggs`;
        } else {
            let unitText = originalUnit;
            // Basic pluralization for units like "cup" -> "cups"
            if (newQuantity !== 1 && originalUnit) {
                unitText += 's';
            }
            item.textContent = `${displayQuantityValue} ${unitText} ${ingredientName}`;
        }
    });

    updateNutrition(multiplier);
}

function updateNutrition(multiplier) {
    Array.from(nutritionList.children).forEach(item => {
        const originalValue = parseFloat(item.dataset.originalValue);
        const unit = item.dataset.unit; // calories, fat, carbs, or protein

        if (!isNaN(originalValue)) {
            const newValue = originalValue * multiplier;
            let displayValue = Number.isInteger(newValue) ? newValue : newValue.toFixed(2);
            
            // Fix: Only add 'g' if the unit is NOT calories
            let suffix = (unit === 'calories') ? '' : 'g';
            item.textContent = `${unit.charAt(0).toUpperCase() + unit.slice(1)}: ${displayValue}${suffix}`;
        }
    });
}
