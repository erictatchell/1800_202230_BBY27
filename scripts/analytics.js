var currentUser;
var treeImg = document.getElementById('ernieImg');
var imgTemplate = document.getElementById('imgTemplate');
var imgCard = document.getElementById('imgCard');

// var startDate = document.getElementById('startDate').value;
// var endDate = document.getElementById('endDate').value;

var expenses;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
        console.log(userID);
        currentUser.get().then(function (doc) {
            expenses = doc.data().expenseCount;
            return expenses;
        }) 
    }
})
console.log(expenses);

var ctx = document.getElementById('expenseChart').getContext('2d');
var expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Expenses', '>:('],
        datasets: [{
            label: 'Total:',
            data: [expenses, 12],
            borderWidth: 1
        }]
    }
});

