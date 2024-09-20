
const display = document.getElementById('calculator__display');
const calculator=document.querySelector('.calculator__buttons');
let newCalculate=false;
calculator.addEventListener('click',function(event){
    const { target }=event;
    if(target.classList.contains('button')) {
        appendToDisplay(event.target.innerText);
    }
    else if(target.id ==='clear'){
        clearDisplay();
    }
    else if(target.id === 'calculate' && !newCalculate){
        calculate();
    }
    else if(target.id === 'delete'){
        if(newCalculate)
            clearDisplay();
        else
        removeLastEnteredValue();
    }
});

document.addEventListener('keydown', handleKeyboardInput);
function handleKeyboardInput(event) {
    const key = event.key;
    if (key === 'Enter' && !newCalculate) { 
        calculate();
    } else if (key === 'Backspace') {
        if(newCalculate)
            clearDisplay();
        else
        removeLastEnteredValue();
    } else if ('0123456789+-*/()'.includes(key)) {
        appendToDisplay(key);
    }
}

function clearDisplay() {
    display.value = '';
}
let invalid=0;
function appendToDisplay(value) {
    if(newCalculate){
        display.value='';
        newCalculate=false;
    }
    const operators = '+-*/';
    if(operators.includes(value))
     invalid=1;
    else
    invalid=0;

    const lastChar = display.value.slice(-1);
    if (operators.includes(lastChar) && operators.includes(value)){
            if(value==='-' && '*/'.includes(lastChar))
                display.value += value; 
            else
                display.value = display.value.slice(0, -1)+value; 
    } 
    else
    display.value += value;
}
function removeLastEnteredValue(){
    display.value = display.value.slice(0, -1);
}
function infixToPostfix(input){
    const expression=input.match(/\d+|[\+\*\/\(\)\-]/g); 
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '$': 3
    };
    const output = [];
    const operators = [];
    let previousChar='(';
    for (let char of expression) {
        if (/\d/.test(char)) {
            output.push(char);
        } 
        else if (char in precedence) {
            if (char === '-' && (previousChar === '(' || '*/'.includes(previousChar))) {
                operators.push('$');
            }
            else{
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[char]) {
                output.push(operators.pop());
            }
            operators.push(char);
        } 
        previousChar=char;      
        }
        else{
            if(char === '(' ){
                if(/\d/.test(previousChar))
                operators.push('*');
                operators.push(char); 
            }
            else if(char ===')'){
                let op=operators.pop();
                while(op !=='('){
                    output.push(op);
                   if(operators.length===0 && op!=='(') throw new Error("Mismatched Paranthesis");
                    op=operators.pop();
                }
            }
        }
        previousChar=char;
    }
    while(operators.length){
            let op = operators.pop();
            if (op === '(') throw new Error("Mismatched parenthesis");
            output.push(op);
    }
    return output;

}
function evaluatePostfix(postfix){
    
    const result=[];
    for(let char of postfix){
        if(/\d/.test(char)){
            result.push(Number(char));
        }
        else if (char === '$') {
            let n = result.pop();
            result.push(-n);
        }
        else{
            if(result.length <= 1) throw new Error("Invalid input");
           let b=result.pop();
           let a=result.pop();
           let c;
           switch(char){
            case '+':
                c=a+b;
                break;
            case '-':
                c=a-b;
                break;
            case '*':
                c=a*b;
                break;
            case '/':
                if(b===0){
                  throw new Error("ZeroDivisionError");
                }
                else{
                c=a/b;
                }
                break;
           }
           result.push(Number(c));
        } 
    }
   return result[0];
}

function calculate(){
    try{
    if(invalid) throw new Error("Incomplete Expression");
    const input=display.value;
    const postfix=infixToPostfix(input);
    const result=evaluatePostfix(postfix);
    display.value+='='+'\n'+result;
    newCalculate=true;
    }
    catch(error){
        alert(error.message);
        newCalculate=true;
    }

}