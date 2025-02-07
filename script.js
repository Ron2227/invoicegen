const { jsPDF } = window.jspdf;
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];

// Initialize
window.onload = () => {
    updateDashboard();
    addService(); // Add first service row
    addInputListeners(); // Add real-time calculation listeners
};

// Add Service Row
function addService() {
    const tbody = document.getElementById('servicesBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="service-desc"></td>
        <td><input type="number" class="quantity" value="1"></td>
        <td><input type="number" class="price"></td>
        <td class="total">0.00</td>
        <td><button class="delete-btn" onclick="deleteService(this)">×</button></td>
    `;
    tbody.appendChild(newRow);
    addInputListeners(); // Reattach listeners
}

// Delete Service Row
function deleteService(btn) {
    if (document.querySelectorAll('#servicesBody tr').length > 1) {
        btn.closest('tr').remove();
        calculateTotal();
    }
}

// Add Input Listeners for Real-Time Calculations
function addInputListeners() {
    document.querySelectorAll('.quantity, .price').forEach(input => {
        input.removeEventListener('input', calculateTotal); // Remove old listeners
        input.addEventListener('input', calculateTotal); // Add new listeners
    });
}

// Calculate Totals
function calculateTotal() {
    let grandTotal = 0;
    document.querySelectorAll('#servicesBody tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const total = qty * price;
        row.querySelector('.total').textContent = total.toFixed(2);
        grandTotal += total;
    });
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}

// Generate PDF
function generatePDF() {
    if (!validateForm()) return;

    const doc = new jsPDF();
    const invoiceData = getInvoiceData();
    invoices.push(invoiceData);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    updateDashboard();

    // Add PDF content (logo, client info, services, etc.)
    // ... (same as before)

    doc.save('invoice.pdf');
}

// Preview Invoice
function previewInvoice() {
    if (!validateForm()) return;
    const doc = new jsPDF();
    // Add PDF content (same as generatePDF)
    window.open(doc.output('bloburl'), '_blank');
}

// Reset Form
function resetForm() {
    document.getElementById('invoiceForm').reset();
    document.getElementById('servicesBody').innerHTML = '';
    addService();
    document.getElementById('grandTotal').textContent = '0.00';
}

// Clear All Invoices
function clearAllInvoices() {
    if (confirm('Are you sure you want to delete all invoices?')) {
        localStorage.removeItem('invoices');
        invoices = [];
        updateDashboard();
    }
}

// Update Dashboard
function updateDashboard() {
    const tbody = document.getElementById('invoiceListBody');
    tbody.innerHTML = invoices.map((invoice, index) => `
        <tr>
            <td>${invoice.clientName}</td>
            <td>${invoice.number}</td>
            <td>${invoice.date}</td>
            <td>${invoice.amount}</td>
            <td><button class="delete-btn" onclick="deleteInvoice(${index})">Delete</button></td>
        </tr>
    `).join('');
}

// Delete Invoice
function deleteInvoice(index) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        invoices.splice(index, 1);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        updateDashboard();
    }
}

// Validate Form
function validateForm() {
    const clientName = document.getElementById('clientName').value;
    if (!clientName) {
        alert('Client name is required!');
        return false;
    }
    return true;
}

// Get Invoice Data
function getInvoiceData() {
    return {
        clientName: document.getElementById('clientName').value,
        number: document.getElementById('invoiceNumber').value,
        date: document.getElementById('invoiceDate').value,
        amount: document.getElementById('grandTotal').textContent
    };
}
