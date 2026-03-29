const adminToken = localStorage.getItem("token");
const adminEmail = localStorage.getItem("email");

function statusBadge(status) {
    if (!status) return `<span class="status-badge">UNKNOWN</span>`;
    return `<span class="status-badge status-${String(status).toLowerCase()}">${status}</span>`;
}

async function fetchWithAuth(url) {
    const response = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + adminToken
        }
    });

    if (!response.ok) {
        throw new Error("Request failed: " + response.status);
    }

    return response.json();
}

async function loadDashboard() {
    const emailBox = document.getElementById("adminEmail");
    if (emailBox) {
        emailBox.innerText = adminEmail || "admin@gmail.com";
    }

    await loadStats();
    await loadPendingProviders();
    await loadProviders();
    await loadBookings();
    await loadPayments();
}

async function loadStats() {
    const statsBox = document.getElementById("stats");

    try {
        const data = await fetchWithAuth("/admin/dashboard");

        statsBox.innerHTML = `
            <div class="stat-card">
                <div class="label">Total Users</div>
                <div class="value">${data.totalUsers ?? 0}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Providers</div>
                <div class="value">${data.totalProviders ?? 0}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Bookings</div>
                <div class="value">${data.totalBookings ?? 0}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Payments</div>
                <div class="value">${data.totalPayments ?? 0}</div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        statsBox.innerHTML = `<div class="empty-box">Failed to load dashboard stats.</div>`;
    }
}

async function loadPendingProviders() {
    const box = document.getElementById("pendingProviders");
    box.innerHTML = `<p class="loading">Loading pending providers...</p>`;

    try {
        const data = await fetchWithAuth("/admin/providers/pending");

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No pending providers.</div>`;
            return;
        }

        let html = "";
        data.forEach(provider => {
            html += `
                <div class="list-card">
                    <div><strong>${provider.name ?? "No Name"}</strong></div>
                    <div>${provider.email ?? "No Email"}</div>
                    <div>${statusBadge(provider.status)}</div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Failed to load pending providers.</div>`;
    }
}

async function loadProviders() {
    const box = document.getElementById("allProviders");
    box.innerHTML = `<p class="loading">Loading providers...</p>`;

    try {
        const data = await fetchWithAuth("/admin/providers");

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No providers found.</div>`;
            return;
        }

        let html = "";
        data.forEach(provider => {
            html += `
                <div class="list-card">
                    <div><strong>${provider.name ?? "No Name"}</strong></div>
                    <div>${provider.email ?? "No Email"}</div>
                    <div>Role: ${provider.role ?? "PROVIDER"}</div>
                    <div>${statusBadge(provider.status)}</div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Failed to load providers.</div>`;
    }
}

async function loadBookings() {
    const box = document.getElementById("allBookings");
    box.innerHTML = `<p class="loading">Loading bookings...</p>`;

    try {
        const data = await fetchWithAuth("/admin/bookings");

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No bookings found.</div>`;
            return;
        }

        let html = "";
        data.forEach(booking => {
            html += `
                <div class="list-card">
                    <div><strong>Booking ID:</strong> ${booking.id ?? "-"}</div>
                    <div><strong>User:</strong> ${booking.userEmail ?? booking.email ?? "-"}</div>
                    <div><strong>Status:</strong> ${statusBadge(booking.status)}</div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Failed to load bookings.</div>`;
    }
}

async function loadPayments() {
    const box = document.getElementById("allPayments");
    box.innerHTML = `<p class="loading">Loading payments...</p>`;

    try {
        const data = await fetchWithAuth("/admin/payments");

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No payments found.</div>`;
            return;
        }

        let html = "";
        data.forEach(payment => {
            html += `
                <div class="list-card">
                    <div><strong>Payment ID:</strong> ${payment.id ?? "-"}</div>
                    <div><strong>Booking ID:</strong> ${payment.bookingId ?? "-"}</div>
                    <div><strong>Amount:</strong> ${payment.amount ?? 0}</div>
                    <div><strong>Status:</strong> ${statusBadge(payment.status)}</div>
                    <div><strong>Method:</strong> ${payment.method ?? "-"}</div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Failed to load payments.</div>`;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login.html";
}

window.onload = loadDashboard;