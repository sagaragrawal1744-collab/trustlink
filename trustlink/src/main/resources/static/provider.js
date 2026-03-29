const providerToken = localStorage.getItem("token");
const providerEmail = localStorage.getItem("email");

function statusBadge(status) {
    if (!status) return `<span class="status-badge">UNKNOWN</span>`;
    return `<span class="status-badge status-${String(status).toLowerCase()}">${status}</span>`;
}

async function loadProviderBookings() {
    const box = document.getElementById("providerBookings");
    const emailBox = document.getElementById("providerEmail");

    if (emailBox) {
        emailBox.innerText = providerEmail || "provider@gmail.com";
    }

    box.innerHTML = `<p class="loading">Loading assigned bookings...</p>`;

    try {
        const response = await fetch("/providers/my-bookings", {
            headers: {
                "Authorization": "Bearer " + providerToken
            }
        });

        if (!response.ok) {
            box.innerHTML = `<div class="empty-box">Failed to load provider bookings.</div>`;
            return;
        }

        const data = await response.json();

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No assigned bookings.</div>`;
            return;
        }

        let html = "";
        data.forEach(b => {
            html += `
                <div class="list-card">
                    <div><strong>Booking ID:</strong> ${b.id ?? "-"}</div>
                    <div><strong>User:</strong> ${b.userEmail ?? "-"}</div>
                    <div><strong>Status:</strong> ${statusBadge(b.status)}</div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Error loading provider bookings.</div>`;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login.html";
}

window.onload = loadProviderBookings;