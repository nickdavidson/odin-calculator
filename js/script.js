const DISPLAY_DIGIT_MAX = 10;
//const displayArray = new Array(DISPLAY_DIGIT_MAX);
const displayArray = [];
const registerArray = [];

const ADD_OP = "ADD";
const SUB_OP = "SUBTRACT";
const MULT_OP = "MULTIPLY";
const DIV_OP = "DIVIDE";

let waitingForInput = false;

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
        if(waitingForInput){
            clearArray(displayArray);
            waitingForInput = false;
        }
        digitToArray(btn.textContent, displayArray);
    });
});

function digitToArray(digit, array){
    array.push(digit);
    updateDisplay(array);
}

//Get operator buttons - store number in register and operator in register on click

const addButton = document.querySelector('#add-btn');

/******BUG - pressing + multiple times keeps adding the operand to itself *******/
addButton.addEventListener("click", function(){
    if(registerArray[0]){ //if there is something in the register
        let operand = operate(ADD_OP, registerArray.pop(), arrayToNumber(displayArray)); //operate on register number and display number
        console.log(registerArray.length)
        registerArray.push(operand);
        clearArray(displayArray);
        digitToArray(operand, displayArray);
    } else{
        registerArray.push(arrayToNumber(displayArray));
        
    }
    waitingForInput = true;
    console.log(registerArray);
});

//Equal operator takes last two numbers in register, and last operator in register, output to displayArray

function updateDisplay(array){
    const outputBox = document.querySelector("#output-area");
    outputBox.textContent = array.join('');
}

function arrayToNumber(array){
    return Number(array.join(''));
}

function clearArray(array){
    while(array.length){
        array.pop();
    }
}
