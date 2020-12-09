const d= document, $cards = d.querySelector(".cards"), $template = d.getElementById("card-template").content,
     $fragmente = d.createDocumentFragment(), $edit = d.querySelector(".edit"), $buscador = d.querySelector(".buscar"),
     $imgView = d.querySelector(".img"), $imgUploadInput = d.querySelector("#img-upload"),
     $formHeroe = d.querySelector("#form-heroe"), CLOUDINARY_UPLOAD_PRESET = "cu5esrwp",
     $loader = d.querySelector(".loader"),
     CLOUDINARY_URL ="https://api.cloudinary.com/v1_1/srquad/image/upload",
     urlImgs = "https://res.cloudinary.com/srquad/image/upload/v1606613101/";

const ajax = (options) =>{
     let {url, method, succes, error, data} = options;

     //console.log(url, method, data);
     
     const xhr = new XMLHttpRequest();

     xhr.addEventListener("readystatechange", (e)=>{
          if (xhr.readyState !== 4) return;

          if (xhr.status >= 200 && xhr.status < 300) {       
               if (xhr.responseText) {
                    let json = JSON.parse(xhr.responseText);
                    succes(json);
               }else{
                    succes();
               }                
          }else{
               let message = xhr.statusText || "ocurrio un error";
               error(`Error: ${xhr.status},  ${message}`);
          }
     });

     xhr.open(method || "GET", url);
     //xhr.open("GET", "assets/users.json");
     xhr.setRequestHeader("content-type", "application/json; charset=utf-8");
     xhr.send(JSON.stringify(data));

}

const getAll = ()=>{
     ajax({
          method: "GET",
          url: "https://apiheroes.herokuapp.com/api/heroes",
          succes: (res) =>{
               res.forEach( el => {
                    //console.log(el);
                    $template.querySelector("img").setAttribute("src", el.img);
                    $template.querySelector(".card-title").textContent = el.nombre;
                    $template.querySelector(".card-text").textContent = el.casa;
                    $template.querySelector(".update").dataset.id = el.id_heroe;
                    $template.querySelector(".delete").dataset.id = el.id_heroe;
                    let $clone = d.importNode($template, true)
                    $fragmente.appendChild($clone);
               });
               $cards.appendChild($fragmente);
          },
          error: (err)=>{
               //console.error(err);
               $cards.insertAdjacentHTML("afterend", `<p style="color: white">${err}</p>`);
          }
     });
}

const getOne = (id) =>{
     ajax ({
          method: "GET",
          url: `https://apiheroes.herokuapp.com/api/heroes/${id}`,
          succes:(res)=>{
              $edit.classList.remove("none")
               $edit.querySelector(".img").src = res.img;
               $edit.querySelector(".casa").value= res.casa;
               $edit.querySelector(".nombre").value = res.nombre;
               $edit.querySelector(".bio").value = res.bio;
               $edit.querySelector(".fch").value = res.aparicion;
               $edit.querySelector(".save").dataset.id = res.id_heroe;
               $edit.querySelector(".save").dataset.action = "update";
               $edit.querySelector(".save").textContent = "update";
          },
          error:(err)=>{
              // console.error(err);
               alert( err);
          },
          data: null
     });
}

const save = (data)=>{
     ajax ({
          method: "POST",
          url: `https://apiheroes.herokuapp.com/api/heroes`,
          succes:(res)=>{
              //console.log(res);
               location.reload()
          },
          error:(err)=>{
              //console.error(err);
               alert( err);
          },
          data: data
     });
}

const update = (id, data)=>{
     ajax ({
          method: "PUT",
          url: `https://apiheroes.herokuapp.com/api/heroes`,
          succes:(res)=>{
               location.reload();
               //console.log(res);                           
          },
          error:(err)=>{
               //console.error(err);
               alert( err);
          },
          data: data
     });
}

const del = (id) =>{
     ajax ({
          method: "DELETE",
          url: `https://apiheroes.herokuapp.com/api/heroes/${id}`,
          succes:()=>{
               location.reload();
          },
          error:(err)=>{
               console.error(err);
               alert( err);
          }
     });
}

d.addEventListener("DOMContentLoaded", (e) =>{
     getAll();    
     d.addEventListener("keyup", (e)=>{
          if (e.target===$buscador) {
               const $cards = d.querySelectorAll("[data-card]");
               //console.log($cards);
               //console.clear();
               $cards.forEach(el=>{
                   if((el.querySelector(".card-body").textContent).toLowerCase().includes(e.target.value)){
                        el.classList.remove("none");                    
                   }else{
                        el.classList.add("none");
                   }
                   //el.textContent.toLowerCase().includes(e.target.value)
                   //     ?el.classList.remove("filtra")
                   //     :el.classList.add("filtra");
               })       
          }
     })
}) ;

 d.addEventListener("click" , (e)=>{
     //console.log(e.target);
     if (e.target.classList.contains("delete")) {
          e.preventDefault(); 
          let borrar = confirm("estas seguro que desas borrar esta tarjeta?");
          //alert("Estas seguro que deseas borrar");
          if (borrar) {
               del(e.target.dataset.id);     
          }          
     }else if (e.target.classList.contains("update")) {
          e.preventDefault();          
          getOne(e.target.dataset.id);                 
     }else if (e.target.classList.contains("add")) {
          e.preventDefault();
          $edit.classList.remove("none")
          $edit.querySelector(".save").dataset.action = "save";
          $edit.querySelector(".save").textContent = "save";
          $edit.querySelector(".img").src = "assets/img/non.jpg"
          $edit.querySelector(".casa").value= "";
          $edit.querySelector(".nombre").value = "";
          $edit.querySelector(".bio").value = "";
          $edit.querySelector(".fch").value = "";
          $edit.querySelector(".save").removeAttribute("data-id");
     }else if (e.target.classList.contains("cancel")) {
          e.preventDefault();
          $edit.classList.add("none")                
     }               
})

//metodo para subir una imagen a 
async function  uploadImg (file){         
     //console.log("subiendo img");          
     const formData = new FormData();
     formData.append("file", file);
     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
     const res = await axios.post(CLOUDINARY_URL, formData, {
          headers : {
               'content-type' : 'multipart/form-data'
          }
     });
     //console.log(res); 
     return res.data.secure_url;  
}
    

$formHeroe.addEventListener("submit", async (e)=>{    
     const imgFormats = ["image/jpg", "image/png", "image/gif", "image/jpeg"];    
     e.preventDefault();
     //console.log(e);
     const formData = new FormData(e.target), file = formData.get("img-upload"),
          data = {
               "nombre" : formData.get("nombre"),
               "casa" : formData.get("casa"),
               "bio" : formData.get("bio"),
               "aparicion" : formData.get("fch"),
               "img" : ""
           };
     //console.log(file);
     $loader.classList.remove("none");
     if (imgFormats.includes(file.type)) {          
          const res = await uploadImg(file);
          data.img = res;          
          //console.log(res);
     }else {
          console.warn("formato no valido");
          data.img = d.querySelector(".img").src;
     } 
     let action = e.target.querySelector(".save").dataset.action;
     //console.log(action);     
     if (action==="save") {
          save(data);
     }else if(action === "update"){
          let id = e.target.querySelector(".save").dataset.id;
          data.id_heroe = id;
          update(id, data);
     }
     $loader.classList.add("none");
});

//metodo para seleccionar una imagen
$imgUploadInput.addEventListener("change", async (e)=>{
     const imgFormats = ["image/jpg", "image/png", "image/gif", "image/jpeg"];
     if (e.target.files[0] ){
          let file = e.target.files[0];
          if(imgFormats.includes(file.type) ){
               let imgUrl = URL.createObjectURL(file);
               $imgView.src = imgUrl;
          }else{               
               console.log(e);
               console.log(e.target.files[0].type );
               console.log(e.target.files[0]);
               alert("debes seleccionar una imagen");
          }
     }
})
