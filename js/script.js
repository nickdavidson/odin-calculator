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