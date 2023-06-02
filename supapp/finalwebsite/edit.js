// Initialize Firebase
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
    
    // Retrieve the bills from your Firebase database
    db.ref('bills').on('value', async  (snapshot) => {
        let bills = snapshot.val();
    let billsTableBody = document.getElementById('bills-table').getElementsByTagName('tbody')[0];

    // Clear table
    billsTableBody.innerHTML = '';

    // Add each bill to the table
    for (let billKey in bills) {
        let bill = bills[billKey];
        let newRow = billsTableBody.insertRow();

        newRow.insertCell().innerText = bill.name;
        newRow.insertCell().innerText = bill.date;
        newRow.insertCell().innerText = bill.invoiceNumber;
        newRow.insertCell().innerText = bill.amount;

        // Fetch payments for this bill and fill in total payment
        let paymentsSnapshot = await db.ref('payments').orderByChild('billKey').equalTo(billKey).once('value');
        let totalPayment = 0;
        paymentsSnapshot.forEach(paymentSnapshot => {
            totalPayment += paymentSnapshot.val().amount;
        });
        newRow.insertCell().innerText = totalPayment; // display total payment in the table

        // Calculate amount due as initial amount due minus total payments
        let amountDue = bill.amount - totalPayment;
        newRow.insertCell().innerText = amountDue; // display amount due in the table

        // Add edit button to each row
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';
    
            // ... inside the loop in db.ref('bills').on('value', (snapshot) => {...
editButton.onclick = async function() {
    // Show the edit form
    document.getElementById('edit-bill-form-container').style.display = 'block';

    // Fill the edit form with the existing bill details
    document.getElementById('edit-name').value = bill.name;
    document.getElementById('edit-date').value = bill.date;
    document.getElementById('edit-invoice-number').value = bill.invoiceNumber;
    document.getElementById('edit-amount').value = bill.amount;
    
    // Fetch payments for this bill and fill in total payment
    let paymentsSnapshot = await db.ref('payments').orderByChild('billKey').equalTo(billKey).once('value');
    let totalPayment = 0;
    paymentsSnapshot.forEach(paymentSnapshot => {
        totalPayment += paymentSnapshot.val().amount;
    });
    document.getElementById('edit-payments').value = totalPayment;
    
    document.getElementById('edit-amount-due').value = bill.amountDue;
    document.getElementById('edit-bill-key').value = billKey;
};

    
            newRow.appendChild(editButton);
        }
    });
    

  

    document.getElementById('edit-bill-form').addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Get the bill details from the edit form
        const name = document.getElementById('edit-name').value;
        const date = document.getElementById('edit-date').value;
        const invoiceNumber = document.getElementById('edit-invoice-number').value;
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const payments = document.getElementById('edit-payments').value;
        const amountDue = document.getElementById('edit-amount-due').value;
        const billKey = document.getElementById('edit-bill-key').value;
    
        // Update the bill in your Firebase database
        console.log(`Updating bill ${billKey} with values: name=${name}, date=${date}, invoiceNumber=${invoiceNumber}, amount=${amount}, payments=${payments}, amountDue=${amountDue}`);

        db.ref('bills/' + billKey).set({
            name,
            date,
            invoiceNumber,
            amount,   // check if this is correctly updated
            payments, // check if this is correctly updated
            amountDue // check if this is correctly updated
        });
    
        // Hide the edit form
        document.getElementById('edit-bill-form-container').style.display = 'none';
    });
    