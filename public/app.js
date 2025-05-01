let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `
      <div class="mb-2">
        ${p.name} – skladem: ${p.count} – $${p.price} 
        <input type="number" min="1" max="${p.count}" value="1" id="qty-${p.id}" style="width: 60px; margin-left:10px;">
        <button onclick='addToCart(${JSON.stringify(p)}, "qty-${p.id}")'>Add</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function addToCart(product, inputId) {
  const qtyInput = document.getElementById(inputId);
  const count = parseInt(qtyInput.value);

  if (isNaN(count) || count <= 0) {
    alert('Zadej platné množství.');
    return;
  }

  // Pokud už produkt v košíku je, aktualizuj počet
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.count += count;
  } else {
    cart.push({ ...product, count });
  }

  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = `${p.name} – ks: ${p.count} – celkem: $${(p.count * p.price).toFixed(2)}`;
    cartDiv.appendChild(item);
  });
}

function checkout() {
  if (cart.length === 0) {
    alert('Košík je prázdný.');
    return;
  }
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value.trim();

  if (!address) {
    alert('Zadej adresu.');
    return;
  }

  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });

  const data = await res.json();

  if (data.success) {
    alert('Objednávka byla úspěšně odeslána!');
    cart = [];
    updateCart();
    document.getElementById('addressForm').style.display = 'none';
    document.getElementById('address').value = '';
    loadProducts();
  } else {
    alert('Chyba při odesílání objednávky: ' + (data.error || 'Neznámá chyba'));
  }
}
loadProducts();
