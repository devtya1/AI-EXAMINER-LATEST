var firebaseConfig = {
  apiKey: "AIzaSyCLtWYNz7RJDNfwTbjiI8ReYhvYhHws-MU",
  authDomain: "ai-examiner.firebaseapp.com",
  databaseURL: "https://ai-examiner-default-rtdb.firebaseio.com",
  projectId: "ai-examiner",
  storageBucket: "ai-examiner.appspot.com",
  messagingSenderId: "1098113736044",
  appId: "1:1098113736044:web:8240db83f4bd229fbb2749"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function addUser() {
  user_name = document.getElementById("user_name").value;
  localStorage.setItem("user_name_ai", user_name);
  name_local = localStorage.getItem("user_name_ai");

  var ref = firebase.database().ref(user_name);

  ref.once("value", function (snapshot) {
    snapshot.forEach(function (fnc) {
      if (fnc.key == user_name) {
        alert("Please Fit Your Full Face In The Big Circle That Will Appear On the Screen. There will be a circle appering on your right eye on the sceen, Please align it with the center small circle within 5 seconds untill the screen colour changes to green.");
        window.location = "loading.html";
      }
      else {
        console.log("Username Not Found!");
      }
    });
  });
}