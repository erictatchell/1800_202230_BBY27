const Name = document.getElementById('name')
const amount = document.getElementById('amt')
const date = document.getElementById('date')
const contributions = document.getElementById('contributions')
const form = document.getElementById('form')


form.addEventListener('submit', (e) => {
    e.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userID = user.uid;
            console.log(userID);
            db.collection("users").doc(user.uid).collection("savings").add({
                name: Name.value,
                amount: parseFloat(amount.value),
                contributions: parseFloat(contributions.value),
                date: firebase.firestore.Timestamp.fromDate(date.valueAsDate = new Date())
            });
            form.Name.value = ''
            form.amount.value = ''
            form.date.value = ''
            form.contributions.value = ''
        };
    })
})