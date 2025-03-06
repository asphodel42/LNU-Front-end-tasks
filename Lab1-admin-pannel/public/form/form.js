document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".client-form");
  form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const formData = {
          id: 1,
          photo: document.querySelector("#photo").value,
          name: document.querySelector("#name").value,
          surname: document.querySelector("#surname").value,
          email: document.querySelector("#email").value,
          phone: document.querySelector("#phone").value,
          dob: document.querySelector("#dob").value,
          gender: document.querySelector("#gender").value,
          country: document.querySelector("#country").value,
          agreement: document.querySelector("#agreement").checked
      };
      
      const response = await fetch("/add-user", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      alert(result.message);
  });
});