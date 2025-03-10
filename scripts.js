class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    
    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }
    
    percentage() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperandElement.classList.add('error');
                    computation = 'Error';
                    setTimeout(() => {
                        this.clear();
                        this.currentOperandElement.classList.remove('error');
                    }, 1500);
                    break;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        if (computation === 'Error') {
            this.currentOperand = computation;
        } else {
            // Round to avoid JS floating point issues
            this.currentOperand = Math.round(computation * 1000000) / 1000000 + '';
            this.previousOperand = '';
            this.operation = undefined;
        }
        
        this.shouldResetScreen = true;
    }
    
    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            let operationSymbol;
            switch (this.operation) {
                case '+':
                    operationSymbol = '+';
                    break;
                case '-':
                    operationSymbol = '−';
                    break;
                case '*':
                    operationSymbol = '×';
                    break;
                case '/':
                    operationSymbol = '÷';
                    break;
            }
            this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

// Operation buttons
document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operation'));
        calculator.updateDisplay();
    });
});

// Equals button
document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
});

// Clear button
document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
});

// Plus/Minus toggle
document.querySelector('[data-action="plusMinus"]').addEventListener('click', () => {
    calculator.toggleSign();
    calculator.updateDisplay();
});

// Percentage button
document.querySelector('[data-action="percent"]').addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.calculate();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
});