let nombreUsuario = '';
const chatBox = document.getElementById('chat-box');

async function chatMsg() {
  chatBox.addEventListener('keyup', ({ key }) => {
    if (key == 'Enter') {
      const msg = chatBox.value;
      chatBox.value = '';
    }
  });
  console.log('Enter');
  const response = await fetch('/chat', {
    method: 'post',
    body: JSON.stringify({nombreUsuario, msg}),
    headers: {
      'content-type': 'application/json',
    },
  });
  const render = await fetch ('/chat',{
    method: 'get',
    headers: {
      'content-type': 'application/json',
    }, 
  })
}

chatMsg();

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
