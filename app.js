const STORAGE_KEY = "vn-auto-parts-warehouse";
const AUTH_KEY = "vn-auto-parts-authenticated";

const demoInventory = [
  { partNumber: "LOC-001", name: "Lọc dầu động cơ Toyota", category: "Lọc", location: "A1-03", stock: 42, minStock: 10, unitPrice: 85000 },
  { partNumber: "BRK-220", name: "Má phanh trước Ford Ranger", category: "Phanh", location: "B2-11", stock: 8, minStock: 12, unitPrice: 620000 },
  { partNumber: "SPK-778", name: "Bugi Iridium Honda", category: "Động cơ", location: "C1-02", stock: 64, minStock: 20, unitPrice: 145000 },
  { partNumber: "BAT-550", name: "Ắc quy 12V 55Ah", category: "Điện", location: "D4-01", stock: 5, minStock: 6, unitPrice: 1380000 },
  { partNumber: "BLT-909", name: "Dây curoa tổng Hyundai", category: "Truyền động", location: "A3-07", stock: 19, minStock: 8, unitPrice: 310000 }
];

const state = {
  inventory: loadInventory(),
  history: []
};

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const numberFormat = new Intl.NumberFormat("vi-VN");

const elements = {
  loginScreen: document.querySelector("#loginScreen"),
  dashboard: document.querySelector("#dashboard"),
  loginForm: document.querySelector("#loginForm"),
  loginError: document.querySelector("#loginError"),
  logoutButton: document.querySelector("#logoutButton"),
  inventoryTable: document.querySelector("#inventoryTable"),
  transactionForm: document.querySelector("#transactionForm"),
  transactionMessage: document.querySelector("#transactionMessage"),
  searchInput: document.querySelector("#searchInput"),
  partNumbers: document.querySelector("#partNumbers"),
  historyList: document.querySelector("#historyList"),
  reportCards: document.querySelector("#reportCards"),
  totalParts: document.querySelector("#totalParts"),
  totalStock: document.querySelector("#totalStock"),
  lowStock: document.querySelector("#lowStock"),
  inventoryValue: document.querySelector("#inventoryValue"),
  resetDemo: document.querySelector("#resetDemo"),
  downloadReport: document.querySelector("#downloadReport")
};

function getDemoInventory() {
  return demoInventory.map((item) => ({ ...item }));
}

function loadInventory() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : getDemoInventory();
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.inventory));
}

function setAuthenticated(isAuthenticated) {
  localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  elements.loginScreen.classList.toggle("hidden", isAuthenticated);
  elements.dashboard.classList.toggle("hidden", !isAuthenticated);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[character]));
}

function getStatus(item) {
  if (item.stock <= 0) return { label: "Hết hàng", className: "empty" };
  if (item.stock <= item.minStock) return { label: "Sắp hết", className: "low" };
  return { label: "Đủ hàng", className: "ok" };
}

function getFilteredInventory() {
  const query = elements.searchInput.value.trim().toLowerCase();
  if (!query) return state.inventory;
  return state.inventory.filter((item) =>
    [item.partNumber, item.name, item.category, item.location].some((value) => String(value).toLowerCase().includes(query))
  );
}

function renderInventory() {
  const filtered = getFilteredInventory();
  elements.inventoryTable.innerHTML = filtered
    .map((item) => {
      const status = getStatus(item);
      return `
        <tr>
          <td><strong>${escapeHtml(item.partNumber)}</strong></td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(item.location)}</td>
          <td>${numberFormat.format(item.stock)}</td>
          <td>${currency.format(item.unitPrice)}</td>
          <td><span class="badge ${status.className}">${status.label}</span></td>
        </tr>`;
    })
    .join("");

  if (!filtered.length) {
    elements.inventoryTable.innerHTML = `<tr><td colspan="7">Không tìm thấy phụ tùng phù hợp.</td></tr>`;
  }

  elements.partNumbers.innerHTML = state.inventory
    .map((item) => `<option value="${escapeHtml(item.partNumber)}">${escapeHtml(item.name)}</option>`)
    .join("");
}

function renderStats() {
  const totalParts = state.inventory.length;
  const totalStock = state.inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = state.inventory.filter((item) => item.stock <= item.minStock).length;
  const inventoryValue = state.inventory.reduce((sum, item) => sum + item.stock * item.unitPrice, 0);

  elements.totalParts.textContent = numberFormat.format(totalParts);
  elements.totalStock.textContent = numberFormat.format(totalStock);
  elements.lowStock.textContent = numberFormat.format(lowStock);
  elements.inventoryValue.textContent = currency.format(inventoryValue);
}

function renderHistory() {
  if (!state.history.length) {
    elements.historyList.innerHTML = "<li>Chưa có phiếu nhập xuất trong phiên làm việc.</li>";
    return;
  }

  elements.historyList.innerHTML = state.history
    .slice(0, 8)
    .map(
      (entry) => `<li>
        <strong>${entry.type === "import" ? "Nhập" : "Xuất"} ${numberFormat.format(entry.quantity)} - ${escapeHtml(entry.partNumber)}</strong>
        <small>${escapeHtml(entry.name)} • ${escapeHtml(entry.time)}</small>
      </li>`
    )
    .join("");
}

function renderReport() {
  const categories = state.inventory.reduce((summary, item) => {
    if (!summary[item.category]) summary[item.category] = { stock: 0, value: 0 };
    summary[item.category].stock += item.stock;
    summary[item.category].value += item.stock * item.unitPrice;
    return summary;
  }, {});

  elements.reportCards.innerHTML = Object.entries(categories)
    .map(
      ([category, data]) => `<article class="report-card">
        <span>${escapeHtml(category)}</span>
        <strong>${numberFormat.format(data.stock)}</strong>
        <p>Giá trị: ${currency.format(data.value)}</p>
      </article>`
    )
    .join("");
}

function render() {
  renderInventory();
  renderStats();
  renderHistory();
  renderReport();
}

function fillPartDetails(partNumber) {
  const item = state.inventory.find((part) => part.partNumber === partNumber);
  if (!item) return;
  document.querySelector("#partName").value = item.name;
  document.querySelector("#category").value = item.category;
  document.querySelector("#location").value = item.location;
  document.querySelector("#unitPrice").value = item.unitPrice;
  document.querySelector("#minStock").value = item.minStock;
}

function handleTransaction(event) {
  event.preventDefault();
  const type = document.querySelector("#transactionType").value;
  const partNumber = document.querySelector("#partNumber").value.trim().toUpperCase();
  const name = document.querySelector("#partName").value.trim();
  const category = document.querySelector("#category").value.trim();
  const location = document.querySelector("#location").value.trim().toUpperCase();
  const quantity = Number(document.querySelector("#quantity").value);
  const unitPrice = Number(document.querySelector("#unitPrice").value);
  const minStock = Number(document.querySelector("#minStock").value);
  const existing = state.inventory.find((item) => item.partNumber === partNumber);

  if (type === "export" && (!existing || existing.stock < quantity)) {
    elements.transactionMessage.textContent = "Không đủ tồn kho để xuất phụ tùng này.";
    elements.transactionMessage.style.color = "var(--primary)";
    return;
  }

  if (existing) {
    existing.name = name;
    existing.category = category;
    existing.location = location;
    existing.unitPrice = unitPrice;
    existing.minStock = minStock;
    existing.stock += type === "import" ? quantity : -quantity;
  } else {
    state.inventory.push({ partNumber, name, category, location, stock: quantity, minStock, unitPrice });
  }

  state.history.unshift({ type, partNumber, name, quantity, time: new Date().toLocaleString("vi-VN") });
  saveInventory();
  render();
  elements.transactionForm.reset();
  document.querySelector("#quantity").value = 1;
  document.querySelector("#minStock").value = 5;
  elements.transactionMessage.style.color = "var(--green)";
  elements.transactionMessage.textContent = `Đã ${type === "import" ? "nhập" : "xuất"} kho thành công.`;
}

function downloadCsv() {
  const headers = ["Ma phu tung", "Ten phu tung", "Danh muc", "Vi tri", "Ton kho", "Ton toi thieu", "Gia nhap"];
  const rows = state.inventory.map((item) => [
    item.partNumber,
    item.name,
    item.category,
    item.location,
    item.stock,
    item.minStock,
    item.unitPrice
  ]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bao-cao-ton-kho.csv";
  link.click();
  URL.revokeObjectURL(url);
}

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  if (username === "admin" && password === "123456") {
    elements.loginError.textContent = "";
    setAuthenticated(true);
    render();
  } else {
    elements.loginError.textContent = "Sai tên đăng nhập hoặc mật khẩu.";
  }
});

elements.logoutButton.addEventListener("click", () => setAuthenticated(false));
elements.searchInput.addEventListener("input", renderInventory);
elements.transactionForm.addEventListener("submit", handleTransaction);
document.querySelector("#partNumber").addEventListener("change", (event) => fillPartDetails(event.target.value.trim().toUpperCase()));
elements.downloadReport.addEventListener("click", downloadCsv);
elements.resetDemo.addEventListener("click", () => {
  state.inventory = getDemoInventory();
  state.history = [];
  saveInventory();
  render();
});

setAuthenticated(localStorage.getItem(AUTH_KEY) === "true");
render();
