const socket = io();

const queryString = location.search;
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const { name: userName, room } = params;

let users = [];

let avatar = "";
socket.emit("join-room", { userName, room });

socket.on("connect", () => {
  console.log("connect id " + socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect " + socket.id); // undefined
});

// handle show list user join room
socket.on("user-in-room", ({listUser}) => {
  let html = "";
  for (let item of listUser) {
    html += `<li>${item.userName}</li>`;
  }
  document.getElementById("room_person").innerHTML = html;
  document.getElementById("number-user").innerHTML = ` (${listUser.length})`;
  scrollEndPage();
  users = listUser;
});

// message myselt
socket.on("hello-one-user", ({user}) => {
  let message = `Xin chào ${user.userName}, Bạn vừa tham gia phòng ${room}`;
  let html = "";
  html += renderContent({
    messageName: "Tin nhắn hệ thống",
    message,
    image: null,
    renderSize: null,
  });
  document.querySelector(".message__container").innerHTML += html;
  scrollEndPage();
});

socket.on("out-room",({data}) => {
  let message = `${data.userName} vừa rời khỏi phòng`;
  let html = "";
  html += renderContent({
    messageName: "Tin nhắn hệ thống",
    message,
    image: null,
    renderSize: null,
  });
  document.querySelector(".message__container").innerHTML += html;
  scrollEndPage();
})

socket.on("send-messaage", ({ user, message }) => {
  avatar = getAvatar(findIndexUser(users,user.id));
  let html = "";
  html += renderContent({
    messageName: user.userName,
    message,
    image: avatar,
    renderSize: renderSideMessage(socket.id, user.id),
  });
  document.querySelector(".message__container").innerHTML += html;
  scrollEndPage();
});

// message everyone
socket.on("hello-all-user", (user) => {
  let message = `${user.userName} vừa tham gia phòng chat!`;
  let html = "";
  html += renderContent({
    messageName: "Tin nhắn hệ thống",
    message,
    image: null,
    renderSize: null,
  });
  document.querySelector(".message__container").innerHTML += html;
  scrollEndPage();
});

document.getElementById("form-chat").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = document.getElementById("name").value;
  socket.emit("send-message", message);
  document.getElementById("name").value = "";
  scrollEndPage();
});

// render interface chat
const renderContent = ({ messageName, message, image, renderSize }) => {
  let img =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3_tQ6mXwnt6GDC2ZJDakpa-946nvomwTUA&usqp=CAU";
  if (image) {
    img = image;
  }

  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

  let html = "";
  html = `
    <div class="message-group ${renderSize ? "right" : ""}">
          <div class="message__detail">
          <div class="img-chat">
            <img src="${img}" />
          </div>
          <div class="info-chat">
            <div class="h5 m-0 mr-2">${messageName}</div>
            ${message}
          </div>
      </div>
    </div>  
   `;
  return html;
};

const renderSideMessage = (idClient, idServer) => {
  if (idClient === idServer) {
    return true;
  }
  return false;
};

const scrollEndPage = () => {
  document.querySelector(".message__container").scrollTop =
    document.querySelector(".message__container").scrollHeight;
};

const getAvatar = (index) => {
  const listAvatar = [
    "../img/cat.jpg",
    "../img/baby.jpg",
    "../img/law.jpg",
  ];
  return listAvatar[index];
};

const findIndexUser = (listClient,idServer) => {
  let index = listClient.findIndex(item => item.id === idServer);
  if(index === -1 || index > 2) {
    return 2;
  }
  return index;
} 