var form = document.getElementById('form');
var nameInput = document.getElementById('name');
var amountInput = document.getElementById('amt');
var contributions = document.getElementById('contributions'); 
var savingsID = localStorage.getItem('id');

function populateGoalInfo() {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      var currentUser = db.collection("users").doc(user.uid);
      currentUser.collection("savings").doc(savingsID).get().then((doc) => {
        var GoalAmount = doc.data().amount;
        var GoalName = doc.data().name;

        if(GoalAmount != null) {
          amountInput.value = GoalAmount;
        }
        if(GoalName != null) {
          nameInput.value = GoalName;
        }
        
      });
    } else {
      console.log("No user is signed in");
      window.location.href = 'login.html';
    }
  });
}
populateGoalInfo();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  firebase.auth().onAuthStateChanged((user) => {
    if(user) {
      var currentUser = db.collection('users').doc(user.uid);

      currentUser.collection('savings').doc(savingsID).get().then((doc) => {
        var SavedContributions = doc.data().contributions;
        currentUser.collection('savings').doc(savingsID).update({
          amount: amountInput.value,
          contributions: parseFloat(SavedContributions + parseFloat(contributions.value)),
          name: nameInput.value
        }).then((doc) => {
          var contributions = doc.data().contributions;
          var goalAmount = doc.data().amount;

          if (contributions == goalAmount) {
            alert('Congratulations! You achieved your savings goal!');
            currentUser.get().then((doc) => {
              var completedGoalsCount = doc.data().completedGoalsCount;
              currentUser.set({
                completedGoalsCount: completedGoalsCount + 1
              }, {merge:true});
            })
          }
        })
      });
    }
  });
  setTimeout(save, 2000);
});

function save() {
  alert("Saved!")
  window.location.href = "savingsGoal.html";
}

