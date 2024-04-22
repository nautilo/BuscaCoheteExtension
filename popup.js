// Realizar una solicitud GET a la API para obtener los sitios bloqueados
fetch('http://buscacohete.pythonanywhere.com/api/sitiosbloqueados/')
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
      return; // Detener la ejecución del resto del código
    }

    // Umbral de probabilidad NSFW
    const NSFW_THRESHOLD = 0.5;

    // Función para analizar una imagen
    function predictImage(imageUrl) {
      return new Promise((resolve, reject) => {
        // Cargar la imagen
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          // Convertir la imagen a blob
          fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
              // Llamar a la función predictImage del repositorio opennsfw2
              opennsfw2.predict_image(blob)
                .then(result => {
                  // Resolver la promesa con el resultado de la predicción
                  resolve(result);
                })
                .catch(error => {
                  // Rechazar la promesa si ocurre un error
                  reject(error);
                });
            })
            .catch(error => {
              // Rechazar la promesa si ocurre un error al cargar la imagen
              reject(error);
            });
        };
        img.onerror = function() {
          reject(new Error('Error al cargar la imagen'));
        };
        img.src = imageUrl;
      });
    }

    // Función para analizar un video
    function predictVideo(videoUrl) {
      return new Promise((resolve, reject) => {
        // Llamar a la función predictVideo del repositorio opennsfw2
        opennsfw2.predict_video_frames(videoUrl)
          .then(results => {
            // Verificar si algún fotograma supera el umbral de probabilidad NSFW
            const isNSFW = results.some(result => result >= NSFW_THRESHOLD);
            // Resolver la promesa con un booleano que indica si el video es inapropiado
            resolve(isNSFW);
          })
          .catch(error => {
            // Rechazar la promesa si ocurre un error
            reject(error);
          });
      });
    }

    // Escuchar el evento onBeforeRequest para interceptar las solicitudes de imágenes y videos
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        if (details.type === "image" || details.type === "video") {
          // Analizar la URL de la imagen o el video
          const url = details.url;
          // Determinar si es una imagen o un video
          const isImage = details.type === "image";
          
          // Llamar a la función predictImage o predictVideo según corresponda
          const predictionPromise = isImage ? predictImage(url) : predictVideo(url);
          
          // Manejar la promesa de la predicción
          predictionPromise
            .then(result => {
              // Verificar si la predicción supera el umbral de probabilidad NSFW
              if (result >= NSFW_THRESHOLD) {
                // Bloquear la solicitud si es inapropiada
                return {cancel: true};
              }
            })
            .catch(error => {
              console.error('Error al analizar el contenido:', error);
            });
        }
      },
      {urls: ["<all_urls>"]},
      ["blocking"]
    );
  })
  .catch(error => console.error('Error al obtener los sitios bloqueados:', error));



  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Evitar el envío del formulario por defecto
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      fetch('http://localhost:3000/login', { // Cambia a tu URL del backend si es diferente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Abre el panel de usuario en una nueva ventana
          window.open('panel.html', '_blank'); // Cambia 'panel.html' por la ruta a tu panel de usuario
        } else {
          document.getElementById('result').innerText = data.message;
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
