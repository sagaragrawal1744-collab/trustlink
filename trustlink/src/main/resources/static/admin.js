const adminToken = localStorage.getItem("token");
const adminRole = localStorage.getItem("role");
const adminEmail = localStorage.getItem("email");

if (!adminToken || adminRole !== "ADMIN") {
    alert("Please login as admin");
    window.location.href = "/login.html";
}

document.getElementById("userEmail").innerText = adminEmail || "Admin";

function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}

function statusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

let overviewChartInstance = null;
let revenueChartInstance = null;

async function loadDashboard() {
    await loadStats();
    await loadPendingProviders();
    await loadProviders();
    await loadBookings();
    await loadPayments();
}

async function loadStats() {
    const response = await fetch("http://localhost:8080/admin/dashboard", {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    const data = await response.json();

    document.getElementById("stats").innerHTML = `
        <div class="stat-card">
            <div class="label">Total Users</div>
            <div class="value">${data.totalUsers}</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Providers</div>
            <div class="value">${data.totalProviders}</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Bookings</div>
            <div class="value">${data.totalBookings}</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Payments</div>
            <div class="value">${data.totalPayments}</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Revenue</div>
            <div class="value">₹${data.totalRevenue}</div>
        </div>
    `;

    renderOverviewChart(data);
    renderRevenueChart(data);
}

function renderOverviewChart(data) {
    const ctx = document.getElementById("overviewChart");

    if (overviewChartInstance) {
        overviewChartInstance.destroy();
    }

    overviewChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Users", "Providers", "Bookings", "Payments"],
            datasets: [{
                data: [
                    data.totalUsers,
                    data.totalProviders,
                    data.totalBookings,
                    data.totalPayments
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function renderRevenueChart(data) {
    const ctx = document.getElementById("revenueChart");

    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    revenueChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Revenue", "Bookings", "Payments"],
            datasets: [{
                label: "Business Summary",
                data: [
                    data.totalRevenue,
                    data.totalBookings,
                    data.totalPayments
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function loadPendingProviders() {
    const response = await fetch("http://localhost:8080/admin/pending-providers", {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    const data = await response.json();
    const box = document.getElementById("pendingProvidersList");

    if (!data.length) {
        box.innerHTML = `<div class="empty-box">No pending providers.</div>`;
        return;
    }

    let html = "";
    data.forEach(p => {
        html += `
            <div class="card">
                <h4>${p.name}</h4>
                <p><strong>Email:</strong> ${p.email}</p>
                <p><strong>Service:</strong> ${p.serviceType}</p>
                <p><strong>Location:</strong> ${p.location}</p>
                <p><strong>Phone:</strong> ${p.phone}</p>
                <p><strong>Status:</strong> ${p.approvalStatus}</p>

                <div class="approval-actions">
                    <button class="btn btn-success" onclick="approveProvider(${p.id})">Approve</button>
                    <button class="btn btn-danger" onclick="rejectProvider(${p.id})">Reject</button>
                </div>
            </div>
        `;
    });

    box.innerHTML = html;
}

async function approveProvider(providerId) {
    const response = await fetch(`http://localhost:8080/admin/approve-provider?providerId=${providerId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    if (!response.ok) {
        alert("Failed to approve provider");
        return;
    }

    alert("Provider approved successfully");
    loadDashboard();
}

async function rejectProvider(providerId) {
    const response = await fetch(`http://localhost:8080/admin/reject-provider?providerId=${providerId}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    if (!response.ok) {
        alert("Failed to reject provider");
        return;
    }

    alert("Provider rejected successfully");
    loadDashboard();
}

async function loadProviders() {
    const response = await fetch("http://localhost:8080/admin/providers", {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    const data = await response.json();
    const box = document.getElementById("providersList");

    if (!data.length) {
        box.innerHTML = `<div class="empty-box">No providers found.</div>`;
        return;
    }

    let html = "";
    data.forEach(p => {
        html += `
            <div class="card">
                <h4>${p.name}</h4>
                <p><strong>Email:</strong> ${p.email}</p>
                <p><strong>Service:</strong> ${p.serviceType}</p>
                <p><strong>Location:</strong> ${p.location}</p>
                <p><strong>Phone:</strong> ${p.phone}</p>
                <p><strong>Approval:</strong> ${p.approvalStatus}</p>
            </div>
        `;
    });

    box.innerHTML = html;
}

async function loadBookings() {
    const response = await fetch("http://localhost:8080/admin/bookings", {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    const data = await response.json();
    const box = document.getElementById("bookingsList");

    if (!data.length) {
        box.innerHTML = `<div class="empty-box">No bookings found.</div>`;
        return;
    }

    let html = "";
    data.forEach(b => {
        html += `
            <div class="card">
                <h4>Booking #${b.id}</h4>
                <p><strong>User:</strong> ${b.userEmail}</p>
                <p><strong>Provider:</strong> ${b.providerEmail}</p>
                <p><strong>Status:</strong> ${statusBadge(b.status)}</p>
            </div>
        `;
    });

    box.innerHTML = html;
}

async function loadPayments() {
    const response = await fetch("http://localhost:8080/admin/payments", {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    const data = await response.json();
    const box = document.getElementById("paymentsList");

    if (!data.length) {
        box.innerHTML = `<div class="empty-box">No payments found.</div>`;
        return;
    }

    let html = "";
    data.forEach(p => {
        html += `
            <div class="card">
                <h4>Payment #${p.id}</h4>
                <p><strong>Booking ID:</strong> ${p.bookingId}</p>
                <p><strong>User:</strong> ${p.userEmail}</p>
                <p><strong>Amount:</strong> ₹${p.amount}</p>
                <p><strong>Method:</strong> ${p.method}</p>
                <p><strong>Status:</strong> ${statusBadge(p.status)}</p>
            </div>
        `;
    });

    box.innerHTML = html;
}

loadDashboard();