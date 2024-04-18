// Realizar una solicitud GET a la API para obtener los sitios bloqueados
fetch('http://127.0.0.1:8000/api/sitiosbloqueados/')
  .then(response => response.json())
  .then(data => {
    const sitiosBloqueados = data.map(sitio => sitio.url);

    // Obtener el URL actualmente visitado
    const urlActual = window.location.href;

    // Comparar el URL actual con los sitios bloqueados
    if (sitiosBloqueados.includes(urlActual)) {
      // Si hay una coincidencia, detener la carga de la página y mostrar un mensaje
      window.stop();
      alert('Este sitio está bloqueado por el supervisor.');
    }
  })
  .catch(error => console.error('Error al obtener los sitios bloqueados:', error));
