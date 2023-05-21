const addProductForm = document.getElementById('form');
const addProductFormRealtime = document.getElementById('formRealtime');
const productListContainer = document.getElementById('list');

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'delete',
  });
  if (response.ok){
    const ul = document.getElementById(id);
    ul.remove();
  }else{
    alert('Esto no pudo ser borrado')
  }
}

async function deleteProductSockets(id){
  console.log('click')
  socket.emit('productDelete',(id)=>{
  })
}



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
