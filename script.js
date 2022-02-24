const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const sessionStorageTransactions = JSON.parse(
  sessionStorage.getItem('transactions')
);

let transactions =
  sessionStorage.getItem('transactions') !== null ? sessionStorageTransactions : [];

  function updateSessionStorage() {
  sessionStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(event) {
  event.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("You must enter a title and amount for this transaction");
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value
    };

        console.log(`creating new transaction...`);
        console.log(`id: ${transaction.id}`);
        console.log(`transaction type: ${transaction.text}`);
        console.log(`transaction amount: ${transaction.amount}`);
        
        transactions.push(transaction);

    addTransactionToDOM(transaction);
    updateTransactionHistory();

    updateSessionStorage();

    text.value = "";
    amount.value = "";
    
  }
}

function generateId() { 
    return Math.floor(Math.random() * 10000000);
}

/** add transaction to dom list */
function addTransactionToDOM(transaction) {
  /** display either negative or positive sign to the amount */
  const sign = transaction.amount > 0 ? "+$" : "-$";

  /** create a list item element for the transaction */
  const item = document.createElement("li");

    /** adds a class based on the value */
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  /** sets the element content to display the correct name & price */
    item.innerHTML = `
   
        <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
    })">x</button>
        ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span>
  `;

  list.appendChild(item);
}

/** updated transaction history */
function updateTransactionHistory() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);
  balance.innerText = `${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  console.log(`removing ${JSON.stringify(id)}...`);

  updateSessionStorage();
  initializeExpenseHistory();
}

function initializeExpenseHistory() {
  /** sets the transaction history list to be empty */
  list.innerHTML = "";
  transactions.forEach(addTransactionToDOM);
    updateTransactionHistory();
}

initializeExpenseHistory();

form.addEventListener("submit", addTransaction);