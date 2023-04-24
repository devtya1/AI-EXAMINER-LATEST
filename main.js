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

var noseY = 0;
var noseX = 0;
warning = 0;
check = "false";
var nam = "";
var user_name = "";
var ch = 0;
var vol;
var mic;
var c;
user_name = localStorage.getItem("user_name_ai");

document.getElementById("frm").style.display = "none";

function preload() {

}


function setup() {
    canvas = createCanvas(300, 300);
    camera = createCapture(VIDEO);
    console.log("Camera Permission asked!");
    camera.size(300, 300);
    camera.hide();
    camera.center();
    ai = ml5.poseNet(camera, modelLoaded);
    ai.on('pose', getPoses);

}

function getPoses(results) {
    document.getElementById("frm").style.display = "block";
    console.log(results);
    noseX = Math.floor(results[0].pose.nose.x);
    noseY = Math.floor(results[0].pose.nose.y);
    nose = "false";
    console.log("x: " + noseX);
    console.log("y: " + noseY);
    setTimeout(change, 10000);


    function change() {
        document.getElementById("body").style.backgroundColor = "lightgreen";
        if (noseX <= 160) {
            move();
        }
        if (noseX >= 178) {
            move();
        }
        if (noseY >= 161) {
            move();
        }
        if (noseY <= 143) {
            move();
        }
    }
}


function move() {
    nose = "true";
    console.log("x: " + noseX);
    console.log("y: " + noseY);
    console.log("Motion Detected!");
    document.getElementById("body").style.backgroundColor = "red";
    setTimeout(detect, 500)
}

function detect() {
    user_name = localStorage.getItem("user_name_ai");
    var ref = firebase.database().ref(user_name);

    ref.on("value", function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val().warnings == 2) {
                document.getElementById("frm").style.display = "none";
                camera.remove();
                camera.stop();
                canvas.hide();
                document.getElementById("warning").innerHTML = "As you were found cheating! Your form has been blocked!";
            }
            else {
                warning = warning + 1;
                user_name = localStorage.getItem("user_name_ai");
                ref = firebase.database().ref(user_name);
                ref.once("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        w = child.val().warnings + 1;
                        ref.child(user_name).update({
                            warnings: w
                        });
                    })
                })
            }
        }
        )
    }
    )
}


function modelLoaded() {
    console.log("Username: " + user_name);

    user_name = localStorage.getItem("user_name_ai");
    var ref = firebase.database().ref(user_name);

    ref.on("value", function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val().warnings == 2) {
                camera.remove();
                camera.stop();
                canvas.hide();
                document.getElementById("frm").style.display = "none";
                document.getElementById("warning").innerHTML = '<b>As you were found cheating, Your form has been blocked!</b>';
            }
            else {
                ref.on("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        if(child.val().completed == "true"){
                            document.getElementById("frm").style.display = "none";
                            camera.remove();
                            camera.stop();
                            canvas.hide();
                            document.getElementById("frm").style.display = "none";
                            document.getElementById("warning").innerHTML = '<b>You have already submitted this form!</b>';
                        }
                        else{
                            uname = "Welcome " + user_name + "!";
                            document.getElementById("name").innerHTML = uname;
                        }
                    });
                });
            }
        });

    });

    console.log("Model Successfully Integrated!");
}

function draw() {
    image(camera, 0, 0, 300, 300);
    fill("white");
    circle(noseX, noseY, 250);
    circle(170, 150, 250);
    fill('White');
}

function take_snapshot() {
    save("Picture.png");
}

function con() {
    if (ch == 2) {
        document.getElementById("frm").style.display = "none";
        camera.remove();
        camera.stop();
        canvas.hide();
        document.getElementById("warning").innerHTML = "As you were found cheating! Your form has been blocked!";
    }
    else {
        ch = ch + 1;
        alert("You cannot switch webpages in between!");
    }
}

function cut() {
    warning = warning + 1;
    ref = firebase.database().ref(nam)
    ref.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            w = child.val().warnings + 1;
            ref.child(user_name).update({
                warnings: w
            });
        })
    })
}

function quit(){
    var response = confirm("Are you sure you want to exit?");

    if(response == true){
        document.getElementById("frm").style.display = "none";
        camera.remove();
        camera.stop();
        canvas.hide();
        c = "true";
        user_name = localStorage.getItem("user_name_ai");
        ref = firebase.database().ref(user_name)
        ref.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
        ref.child(user_name).update({
        completed: c
            });
        })
        window.location = "thanYou.html";
    })
    }
    else{
        modelLoaded();
    }
}