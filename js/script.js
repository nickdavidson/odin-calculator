const DISPLAY_DIGIT_MAX = 10;
//const displayArray = new Array(DISPLAY_DIGIT_MAX);
const displayArray = [8, 0, 0, 8, 5];

function operate(operator, num1, num2){
    switch(operator) {
        case 'ADD':
            return num1 + num2;
        case 'SUBTRACT':
            return num1 - num2;
        case 'MULTIPLY':
            return num1 * num2;
        case 'DIVIDE':
            return num1/num2;
        default:
            console.log('ERROR, NO SUCH OPERATOR');
    }
}

//Get digit buttons and assign values - add click listener to send value to displayArray

//Get operator buttons - store number in register and operator in register on click

//Equal operator takes last two numbers in register, and last operator in register, output to displayArray

//Add function to input value into Array

//Add function to convert array to Integer

//Add function to update display field


function updateDisplay(array){
    const outputBox = document.querySelector("#output-area");
    outputBox.textContent = array.join('');
}

//Create register array
