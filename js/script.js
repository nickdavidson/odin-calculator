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
            if(num2!=0){
                return num1/num2;
            }
            else{
                return "Err - cannot divide by zero"
            }
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

let lastOperation;

const addButton = document.querySelector('#add-btn');
addButton.operator = ADD_OP;
addButton.addEventListener("click", operationEvent);

const subtractButton = document.querySelector('#sub-btn');
subtractButton.operator = SUB_OP;
subtractButton.addEventListener("click", operationEvent);

const multiplyButton = document.querySelector('#multi-btn');
multiplyButton.operator = MULT_OP;
multiplyButton.addEventListener("click", operationEvent);

const divideButton = document.querySelector('#div-btn');
divideButton.operator = DIV_OP;
divideButton.addEventListener("click", operationEvent);

function operationEvent(){
    if(registerArray[0] && !lastOperand){                               //if there is something in the register, and there is no final operand
        if(!waitingForInput){                                           //and not waiting for input
            let operand = operate(lastOperation, registerArray.pop(), arrayToNumber(displayArray)); //operate on register number and display number
            registerArray.push(operand);                                //put result in the register
            clearArray(displayArray);       
            digitToArray(operand, displayArray);
        }
    }
    else{
        if(lastOperand) {                           //if a final operand has been set by a call to equals
            registerArray.pop();                    //empty the register
            lastOperand = null;
        }
        registerArray.push(arrayToNumber(displayArray));
    }
    waitingForInput = true;
    lastOperation = this.operator;
    console.log(registerArray);
}

//Equal operator takes last two numbers in register, and last operator in register, output to displayArray
let lastOperand;

const equalsButton = document.querySelector('#eql-btn');
equalsButton.addEventListener("click", function(){
    if(!lastOperand){
        lastOperand = arrayToNumber(displayArray);          //if not already set, set the operand to use on successive equals inputs
    }
    let result = operate(lastOperation, registerArray.pop(), lastOperand);
    registerArray.push(result);                
    clearArray(displayArray);       
    digitToArray(result, displayArray);
    console.log(registerArray);
});

const clearButton = document.querySelector('#clear-btn');
clearButton.addEventListener("click", function(){
    clearArray(displayArray);
    clearArray(registerArray);
    lastOperation = null;
    lastOperand = null;
    updateDisplay(displayArray);
});

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
