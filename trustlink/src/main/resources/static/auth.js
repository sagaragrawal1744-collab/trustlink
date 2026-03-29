async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const result = document.getElementById("result");

    result.style.color = "red";
    result.innerText = "";

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email || email);

            result.style.color = "green";
            result.innerText = data.message || "Login successful";

            if (data.role === "ADMIN") {
                window.location.href = "/dashboard-admin.html";
            } else if (data.role === "PROVIDER") {
                window.location.href = "/dashboard-provider.html";
            } else {
                window.location.href = "/dashboard-user.html";
            }
        } else {
            result.innerText = data.message || "Login failed";
        }
    } catch (error) {
        result.innerText = "Error while logging in";
        console.error(error);
    }
}