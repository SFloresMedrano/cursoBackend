/* let nombreUsuario = ''; */
const chatBox = document.getElementById('chat-box');
let nombreUsuario = '';

async function pushChat(user, msg) {
  try {
    const msgChat = { user, msg };
    const response = await fetch('/chat', {
      method: 'post',
      body: JSON.stringify(msgChat),
      headers: {
        'content-type': 'application/json',
      },
    }).then((result) => {
      console.log(JSON.stringify(result));
    });
  } catch (error) {}
}

async function chatMsg() {
  try {
    const url = 'http://localhost:8080/current/user';
    const data = {};
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        nombreUsuario = data.user.email;
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(JSON.stringify(error));
      });
    chatBox.addEventListener('keydown', function (e) {
      e.stopPropagation();

      if (e.key === 'Enter') {
        const msg = chatBox.value;
        chatBox.value = '';

        pushChat(nombreUsuario, msg);
        window.location.reload();
      }
    });
  } catch (error) {}
}

chatMsg();
