let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equals-btn');
const clearButton = document.getElementById('clear-btn');
const deleteButton = document.getElementById('delete-btn');
const decimalButton = document.getElementById('decimal-btn');
const previousOperandText = document.getElementById('previous-operand');
const currentOperandText = document.getElementById('current-operand');

// Event Listeners
numberButtons.forEach((button) =>
  button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach((button) =>
  button.addEventListener('click', () => setOperation(button.dataset.operator))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
decimalButton.addEventListener('click', appendDecimal);
window.addEventListener('keydown', handleKeyboardInput);

// Display & Input Logic
function appendNumber(number) {
  if (currentOperandText.textContent === '0' || shouldResetScreen) {
    resetScreen();
  }
  currentOperandText.textContent += number;
}

function resetScreen() {
  currentOperandText.textContent = '';
  shouldResetScreen = false;
}

function clear() {
  currentOperandText.textContent = '0';
  previousOperandText.textContent = '';
  firstOperand = '';
  secondOperand = '';
  currentOperation = null;
}

function appendDecimal() {
  if (shouldResetScreen) resetScreen();
  if (currentOperandText.textContent === '') {
    currentOperandText.textContent = '0';
  }
  if (currentOperandText.textContent.includes('.')) return;
  currentOperandText.textContent += '.';
}

function deleteNumber() {
  if (shouldResetScreen) return;
  currentOperandText.textContent = currentOperandText.textContent
    .toString()
    .slice(0, -1);
  if (currentOperandText.textContent === '') {
    currentOperandText.textContent = '0';
  }
}

function setOperation(operator) {
  if (currentOperation !== null) evaluate();
  firstOperand = currentOperandText.textContent;
  currentOperation = operator;
  previousOperandText.textContent = `${firstOperand} ${formatOperator(operator)}`;
  shouldResetScreen = true;
}

function evaluate() {
  if (currentOperation === null || shouldResetScreen) return;
  if (currentOperation === '/' && currentOperandText.textContent === '0') {
    alert("Nice try! You can't divide by 0.");
    clear();
    return;
  }

  secondOperand = currentOperandText.textContent;
  const result = roundResult(
    operate(currentOperation, firstOperand, secondOperand)
  );
  currentOperandText.textContent = result;
  previousOperandText.textContent = `${firstOperand} ${formatOperator(currentOperation)} ${secondOperand} =`;
  currentOperation = null;
  shouldResetScreen = true;
}

function roundResult(number) {
  return Math.round(number * 100000000) / 100000000;
}

function formatOperator(operator) {
  if (operator === '/') return '÷';
  if (operator === '*') return '×';
  if (operator === '-') return '−';
  return '+';
}

// Keyboard Support
function handleKeyboardInput(e) {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendDecimal();
  if (e.key === '=' || e.key === 'Enter') {
    e.preventDefault();
    evaluate();
  }
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clear();
  if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key);
}

// Core Math Functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}
