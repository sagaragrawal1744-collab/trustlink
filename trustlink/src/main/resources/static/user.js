async function loadProviders() {
    const service = document.getElementById("service").value;
    const location = document.getElementById("location").value.trim();
    const providersBox = document.getElementById("providers");

    providersBox.innerHTML = `<p class="loading">Loading providers...</p>`;

    try {
        const response = await fetch(`/providers/search?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            providersBox.innerHTML = `<div class="empty-box">Failed to load providers.</div>`;
            return;
        }

        const data = await response.json();

        if (!data.length) {
            providersBox.innerHTML = `<div class="empty-box">No providers found.</div>`;
            return;
        }

        let html = "";
        data.forEach(provider => {
            html += `
                <div class="list-card">
                    <div><strong>${provider.name ?? "No Name"}</strong></div>
                    <div>${provider.email ?? "No Email"}</div>
                    <div>Service: ${provider.serviceType ?? service}</div>
                    <div>Location: ${provider.location ?? location}</div>
                </div>
            `;
        });

        providersBox.innerHTML = html;
    } catch (error) {
        console.error(error);
        providersBox.innerHTML = `<div class="empty-box">Error loading providers.</div>`;
    }
}