const partyNameInput = document.getElementById("party_name");
const searchButton = document.getElementById("search");
const billsTable = document.getElementById("bills-table");
const addPaymentForm = document.getElementById("add-payment-form");

let selectedBills = new Set();

searchButton.addEventListener("click", () => {
  const partyName = partyNameInput.value;

  billsTable.querySelectorAll("tbody tr").forEach((row) => row.remove());

  db.ref("bills")
    .orderByChild("name")
    .equalTo(partyName)
    .once("value", (snapshot) => {
      snapshot.forEach((billSnapshot) => {
        const bill = billSnapshot.val();
        const key = billSnapshot.key;
        let row = billsTable.insertRow(-1);

        let checkboxCell = row.insertCell(0);
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = key;
        checkbox.addEventListener("change", (e) => {
          if (e.target.checked) {
            selectedBills.add(key);
          } else {
            selectedBills.delete(key);
          }
        });
        checkboxCell.appendChild(checkbox);

        row.insertCell(1).textContent = bill.name;
        row.insertCell(2).textContent = bill.date;
        row.insertCell(3).textContent = bill.invoiceNumber;
        row.insertCell(4).textContent = bill.amount.toFixed(2);
      });
    });
});

addPaymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const paymentPerBill = amount / selectedBills.size;

  for (const billKey of selectedBills) {
    const billRef = db.ref(`bills/${billKey}`);
    const snapshot = await billRef.once("value");
    const bill = snapshot.val();

    const newPayment = {
      billKey,
      date: new Date().toISOString().split("T")[0],
      amount: paymentPerBill,
    };

    await db.ref("payments").push(newPayment);

    // Do not update the bill amount in the database
  }

  addPaymentForm.reset();
});
