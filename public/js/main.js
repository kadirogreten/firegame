

const socket = io('http://localhost:80?id=5f95ff2f30ebec4d74d2e92b&username=T-rex');

var users = [];

socket.on("open", (data) => {
    console.log("Connection made to the server");
});

socket.on("register", (data) => {
    var ClientID = data.id;
    var username = data.username;
    console.log(ClientID)
    console.log("Our Client's ID : (" + ClientID + ")");
    console.log("Our Client's Username : (" + username + ")");

    // document.getElementById('username').innerHTML = ClientID;
    users.push({
        'id': ClientID,
        'username': username
    });
});

socket.on("spawn", (data) => {
    //Handling all spawning all players
    //Passed Data
    var id = data.id;

    var name = string.Format("Player ({0})", id);

});

socket.on("disconnected", (data) => {
    var id = data.id;
    users.splice(id, 1);
});


var onlineUsers = document.getElementById('onlineUsers');


function userlar() {
    users.forEach(user => {
        var btn = document.createElement("BUTTON");
        btn.innerHTML = user.username; // Insert text
        document.body.appendChild(btn);

        return btn;
    })
};
