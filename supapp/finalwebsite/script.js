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


// Create a new instance of SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true; 

// Start recognition on button click
document.getElementById('voice-btn').addEventListener('click', () => {
    recognition.start();
    console.log('start')
});

// Listen for the 'result' event, which is fired when some speech has been recognized
recognition.addEventListener('result', (e) => {
    // e.results[0][0].transcript contains the recognized text
    let voiceInput = e.results[0][0].transcript;

    console.log(voiceInput)
    
    // Here, you can process the 'voiceInput' variable and save it to your Firebase database
    // For example, if you're expecting the format "name and invoiceNumber and amount and date"
    let [name, spokenDate, invoiceNumber, amount] = voiceInput.split(' and ');

    // Parse the spoken date
    let date = new Date(spokenDate);

    
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());


    let formattedDate = date.toISOString().split('T')[0];  // Convert to YYYY-MM-DD format

    console.log(name, invoiceNumber, amount, formattedDate);
    db.ref('bills').push({
        name,
        invoiceNumber,
        amount: parseFloat(amount),  // Parse amount to a float
        date: formattedDate  // Add parsed date
    });
});

