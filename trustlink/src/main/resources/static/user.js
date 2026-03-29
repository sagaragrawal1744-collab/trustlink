const userToken = localStorage.getItem("token");
const userRole = localStorage.getItem("role");
const userEmail = localStorage.getItem("email");

if (!userToken || userRole !== "USER") {
    alert("Please login as user");
    window.location.href = "/login.html";
}

document.getElementById("userEmail").innerText = userEmail || "User";

function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}

function statusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

async function loadProviders() {
    const type = document.getElementById("service").value;
    const location = document.getElementById("location").value;
    const box = document.getElementById("providers");

    box.innerHTML = `<p class="loading">Loading providers...</p>`;

    try {
        const response = await fetch(`http://localhost:8080/providers/search?type=${type}&location=${location}`, {
            headers: {
                "Authorization": "Bearer " + userToken
            }
        });

        if (!response.ok) {
            box.innerHTML = `<div class="empty-box">Failed to load providers.</div>`;
            return;
        }

        const data = await response.json();

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No nearby providers found in ${location}.</div>`;
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
                    <button class="btn btn-primary" onclick="bookProvider(${p.id})">Book Now</button>
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Something went wrong while loading providers.</div>`;
    }
}

async function bookProvider(providerId) {
    if (!confirm("Do you want to book this provider?")) return;

    try {
        const response = await fetch(`http://localhost:8080/bookings/create?providerId=${providerId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + userToken
            }
        });

        if (!response.ok) {
            alert("Booking failed");
            return;
        }

        alert("Booking created successfully");
        loadBookings();
    } catch (error) {
        console.error(error);
        alert("Error while creating booking");
    }
}

async function payForBooking(bookingId) {
    const amount = prompt("Enter amount");
    if (!amount) return;

    try {
        const response = await fetch(`http://localhost:8080/payments/pay?bookingId=${bookingId}&amount=${amount}&method=UPI`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + userToken
            }
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Payment failed: " + text);
            return;
        }

        alert("Payment successful");
        loadBookings();
    } catch (error) {
        console.error(error);
        alert("Error while making payment");
    }
}

async function loadBookings() {
    const box = document.getElementById("bookings");
    box.innerHTML = `<p class="loading">Loading bookings...</p>`;

    try {
        const response = await fetch("http://localhost:8080/bookings/my", {
            headers: {
                "Authorization": "Bearer " + userToken
            }
        });

        if (!response.ok) {
            box.innerHTML = `<div class="empty-box">Failed to load bookings.</div>`;
            return;
        }

        const data = await response.json();

        if (!data.length) {
            box.innerHTML = `<div class="empty-box">No bookings yet.</div>`;
            return;
        }

        let html = "";
        data.forEach(b => {
            html += `
                <div class="card">
                    <h4>Booking #${b.id}</h4>
                    <p><strong>Provider:</strong> ${b.providerEmail}</p>
                    <p><strong>Status:</strong> ${statusBadge(b.status)}</p>

                    ${b.status !== "PAID" ? `
                        <button class="btn btn-success" onclick="payForBooking(${b.id})">Pay</button>
                    ` : ""}
                </div>
            `;
        });

        box.innerHTML = html;
    } catch (error) {
        console.error(error);
        box.innerHTML = `<div class="empty-box">Error while loading bookings.</div>`;
    }
}

loadBookings();