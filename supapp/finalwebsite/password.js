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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


document.getElementById("password-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredPassword = document.getElementById("password-input").value;

    const passwordRef = firebase.database().ref("password");
    passwordRef.once("value", (snapshot) => {
        const correctPassword = snapshot.val().toString(); // Convert the password from the database to a string
        if (enteredPassword.toString() === correctPassword) { // Convert the entered password to a string
            window.location.href = "raise.html"; // Replace "index.html" with the name of your e-ledger page
        } else {
            alert("Incorrect password. Please try again.");
        }
    });
});
