
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function insertBudget() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then((userDoc) => {
                var budget = userDoc.data().budget;
                var expenses = userDoc.data().expenseCount;
                if (budget > expenses) {
                    document.getElementById("text-budget").innerText = "Budget: " + formatter.format(expenses) + " / " + formatter.format(budget);
                } else {
                    document.getElementById("text-budget").style.color = 'rgb(255, 75, 75)';

                    document.getElementById("text-budget").innerText = "Budget: " + formatter.format(expenses) + " / " + formatter.format(budget);

                }
            })
        } else {
            console.log('No user is signed in');
        }
    });
}
insertBudget();

function showFavourite() {
    let favouritestemplate = document.getElementById("favouritestemplate");
    let favouriteCardGroup = document.getElementById("favouriteCardGroup");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;
            console.log(userID);

            currentUser.get().then(function (doc) {
                var favourites = doc.data().favourites;
                favourites.forEach(function (expenseIDs) {
                    var expenseID = expenseIDs;
                    db.collection("users").doc(user.uid).collection("expenses").doc(expenseID)
                        .get().then(function (doc) {
                            var amount = doc.data().amount;
                            var source = doc.data().source;
                            var category = doc.data().category;
                            var testFavouriteCard = favouritestemplate.content.cloneNode(true);
                            testFavouriteCard.querySelector('.card-amount').innerHTML = formatter.format(parseFloat(amount));
                            testFavouriteCard.querySelector('.card-title').innerHTML = source;
                            testFavouriteCard.querySelector('.card-category').innerHTML = category;

                            testFavouriteCard.querySelector('.card-amount').id = 'amount-' + expenseID;
                            testFavouriteCard.querySelector('.card-title').id = 'title-' + expenseID;
                            testFavouriteCard.querySelector('.card-category').id = 'category-' + expenseID;
                            testFavouriteCard.querySelector('.add').id = 'add-' + expenseID;

                            testFavouriteCard.querySelector('.add').onclick = () => addExistingFavourite(expenseID);
                            testFavouriteCard.querySelector('.edit').onclick = () => setExpenseData(expenseID);
                            testFavouriteCard.querySelector('.delete').onclick = () => deleteFavourite(expenseID);

                            favouriteCardGroup.appendChild(testFavouriteCard);
                        });
                });
            });
        } else {
            console.log("No user is signed in");
            window.location.href = 'login.html';
        }
    });
}
showFavourite();

function setExpenseData(expenseID) {
    localStorage.setItem('id', expenseID);
}

function addExistingFavourite(expenseID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var addID = 'add-' + expenseID;
            currentUser.collection("expenses").doc(expenseID).get()
                .then(function (doc) {
                    var Amount = doc.data().amount;
                    var Name = doc.data().source;
                    var Category = doc.data().category;
                    db.collection("users").doc(user.uid).get().then(function (doc) {
                        var currentExpenseCount = parseFloat(doc.data().expenseCount);
                        db.collection("users").doc(user.uid).set({
                            expenseCount: (currentExpenseCount + parseFloat(Amount)),
                        }, { merge: true })
                        .then(()=>{
                            currentUser.collection("expenses").add({
                                amount: Amount,
                                source: Name,
                                category: Category
                            })
                        });
                    });

                }).then(function () {
                    document.getElementById(addID).innerText = 'Added!';
                    setTimeout(function () { document.getElementById(addID).innerText = 'Add' }, 2000);
                });
        }
    });
}

function deleteFavourite(expenseID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            currentUser.collection("expenses").doc(expenseID).delete();
            currentUser.update({
                favourites: firebase.firestore.FieldValue.arrayRemove(expenseID)
            }).then(() => {
                alert("Deleted from Favourites!");
                window.location.href = 'expense.html';
            });

        }
    });
}