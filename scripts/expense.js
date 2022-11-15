


function showFavourite() {
    let favouritestemplate = document.getElementById("favouritestemplate");
    let favouriteCardGroup = document.getElementById("favouriteCardGroup");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;
            console.log(userID);

            currentUser.collection("favourites")
                .limit(10)
                .get()
                .then(function (snap) {
                    var i = 1;
                    snap.forEach(function (doc) {
                        var amount = doc.data().amount;
                        var source = doc.data().source;
                        var category = doc.data().category;
                        var date = doc.data().date;
                        var testFavouriteCard = favouritestemplate.content.cloneNode(true);
                        testFavouriteCard.querySelector('.card-amount').innerHTML = "$" + amount;
                        testFavouriteCard.querySelector('.card-title').innerHTML = source;
                        testFavouriteCard.querySelector('.card-category').innerHTML = category;
                        testFavouriteCard.querySelector('.card-date').innerHTML = date;
              
                        testFavouriteCard.querySelector('.card-amount').setAttribute("id", "camount" + i);
                        testFavouriteCard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                        testFavouriteCard.querySelector('.card-category').setAttribute("id", "ccategory" + i);
                        // testFavouriteCard.querySelector('.card-date').setAttribute("id", "cdate" + i);

                        favouriteCardGroup.appendChild(testFavouriteCard);

                        document.querySelector('#add').addEventListener("click", addExistingFavourite(i));

                        i++;

                    })
                })
        }
    })
}
showFavourite();

// document.getElementById("add").addEventListener("click", addExistingFavourite);


function addExistingFavourite(i) {

    const Amount = document.querySelector('.card-amount').getAttribute("id");
    const Source = document.querySelector('.card-title').getAttribute("id");
    const Category = document.querySelector('.card-category').getAttribute("id");
    // const Date = firebase.firestore.Timestamp.fromDate(date.valueAsDate = new Date())

    console.log(Source);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;
            console.log(userID);
            currentUser.collection("expenses").add({
                source: Source,
                category: Category,
                userID: userID,
                amount: parseFloat(Amount),
                // date: Date
            })
        }
    })
}





function deleteFavourite() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;
            console.log(userID);
            currentUser.collection("favourites")
                .get()
                .delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                })
        }
    })
}