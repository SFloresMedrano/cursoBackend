async function alert() {
    const { value: nombre } = await Swal.fire({
      title: "Enter your name",
      input: "text",
      inputLabel: "Your name",
      inputValue: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
  
    if (nombre) {
      nombreUsuario = nombre;
      Swal.fire(`Your name is ${nombreUsuario}`);
    } else {
      Swal.fire(`Nombre no ingresado`);
    }
  }
  
 alert();