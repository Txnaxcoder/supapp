

  db.ref("bills")
  .orderByChild("name")
  .on("child_added", async (billSnapshot) => {
    const billKey = billSnapshot.key;
    const bill = billSnapshot.val();
    const billsTable = document.getElementById('bills-table');
    let row = billsTable.insertRow(-1);
    row.insertCell(0).textContent = bill.name;
    row.insertCell(1).textContent = bill.date;
    row.insertCell(2).textContent = bill.invoiceNumber;
    row.insertCell(3).textContent = bill.amount.toFixed(2);

    const paymentsCell = row.insertCell(4);
    const amountDueCell = row.insertCell(5);

    // Get payments for the current bill
    const paymentSnapshots = await db
      .ref("payments")
      .orderByChild("billKey")
      .equalTo(billKey)
      .once("value");

    let totalPayments = 0;
    paymentSnapshots.forEach((paymentSnapshot) => {
      totalPayments += paymentSnapshot.val().amount;
    });

    paymentsCell.textContent = totalPayments.toFixed(2);
    amountDueCell.textContent = (bill.amount - totalPayments).toFixed(2);
  });


  function filterTable() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    table = document.getElementById("bills-table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]; // Adjust the index to search in another column. 0 means the search will take place in the first column
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

document.getElementById('search-bar').addEventListener('keyup', filterTable);
