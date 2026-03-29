async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const result = document.getElementById("result");

    result.innerText = "";

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            result.innerText = "Invalid email or password";
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);

        if (data.role === "ADMIN") {
            window.location.href = "/dashboard-admin.html";
        } else if (data.role === "PROVIDER") {
            window.location.href = "/dashboard-provider.html";
        } else {
            window.location.href = "/dashboard-user.html";
        }
    } catch (error) {
        console.error(error);
        result.innerText = "Error while logging in";
    }
}

function goToRegister() {
    window.location.href = "/register.html";
}