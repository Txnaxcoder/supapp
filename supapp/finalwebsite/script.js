// Replace the following configuration with your own Firebase project details
const firebaseConfig = {
    apiKey: "AIzaSyCx3-oXPaZUJkXFgJK19ybU8Qvst8SmvGE",
    authDomain: "supra-ledger.firebaseapp.com",
    databaseURL: "https://supra-ledger-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "supra-ledger",
    storageBucket: "supra-ledger.appspot.com",
    messagingSenderId: "756696464567",
    appId: "1:756696464567:web:86b6f5fa09f38ba6dba132",
    measurementId: "G-PF888BYJDX"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const addBillForm = document.getElementById('add-bill-form');

addBillForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const invoiceNumber = document.getElementById('invoice_number').value;
    const amount = parseFloat(document.getElementById('amount').value);
  

    await db.ref('bills').push({
        name,
        date,
        invoiceNumber,
        amount
    });

  
      

    addBillForm.reset();
});
