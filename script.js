const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('transaction-table-body');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const emptyState = document.getElementById('empty-state');

// Initial Data Retrieval
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// State
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction functionality
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('กรุณาระบุชื่อรายการและจำนวนเงิน');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    date: new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();

  updateLocalStorage();

  text.value = '';
  amount.value = '';
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list (Table Row)
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';
  const itemClass = transaction.amount < 0 ? 'minus-amount' : 'plus-amount';
  const dotColor = transaction.amount < 0 ? '#e74c3c' : '#2ecc71';

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>
        <span style="color: #94a3b8; font-size: 0.85em;">${transaction.date || 'วันนี้'}</span>
    </td>
    <td>
        <span class="status-dot" style="background-color: ${dotColor}"></span>
        ${transaction.text}
    </td>
    <td class="text-right ${itemClass}">
        ${sign}${formatMoney(Math.abs(transaction.amount))}
    </td>
    <td class="text-center">
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
            <i class="fas fa-trash"></i>
        </button>
    </td>
  `;

  list.appendChild(tr);
  checkEmptyState();
}

// Formatter for currency
function formatMoney(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  );

  balance.innerText = `฿${formatMoney(total)}`;
  money_plus.innerText = `+฿${formatMoney(income)}`;
  money_minus.innerText = `-฿${formatMoney(expense)}`;
  
  checkEmptyState();
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Check if list is empty to toggle empty state
function checkEmptyState() {
    if (transactions.length === 0) {
        emptyState.style.display = 'block';
        list.parentElement.style.display = 'none'; // Hide table if empty? maybe just tbody
        // actually better to show headers but hide rows.
        list.parentElement.style.display = 'table';
        if(list.children.length === 0) {
             // If really empty
             emptyState.style.display = 'block';
        } else {
             emptyState.style.display = 'none';
        }
    } else {
        emptyState.style.display = 'none';
        list.parentElement.style.display = 'table';
    }
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
