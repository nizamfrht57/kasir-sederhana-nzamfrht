// --- ELEMEN DOM ---
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemQuantityInput = document.getElementById('itemQuantity');
const addItemBtn = document.getElementById('addItemBtn');
const cartBody = document.getElementById('cartBody');
const subtotalSpan = document.getElementById('subtotal');
const discountRateInput = document.getElementById('discountRate');
const discountAmountSpan = document.getElementById('discountAmount');
const grandTotalSpan = document.getElementById('grandTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// --- DATA KERANJANG ---
let cart = [];

// --- FUNGSI FORMATTING HARGA ---
const formatRupiah = (number) => {
    return 'Rp ' + number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// --- FUNGSI UTAMA: MENAMPILKAN ULANG DAN MENGHITUNG TOTAL ---
const updateCartAndSummary = () => {
    // 1. CLEAR KERANJANG
    cartBody.innerHTML = '';

    // 2. HITUNG SUBTOTAL
    let subtotal = 0;
    cart.forEach((item, index) => {
        const sub = item.price * item.quantity;
        subtotal += sub;

        // 3. TAMBAHKAN BARIS KE TABEL
        const row = cartBody.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatRupiah(item.price)}</td>
            <td>${item.quantity}</td>
            <td>${formatRupiah(sub)}</td>
            <td><button class="btn-danger" onclick="removeItem(${index})">Hapus</button></td>
        `;
    });

    // 4. HITUNG DISKON
    const discountRate = parseFloat(discountRateInput.value) / 100 || 0;
    const discountAmount = subtotal * discountRate;
    const grandTotal = subtotal - discountAmount;

    // 5. UPDATE TAMPILAN RINGKASAN
    subtotalSpan.textContent = formatRupiah(subtotal);
    discountAmountSpan.textContent = formatRupiah(discountAmount);
    grandTotalSpan.textContent = formatRupiah(grandTotal);
};

// --- HANDLER: MENAMBAH ITEM ---
const addItem = () => {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    const quantity = parseInt(itemQuantityInput.value);

    if (name && price > 0 && quantity > 0) {
        // Cek apakah item sudah ada untuk digabungkan
        const existingItemIndex = cart.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

        if (existingItemIndex > -1) {
            // Jika ada, tambahkan kuantitasnya
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Jika belum ada, tambahkan item baru
            cart.push({ name, price, quantity });
        }

        // Reset input fields
        itemNameInput.value = '';
        itemPriceInput.value = '';
        itemQuantityInput.value = '1';
        itemNameInput.focus();

        updateCartAndSummary();
    } else {
        alert('Mohon lengkapi Nama, Harga, dan Jumlah dengan benar!');
    }
};

// --- HANDLER: MENGHAPUS ITEM ---
const removeItem = (index) => {
    if (confirm(`Yakin ingin menghapus ${cart[index].name} dari keranjang?`)) {
        cart.splice(index, 1);
        updateCartAndSummary();
    }
};

// --- HANDLER: CHECKOUT ---
const checkout = () => {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }

    const subtotal = parseFloat(subtotalSpan.textContent.replace('Rp ', '').replace(/\./g, ''));
    const discountAmount = parseFloat(discountAmountSpan.textContent.replace('Rp ', '').replace(/\./g, ''));
    const grandTotal = parseFloat(grandTotalSpan.textContent.replace('Rp ', '').replace(/\./g, ''));

    let receipt = `\n--- STRUK PEMBAYARAN ---\n`;
    receipt += `Waktu: ${new Date().toLocaleString()}\n`;
    receipt += `-------------------------\n`;
    
    cart.forEach(item => {
        const sub = item.price * item.quantity;
        receipt += `${item.name} (${item.quantity} x ${formatRupiah(item.price)}) = ${formatRupiah(sub)}\n`;
    });

    receipt += `-------------------------\n`;
    receipt += `Subtotal:    ${formatRupiah(subtotal)}\n`;
    receipt += `Diskon (${discountRateInput.value}%): ${formatRupiah(discountAmount)}\n`;
    receipt += `TOTAL AKHIR: ${formatRupiah(grandTotal)}\n`;
    receipt += `-------------------------\n`;
    receipt += `Terima kasih!\n`;

    alert(receipt);

    // Reset kasir setelah checkout
    cart = [];
    discountRateInput.value = '0';
    updateCartAndSummary();
};

// --- EVENT LISTENERS ---
addItemBtn.addEventListener('click', addItem);
discountRateInput.addEventListener('input', updateCartAndSummary);
checkoutBtn.addEventListener('click', checkout);

// Inisialisasi tampilan awal
updateCartAndSummary();