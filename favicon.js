fetch("FAVICONS/icons.json")
    .then(response => response.json())
    .then(icons => {

        if (!Array.isArray(icons) || icons.length === 0) {
            return;
        }

        const randomIcon =
            icons[Math.floor(Math.random() * icons.length)];

        const favicon = document.createElement("link");

        favicon.rel = "icon";
        favicon.type = "image/png";
        favicon.href = "FAVICONS/" + randomIcon + "?v=" + Math.random();

        document.head.appendChild(favicon);
    })
    .catch(error => {
        console.error("Error loading PSDX favicons:", error);
    });