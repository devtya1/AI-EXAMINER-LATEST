function load(){
    t = setTimeout(change, 6000);
}

function change(){
    clearTimeout(t);
    window.location = "main.html";
}