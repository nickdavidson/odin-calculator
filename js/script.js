const DISPLAY_DIGIT_MAX = 10;
//const displayArray = new Array(DISPLAY_DIGIT_MAX);
const displayArray = [];

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

const digitButtons = document.querySelectorAll(".digit-btn");

digitButtons.forEach(function(btn) {
    btn.addEventListener("click", function(){
        digitToArray(btn.textContent, displayArray);
    });
});

function digitToArray(digit, array){
    array.push(digit);
    updateDisplay(array);
}

//Get operator buttons - store number in register and operator in register on click

//Equal operator takes last two numbers in register, and last operator in register, output to displayArray

function updateDisplay(array){
    const outputBox = document.querySelector("#output-area");
    outputBox.textContent = array.join('');
}

function arrayToNumber(array){
    return Number(array.join(''));
}

//Create register array
