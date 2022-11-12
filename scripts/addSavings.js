function addSavings() {
    console.log("in");
    let Name = document.getElementById("name").value;
    let SavingsAmount = document.getElementById("savingsAmount").value;
    let Date = document.getElementById("date").value;
    let Contributions = document.getElementById("contributions").value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;
            console.log(userID);
            currentUser.collection("savings").add({
                name: Name,
                userID: userID,
                amount: SavingsAmount,
                date: Date,
                contributions: Contributions
            }).then(() => {
                window.location.href = "savingsGoal.html"; //new line added
            })
        };
    });
}

