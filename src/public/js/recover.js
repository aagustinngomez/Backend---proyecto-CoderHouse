async function handleOnSubmit() {
  try {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const data = {
      email: username.value,
      password: password.value,
    };

    const result = await fetch("/session/recover", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (result.status === 204) {
      window.location.replace("/views/cart");
    } else {
      const messageLabel = document.getElementById("message");
      const { message } = await result.json();
      messageLabel.innerText = message;
    }
  } catch (error) {
    const messageLabel = document.getElementById("message");
    messageLabel.innerText = JSON.stringify(error);
  }
}