let nombreUsuario = '';
const chatBox = document.getElementById('chat-box');

async function pushChat(user, msg) {
  try {
    const msgChat = { user, msg };
    fetch('/chat', {
      method: 'post',
      body: JSON.stringify(msgChat),
      headers: {
        'content-type': 'application/json',
      },
    }).then((data) => {
      console.log(data)
    });
  } catch (error) {}
}

async function pedirNombre() {
  const { value: nombre } = await Swal.fire({
    title: 'Enter your name',
    input: 'text',
    inputLabel: 'Your name',
    inputValue: '',
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!';
      }
    },
  });

  nombreUsuario = nombre;
}

pedirNombre();

async function chatMsg() {
  chatBox.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.key === 'Enter') {
      const msg = chatBox.value;
      chatBox.value = '';
      pushChat(nombreUsuario, msg);
    }
  });
}

chatMsg();
