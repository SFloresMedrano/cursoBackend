const addProductForm = document.getElementById('form');
const addProductFormRealtime = document.getElementById('formRealtime');
const productListContainer = document.getElementById('list');

try {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const title = document.getElementById('inputName').value;
    const description = document.getElementById('inputDescription').value;
    const code = document.getElementById('inputCode').value;
    const price = document.getElementById('inputPrice').value;
    const stock = document.getElementById('inputStock').value;
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
    window.location.reset();
  });
} catch (error) {
}

try {
  socket.on('connect', () => {
    console.log('Conexion establecida con el servidor');
  });

  socket.on('productAdded', (product) => {
    const li = `
    <ul id="${product.code}" style='margin-bottom:30px;'>
      <li>Nombre: ${product.title}</li>
      <li>Codigo: ${product.code}</li>
      <button onclick="deleteProducts${product.code}"></button>Remove</button>
    </ul>`;
    productListContainer.append(li);
  });

  socket.on('productDeleted', (id) => {
    const li = document.getElementById(id);
    li.remove();
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
    console.log('emite', newProduct)

    socket.emit('productAdd', newProduct);
    addProductFormRealtime.reset();
  });
} catch (error) {}
