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
const sendRemindersBtn = document.getElementById("send-reminders-btn");

const sendReminderEmails = async () => {
    const snapshot = await db.ref('emails').once('value');
    const emails = snapshot.val();

    const billsSnapshot = await db.ref('bills').once('value');
    const bills = billsSnapshot.val();

    // Retrieve the payments data
    const paymentsSnapshot = await db.ref('payments').once('value');
    const payments = paymentsSnapshot.val();

    for (const companyName in emails) {
        const companyEmail = emails[companyName];
        const companyBills = [];
        const companyPayments = [];

        for (const billId in bills) {
            const bill = bills[billId];
            if (bill.name === companyName) {
                companyBills.push(bill);
            }
        }

        // Iterate through payments and add to companyPayments if they match the companyName
        for (const paymentId in payments) {
            const payment = payments[paymentId];
            const paymentBill = bills[payment.billKey];
            if (paymentBill && paymentBill.name === companyName) {
                companyPayments.push(payment);
            }
        }
        const sendEmail = async (recipient, subject, body) => {
          const apiKey = '20FA158821470507389F1B6F9A01C074475CB7697001728AA51362DFD01C4D6CA472ADF2E597DBAD1263458B796EE412'; // Replace with your Elastic Email API Key
          const fromEmail = 'tanmaychandra10@gmail.com'; // Replace with your email address
        
          const data = new FormData();
          data.append('apikey', apiKey);
          data.append('subject', subject);
          data.append('from', fromEmail);
          data.append('to', recipient);
          data.append('bodyText', body);
        
          try {
            const response = await fetch('https://api.elasticemail.com/v2/email/send', {
              method: 'POST',
              body: data
            });
        
            const result = await response.json();
            console.log(`Email sent to ${recipient}:`, result);
          } catch (error) {
            console.error(`Error sending email to ${recipient}:`, error);
          }
        };
        if (companyBills.length > 0) {
            let totalAmount = 0;
            companyBills.forEach(bill => {
                totalAmount += bill.amount;
            });

            // Subtract payments from the total bill amount
            companyPayments.forEach(payment => {
                totalAmount -= payment.amount;
            });

            if (totalAmount > 0) {  // Only send reminders if there is a remaining amount to be paid
                const subject = `Bill Reminder for ${companyName}`;
                const message = `Dear ${companyName},\n\nThis is a reminder for your outstanding bills with a remaining amount of ${totalAmount.toFixed(2)}.\n\nPlease make the payment at your earliest convenience.\n\nThank you.`;

                await sendEmail(companyEmail, subject, message);
            }
        }
    }
};


sendRemindersBtn.addEventListener("click", sendReminderEmails);
