const providerToken = localStorage.getItem("token");
const providerRole = localStorage.getItem("role");
const providerEmail = localStorage.getItem("email");

if (!providerToken || providerRole !== "PROVIDER") {
    alert("Please login as provider");
    window.location.href = "/login.html";
}

document.getElementById("userEmail").innerText = providerEmail || "Provider";

function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}

function statusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

async function loadProviderBookings() {
    const box = document.getElementById("providerBookings");
    box.innerHTML = `<p class="loading">Loading assigned bookings...</p>`;

    try {
        const response = await fetch("http://localhost:8080/providers/my-bookings", {
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
                <div class="card">
                    <h4>Booking #${b.id}</h4>
                    <p><strong>User:</strong> ${b.userEmail}</p>
                    <p><strong>Status:</strong> ${statusBadge(b.status)}</p>

                    <div class="flex-actions">
                        <button class="btn btn-primary" onclick="updateProviderBooking('accept-booking', ${b.id})">Accept</button>
                        <button class="btn btn-danger" onclick="updateProviderBooking('reject-booking', ${b.id})">Reject</button>
                        <button class="btn btn-success" onclick="updateProviderBooking('complete-booking', ${b.id})">Complete</button>
                    </div>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Error while loading provider bookings.</div>`;
    }
}

async function updateProviderBooking(action, bookingId) {
    try {
        const response = await fetch(`http://localhost:8080/providers/${action}?bookingId=${bookingId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + providerToken
            }
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Action failed: " + text);
            return;
        }

        alert("Booking updated successfully");
        loadProviderBookings();
    } catch (error) {
        console.error(error);
        alert("Error while updating booking");
    }
}

loadProviderBookings();