const cart = {};
const stockMap = {};

async function loadProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();

  const productsDiv = document.getElementById('products');
  productsDiv.innerHTML = '';

  Object.entries(data).forEach(([id, product]) => {
    stockMap[id] = product.count;

    const btnDisabled = product.count <= 0;
    const btnText = btnDisabled ? 'Out of stock' : 'Add to Cart';

    const div = document.createElement('div');
    div.className = 'mb-3';
    div.innerHTML = `
      <strong>${product.name}</strong> — ${product.price} Kč 
      <span class="text-muted">(skladem: ${product.count})</span><br>
      <button class="btn btn-sm btn-primary mt-1" ${btnDisabled ? 'disabled' : ''} onclick="addToCart('${id}', '${product.name}', ${product.price})">
        ${btnText}
      </button>
    `;
    productsDiv.appendChild(div);
  });
}

function addToCart(id, name, price) {
  if (!stockMap[id] || stockMap[id] <= 0) {
    alert("Produkt není skladem.");
    return;
  }

  if (!cart[id]) {
    cart[id] = { name, price, count: 0 };
  }

  if (cart[id].count >= stockMap[id]) {
    alert("Překročeno množství na skladě.");
    return;
  }

  cart.push({ ...product, count: 1 }); // nebo přidat volbu pro více kusů
  updateCart();
  renderCart();
}
function renderCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';

  Object.values(cart).forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.name} — ${item.price} Kč × ${item.count}`;
    cartDiv.appendChild(div);
  });
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name + ' - $' + p.price + ' - $' + p.count;
    cartDiv.appendChild(item);
  });
}

function checkout() {
  document.getElementById('addressForm').style.display = 'block';
}
async function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Košík je prázdný.");
    return;
  }

  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value;
  if (!address) {
    alert("Zadejte adresu.");
    return;
  }

  const items = Object.entries(cart).map(([id, item]) => ({
    id,
    name: item.name,
    count: item.count
  }));

  const res = await fetch('/api/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items })
  });

  const data = await res.json();
  alert(data.success ? "Objednávka odeslána!" : "Chyba při odesílání.");
}


loadProducts();

