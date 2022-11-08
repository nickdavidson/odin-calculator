/* TO DO 
    -Decimal rounding
    -Add +/- button
    -Backspace button
    -Keyboard support
*/

const DISPLAY_DIGIT_MAX = 10;
//const displayArray = new Array(DISPLAY_DIGIT_MAX);
const displayArray = [];
const registerArray = [];

const ADD_OP = "ADD";
const SUB_OP = "SUBTRACT";
const MULT_OP = "MULTIPLY";
const DIV_OP = "DIVIDE";

let waitingForInput = true;
let hasDecimal = false;

digitToArray("0", displayArray); //initialize calculator with a 0;

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
        if(btn.textContent==="0" && displayArray[0]==="0"){ //if the zero key is pressed while 0 is the leading digit
            if(!hasDecimal){                                //if there is no decimal after the leading zero
                waitingForInput = true;                     //do nothing and keep waiting for input
            }
            else {
                digitToArray(btn.textContent, displayArray);
            }
        }

        else {                                              //otherwise
            if(waitingForInput){                            //if waiting for input, clear the array, stop waiting
                clearArray(displayArray);
                if(btn.textContent==="."){                  //if decimal is entered before an integer, display leading zero
                    digitToArray("0", displayArray);
                }
                waitingForInput = false;
            }
            digitToArray(btn.textContent, displayArray);    //accept digit entry into array
        }
    });
});

const decimalButton = document.querySelector("#dec-btn");
decimalButton.addEventListener("click", function(){
    hasDecimal = true;
    this.disabled = true;
});

function digitToArray(digit, array){
    array.push(digit);
    updateDisplay(array);
}

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
    if(registerArray.length && lastOperand==undefined){              //if there is something in the register, and there is no final operand
        if(!waitingForInput){                                       //and not waiting for input
            let num1 = registerArray.pop();
            let num2 = arrayToNumber(displayArray);
            if(lastOperation===DIV_OP && num2==0){
                divideByZero();
            }
            else {
                let operand = operate(lastOperation, num1, num2);           //operate on register number and display number
                registerArray.push(operand);                                //put result in the register
                clearArray(displayArray);       
                digitToArray(operand, displayArray);
            }
            }
    }
    else{
        if(lastOperand!=undefined) {                           //if a final operand has been set by a call to equals
            registerArray.pop();                                //empty the register
            lastOperand = undefined;
        }
        registerArray.push(arrayToNumber(displayArray));
    }
    waitingForInput = true;
    lastOperation = this.operator;
    if(hasDecimal){
        trimZeros(displayArray);
        updateDisplay(displayArray);
        hasDecimal = false;
        decimalButton.disabled = false;
    }
    console.log(registerArray);
}
let lastOperand;

const equalsButton = document.querySelector('#eql-btn');
equalsButton.addEventListener("click", function(){
    if(lastOperand==undefined){
        lastOperand = arrayToNumber(displayArray);          //if not already set, set the operand to use on successive equals inputs
    }
    let result;
    console.log(`Register: ${registerArray}`);
    console.log(`Display: ${displayArray}`);
    console.log(`Last operation: ${lastOperation}`);
    console.log(`Last operand: ${lastOperand}`);
    if(registerArray.length && lastOperand!=undefined){
        if(lastOperation===DIV_OP && lastOperand===0){
            divideByZero();
        }
        else {
            result = operate(lastOperation, registerArray.pop(), lastOperand);        
            clearArray(displayArray);       
            digitToArray(result, displayArray);
        }
    }

    else if(lastOperation!=undefined && lastOperand!=undefined){
        if(lastOperation===DIV_OP && lastOperand===0){
            divideByZero();
        }
        else {
            result = operate(lastOperation, arrayToNumber(displayArray), lastOperand);             
            clearArray(displayArray);       
            digitToArray(result, displayArray);
        }
    }

    waitingForInput = true;
    if(hasDecimal){
        trimZeros(displayArray);
        updateDisplay(displayArray);
        hasDecimal = false;
        decimalButton.disabled = false;
    }
});

const clearButton = document.querySelector('#clear-btn');
clearButton.addEventListener("click", function(){
    clearArray(displayArray);
    clearArray(registerArray);
    lastOperation = undefined;
    lastOperand = undefined;
    digitToArray("0", displayArray);
    waitingForInput = true;
    hasDecimal = false;
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

function divideByZero(){
    clearArray(displayArray);
    clearArray(registerArray);
    lastOperation = undefined;
    lastOperand = undefined;
    const outputBox = document.querySelector("#output-area");
    outputBox.textContent = "Error - Cannot Divide By Zero";
    waitingForInput = true;
}

function trimZeros(array){
    let end = array.length-1;
    while(array[end]=="0"){
        array.pop();
        end--;
        if(array[end]=="."){
            array.pop();
        }
    }
}
