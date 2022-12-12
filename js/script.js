/* TO DO 
    -Add operation readouts and history
*/

const DISPLAY_DIGIT_MAX = 16;
//const displayArray = new Array(DISPLAY_DIGIT_MAX);
const displayArray = [];
const registerArray = [];

const ADD_OP = "ADD";
const SUB_OP = "SUBTRACT";
const MULT_OP = "MULTIPLY";
const DIV_OP = "DIVIDE";

let waitingForInput = true;
let hasDecimal = false;
let isNegative = false;
let inputDisabled = false;

digitToArray("0", displayArray); //initialize calculator with a 0;

function operate(operator, num1, num2){
    let result;

    switch(operator) {
        case 'ADD':
            result = num1 + num2;
            break;
        case 'SUBTRACT':
            result = num1 - num2;
            break;
        case 'MULTIPLY':
            result = num1 * num2;
            break;
        case 'DIVIDE':
            result = num1/num2;
            break;
        default:
            console.log('ERROR, NO SUCH OPERATOR');
    }

    let DECIMAL_DIGIT_MAX = DISPLAY_DIGIT_MAX - getNumberOfDigits(result);
    let resultStr = (result.toFixed(DECIMAL_DIGIT_MAX)).toString();

    while(resultStr.charAt(resultStr.length-1)=="0"){
        resultStr = resultStr.slice(0, -1);
        console.log("hit" + " " + resultStr);
    }

    return Number(resultStr);

}

function getNumberOfDigits(number) {
    let numberStr = number.toString();
    if(numberStr){
        leftDigits = numberStr.split('.');
        if(leftDigits && leftDigits.length == 2){
            return leftDigits[0].length;
        }
        else{
            return 0;
        }
    }
}


const digitButtons = document.querySelectorAll(".digit-btn");

digitButtons.forEach(function(btn) {
    btn.addEventListener("click", function(){
        digitInputEvent(btn.textContent);
    });
});

function digitInputEvent(digitString){
    if(digitString==="0" && displayArray[0]==="0"){ //if the zero key is pressed while 0 is the leading digit
        if(!hasDecimal){                                //if there is no decimal after the leading zero
            waitingForInput = true;                     //do nothing and keep waiting for input
        }
        else {
            digitToArray(digitString, displayArray);
        }
    }

    else {                                              //otherwise
        if(waitingForInput){                            //if waiting for input, clear the array, stop waiting
            clearArray(displayArray);
            if(digitString==="."){                  //if decimal is entered before an integer, display leading zero
                digitToArray("0", displayArray);
            }
            waitingForInput = false;
        }
        digitToArray(digitString, displayArray);    //accept digit entry into array
    }
    console.log(displayArray);
}

const decimalButton = document.querySelector("#dec-btn");
decimalButton.addEventListener("click", function(){
    hasDecimal = true;
    this.disabled = true;
});

function digitToArray(digit, array){
    array.push(digit);
    if(array.length==DISPLAY_DIGIT_MAX){
        toggleInput();
    }
    updateDisplay(array);
}

let lastOperation;

const addButton = document.querySelector('#add-btn');
addButton.operator = ADD_OP;
addButton.addEventListener("click", function(){
    operationEvent(this.operator);
});

const subtractButton = document.querySelector('#sub-btn');
subtractButton.operator = SUB_OP;
subtractButton.addEventListener("click", function(){
    operationEvent(this.operator);
});

const multiplyButton = document.querySelector('#multi-btn');
multiplyButton.operator = MULT_OP;
multiplyButton.addEventListener("click", function(){
    operationEvent(this.operator);
});

const divideButton = document.querySelector('#div-btn');
divideButton.operator = DIV_OP;
divideButton.addEventListener("click", function(){
    operationEvent(this.operator);
});

function operationEvent(operator){
    console.log(`${operator}`);
    if(inputDisabled){
        toggleInput();
        console.log("toggle input");
        inputDisabled = false;
    }

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
    lastOperation = operator;
    
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
    equalsEvent();
});

const clearButton = document.querySelector('#clear-btn');
clearButton.addEventListener("click", function(){
    if(inputDisabled){
        toggleInput();
        console.log("toggle input");
        inputDisabled = false;
    }
    clearArray(displayArray);
    clearArray(registerArray);
    lastOperation = undefined;
    lastOperand = undefined;
    digitToArray("0", displayArray);
    waitingForInput = true;
    hasDecimal = false;
    decimalButton.disabled = false;
    updateDisplay(displayArray);
});

const backspaceButton = document.querySelector('#backspace-btn');
backspaceButton.addEventListener("click", function(){
    backspaceEvent();
});

const positivityButton = document.querySelector('#positivity-btn');
positivityButton.addEventListener("click", function(){
    if(!waitingForInput){
        togglePositivity(displayArray);
        updateDisplay(displayArray);
    }
});

function backspaceEvent() {
    console.log("backspace");
    if(inputDisabled){
        toggleInput();
        console.log("toggle input");
        inputDisabled = false;
    }

    if (!waitingForInput) {
        let displayDigit;
        if (displayArray.length > 1) {
            displayDigit = displayArray.pop();
            if(displayDigit == "."){
                hasDecimal = false;
                decimalButton.disabled = false;
            }
        } else if (displayArray.length == 1) {
            displayArray[0] = "0";
            waitingForInput = true;
        }
        updateDisplay(displayArray);
    }
}

function equalsEvent() {
    if(inputDisabled){
        toggleInput();
    }
    if (lastOperand == undefined) {
        lastOperand = arrayToNumber(displayArray); //if not already set, set the operand to use on successive equals inputs
    }
    let result;
    console.log(`Register: ${registerArray}`);
    console.log(`Display: ${displayArray}`);
    console.log(`Last operation: ${lastOperation}`);
    console.log(`Last operand: ${lastOperand}`);
    if (registerArray.length && lastOperand != undefined) {
        if (lastOperation === DIV_OP && lastOperand === 0) {
            divideByZero();
        }
        else {
            result = operate(lastOperation, registerArray.pop(), lastOperand);
            clearArray(displayArray);
            digitToArray(result, displayArray);
        }
    }

    else if (lastOperation != undefined && lastOperand != undefined) {
        if (lastOperation === DIV_OP && lastOperand === 0) {
            divideByZero();
        }
        else {
            result = operate(lastOperation, arrayToNumber(displayArray), lastOperand);
            clearArray(displayArray);
            digitToArray(result, displayArray);
        }
    }

    waitingForInput = true;
    if (hasDecimal) {
        trimZeros(displayArray);
        updateDisplay(displayArray);
        hasDecimal = false;
        decimalButton.disabled = false;
    }
}

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

function togglePositivity(array){
    if(array[0]==="-"){
        array.shift();
    }
    else{
        array.unshift("-");
    }
}

document.addEventListener('keydown', function(event){
    event.preventDefault();
    console.log(`Key: ${event.key} Type: ${typeof(event.key)}`);
    let digitKeys = new RegExp("^[0-9]");
    
    if(!inputDisabled){
        if(event.key.match(digitKeys)){
            digitInputEvent(event.key);
        }
    
        if(event.key=="."){
            if(!hasDecimal){
                digitInputEvent(event.key);
                hasDecimal = true;
                decimalButton.disabled = true;
            }
        }
    }

    if(event.key=="+"){
        operationEvent(ADD_OP);
    }
    if(event.key=="-"){
        operationEvent(SUB_OP);
    }
    if(event.key=="*"){
        operationEvent(MULT_OP);
    }
    if(event.key=="/"){
        operationEvent(DIV_OP);
    }

    if(event.key=="Enter" || event.key=="="){
        equalsEvent();
    }

    if(event.key=="Backspace"){
        backspaceEvent();
    }
});

function toggleInput() {
    let buttons = document.querySelectorAll(".digit-btn");

    if(inputDisabled){
        buttons.forEach(function(btn) {
                btn.disabled = false;
                if(hasDecimal && btn.textContent=="."){
                    btn.disabled = true;
                }
                inputDisabled = false;
            });
    } else if(!inputDisabled) {
        buttons.forEach(function(btn) {
                btn.disabled = true;
                inputDisabled = true;
        });
    }
    
    

}