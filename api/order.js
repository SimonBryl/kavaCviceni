export default async function handler(req, res) {
  try {
    const { address, items } = req.body;

    if (!address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const firebaseUrl = process.env.FIREBASE_PROJECT_ID + '/products.json';

    // 1. Načíst produkty z Firebase
    const current = await fetch(firebaseUrl);
    if (!current.ok) throw new Error('Failed to load stock');

    const stockData = await current.json();
    if (!stockData) throw new Error('No stock data available');

    // 2. Příprava mapy produktů: { name => [key, product] }
    const stockMap = {};
    Object.entries(stockData).forEach(([key, product]) => {
      stockMap[product.name] = [key, product];
    });

    // 3. Zkontroluj, že jsou všechny položky skladem a připrav odečty
    for (const item of items) {
      const [key, product] = stockMap[item.name] || [];
      if (!key || !product) throw new Error(`Product ${item.name} not found`);
      if (product.count < (item.count || 1)) {
        throw new Error(`Not enough stock for ${item.name}`);
      }
    }

    // 4. Odečti počty a aktualizuj jednotlivé produkty
    for (const item of items) {
      const [key, product] = stockMap[item.name];
      const newCount = product.count - (item.count || 1);

      const updateRes = await fetch(`${process.env.FIREBASE_PROJECT_ID}/products/${key}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newCount })
      });

      if (!updateRes.ok) throw new Error(`Failed to update ${item.name}`);
    }

    // 5. Ulož objednávku
    const orderRes = await fetch(process.env.FIREBASE_PROJECT_ID + '/orders.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        items,
        date: new Date().toISOString()
      })
    });

    if (!orderRes.ok) throw new Error('Failed to save order');

    const result = await orderRes.json();
    res.status(200).json({ success: true, id: result.name });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: err.message || 'Order failed' });
  }
}
