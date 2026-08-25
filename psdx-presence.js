/* ==================================================
   PSDX WORLD — USER PRESENCE
================================================== */

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onDisconnect,
    onValue,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


/* ==================================================
   FIREBASE
================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyCgltcJmKz4CuhTrNm5McWzGRP5dsAFLfU",

    authDomain:
        "psdx-world.firebaseapp.com",

    databaseURL:
        "https://psdx-world-default-rtdb.firebaseio.com",

    projectId:
        "psdx-world",

    storageBucket:
        "psdx-world.firebasestorage.app",

    messagingSenderId:
        "771773374810",

    appId:
        "1:771773374810:web:c511db7d1662b90e3d9363"

};


/* ==================================================
   INICIALIZAR / REUTILIZAR FIREBASE
================================================== */

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp(firebaseConfig);


const db =
    getDatabase(app);


/* ==================================================
   OBTENER ID DEL DISPOSITIVO
================================================== */

function obtenerDeviceID(){

    let id =
        localStorage.getItem(
            "PSDX_DEVICE_ID"
        );


    /*
       Si este dispositivo nunca
       había entrado a PSDX,
       creamos un ID nuevo.
    */

    if(!id){

        id =
            crypto.randomUUID();

        localStorage.setItem(
            "PSDX_DEVICE_ID",
            id
        );

    }


    return id;

}


const deviceID =
    obtenerDeviceID();


/* ==================================================
   REFERENCIA DEL DISPOSITIVO
================================================== */

const deviceRef =
    ref(
        db,
        "online/" + deviceID
    );


/* ==================================================
   REGISTRAR DESCONEXIÓN
================================================== */

/*
   Firebase ejecutará esto automáticamente
   cuando esta conexión desaparezca.
*/

onDisconnect(
    deviceRef
)
.remove();


/* ==================================================
   REGISTRAR DISPOSITIVO ONLINE
================================================== */

set(
    deviceRef,
    {

        online: true,

        lastSeen:
            serverTimestamp()

    }
);


/* ==================================================
   CONTADOR DE USUARIOS
================================================== */

/*
   Esta función puede utilizarse
   posteriormente desde index.html
   para mostrar el número de
   dispositivos conectados.
*/

const onlineRef =
    ref(
        db,
        "online"
    );


onValue(
    onlineRef,
    snapshot=>{

        const datos =
            snapshot.val();


        if(!datos){

            window.PSDX_USERS_ONLINE = 0;

            window.dispatchEvent(
                new CustomEvent(
                    "psdx-users-online",
                    {
                        detail:{
                            count:0
                        }
                    }
                )
            );

            return;

        }


        const usuarios =
            Object.keys(
                datos
            ).length;


        window.PSDX_USERS_ONLINE =
            usuarios;


        /*
           Evento personalizado para
           que cualquier HTML pueda
           reaccionar al cambio.
        */

        window.dispatchEvent(
            new CustomEvent(
                "psdx-users-online",
                {
                    detail:{
                        count:usuarios
                    }
                }
            )
        );

    }
);