const addProductForm = document.getElementById('form');
const addProductFormRealtime = document.getElementById('formRealtime');
const productListContainer = document.getElementById('list');
const pageLinks = document.getElementsByClassName('page-link');
const prevLinkE = document.getElementById('prevLink');
const nextLinkE = document.getElementById('nextLink');
const chat = document.getElementById('chat');
const input = document.getElementById('chat-box');
const inputButton = document.getElementById('inputButton');
const user = localStorage.getItem('userName');

let cartId = localStorage.getItem('cart-id');
const API_URL = 'http://localhost:8080/';

async function deleteProduct(id) {
  const url = `/api/products/${id}`;
  const options = {
    method: 'delete',
  };
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log('Response: Product deleted from fetch', data);
      const ul = document.getElementById(id);
      ul.remove();
    })
    .catch((error) => {
      console.error('Error: Couldnt delete from fetch', error);
      alert('Error deleting from fetch', JSON.stringify(error));
    });
}

function deleteProductSocket(id) {
  socket.emit('productDelete', (id) => {});
  window.location.reload();
}

async function getUser() {
  const API_URL = 'http://localhost:8080/';
  const url = API_URL + '/user';
  const data = {};
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log('Response:', data);
      const userMail = data.email;
      localStorage.setItem('userName', userMail);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}

try {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    /*     const formData = new FormData();
      const fileInput = document.querySelector('input[name="file"]');
      const inputName = document.querySelector('input[name="title"]');
      formData.append('myFile', fileInput.files[0].name);
      console.log(...formData) */

    const title = document.getElementById('inputName').value;
    const description = document.getElementById('inputDescription').value;
    const code = Number(document.getElementById('inputCode').value);
    const price = Number(document.getElementById('inputPrice').value);
    const stock = Number(document.getElementById('inputStock').value);
    const category = document.getElementById('inputCategory').value;

    const newProduct = { title, description, code, price, stock, category };
    console.log('newProduct', newProduct);
    const url = '/api/products';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    };

    try {
      /*       const response = await fetch(url, options);
          .then((response) => response.json())
          .then((data) => {
            console.log('Response: Product created fetch', data);
          })
          .catch((error) => {
            console.error('Error: Couldnt create product from fetch', error);
            alert(JSON.stringify(error));
          }); */

      if (response.ok) {
        const data = await response.json();
        console.log('Response: Product created fetch', data);

        // Display SweetAlert success notification
        Swal.fire({
          title: 'Success!',
          text: 'Product added successfully!',
          icon: 'success',
        });
        addProductForm.reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong dentro de if!',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  });
} catch (error) {}

try {
  productListContainer.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
} catch (error) {}

try {
  socket.on('connect', () => {
    console.log('Conexion establecida con el servidor');
  });

  socket.on('productAdded', (product) => {
    const ul = `
    <ul id="${product.code}" style='margin-bottom:30px;'>
      <li>Nombre: ${product.title}</li>
      <li>Codigo: ${product.code}</li>
      <button onclick="deleteProductsSocket${product.code}"></button>Remove</button>
    </ul>`;
    productListContainer.append(ul);
  });

  socket.on('productDelete', (id) => {
    const ul = document.getElementById(id);
    ul.remove();
  });

  socket.on('updateChat', () => {
    renderAllMessages();
  });

  addProductFormRealtime.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const title = document.getElementById('inputName').value;
    const description = document.getElementById('inputDescription').value;
    const code = document.getElementById('inputCode').value;
    const price = document.getElementById('inputPrice').value;
    const stock = document.getElementById('inputStock').value;
    const category = document.getElementById('inputCategory').value;

    const newProduct = { title, description, code, price, stock, category };

    socket.emit('productAdd', newProduct);
    addProductFormRealtime.reset();
  });
} catch (error) {}

Array.from(pageLinks).forEach((link) =>
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const link = e.target.href;
    const response = await fetch(link);
    const data = await response.json();

    console.log(response);

    const products = data.payload;
    const nextLink = data.nextLink;
    const prevLink = data.prevLink;

    if (prevLink) {
      prevLinkE.parentElement.classList.remove('disabled');
      prevLinkE.setAttribute('href', prevLink);
    } else {
      prevLinkE.parentElement.classList.add('disabled');
    }
    if (nextLink) {
      nextLinkE.parentElement.classList.remove('disabled');
      nextLinkE.setAttribute('href', nextLink);
    } else {
      nextLinkE.parentElement.classList.add('disabled');
    }

    productListContainer.innerHTML = '';
  })
);

//Fetching cartId

async function getCartId() {
  const API_URL = 'http://localhost:8080/';
  const url = API_URL + 'api/carts/id';
  const data = {};
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log('Response:', data);
      const cartId = data.cartId;
      localStorage.setItem('cart-id', cartId);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}

async function putIntoCart(_id) {
  await getCartId();
  cartId = localStorage.getItem('cart-id');
  const url = API_URL + 'api/carts/' + cartId + '/product/' + _id;
  const data = {};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      alert('added');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}

async function clearCart() {
  await getCartId();
  cartId = localStorage.getItem('cart-id');
  const url = API_URL + 'api/carts/' + cartId;
  const data = {};
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      alert('Emptied Cart');
    })
    .catch((error) => {
      console.error('Error: Couldnt empty cart');
      alert(JSON.stringify(error));
    });
}

async function deleteProductFromCart(_id) {
  await getCartId();
  cartId = localStorage.getItem('cart-id');
  const url = API_URL + 'api/carts/' + cartId + '/product/' + _id;
  const data = {};
  const options = {
    method: 'DELETE',
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Product removed',
        text: 'The product was removed from the cart',
        showConfirmButton: false,
        timer: 3000,
      });
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error: Couldnt delete product from cart');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'The product was NOT removed from the cart. Please let us know',
        showConfirmButton: false,
        timer: 3000,
      });
    });
}

async function createTicket() {
  await getCartId();
  cartId = localStorage.getItem('cart-id');
  const url = API_URL  + cartId + '/purchase/'
  const data = {};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      if (res.status === 'Ticket created'){
        console.log(res.status, 'res.status')
        window.location.href =  `${url}`
      }else{
        console.log(res.status, 'res.status')
        Swal.fire({
          icon: 'error',
          title: 'No stock',
          text: 'It seems that there is no stock. Please check the new stock',
        });
      }
    })
    .catch((error) => {
      console.error('Error: Couldnt create ticket');
    });
}