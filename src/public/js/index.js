
const addProductForm = document.getElementById('form');
const addProductFormRealtime = document.getElementById('formRealtime');
const productListContainer = document.getElementById('list');
const pageLinks = document.getElementsByClassName('page-link');
const prevLinkE = document.getElementById('prevLink');
const nextLinkE = document.getElementById('nextLink');

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'delete',
  });
  if (response.ok) {
    const ul = document.getElementById(id);
    ul.remove();
  } else {
    alert('Esto no pudo ser borrado');
  }
}

function deleteProductSocket(id) {
  socket.emit('productDelete', (id) => {});
  window.location.reload();
}

try {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const title = document.getElementById('inputName').value;
    const description = document.getElementById('inputDescription').value;
    const code = Number(document.getElementById('inputCode').value);
    const price = Number(document.getElementById('inputPrice').value);
    const stock = Number(document.getElementById('inputStock').value);
    const category = document.getElementById('inputCategory').value;

    const newProduct = { title, description, code, price, stock, category };

    const response = await fetch('/api/products/', {
      method: 'post',
      body: JSON.stringify(newProduct),
      headers: {
        'content-type': 'application/json',
      },
    });
    addProductForm.reset();
    window.location.reload();
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
let cartId = localStorage.getItem('cart-id');
const API_URL = 'http://localhost:8080/api';

function putIntoCart(_id) {
  cartId = localStorage.getItem('cart-id');
  const url = API_URL + '/carts/' + cartId + '/product/' + _id;
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

if (!cartId) {
  alert('no id');
  const url = API_URL + '/carts';
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
    .then((data) => {
      console.log('Response:', data);
      const cartId = data.data.cart._id
      localStorage.setItem('cart-id', cartId);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}