/* Elements */
const cross = [...document.querySelectorAll(".cross")]

const cityValue = document.querySelector("#cityVal")
const cityBtn = document.querySelector("#searchBtn")

const searchBar = document.querySelector(".searchBar")
const closeBox = document.querySelector(".closeBox")
const searchImg = document.querySelector("#searchImg")

searchBar.addEventListener("mouseenter", ()=>{
    closeBox.style = "opacity: 1"
})
searchBar.addEventListener("mouseleave", ()=>{
    closeBox.style = "opacity: 0"
})

let isClose = false

cross.map(x=>{
    x.addEventListener("click", (e)=>{
        if(!isClose){
            closeBox.classList.add("reduced")
            closeBox.classList.remove("maximized")
            isClose = true;
                cityValue.style = "opacity: 0"
                searchImg.src = "maximize.png"
                searchBar.classList.add("searchReduced")
                searchBar.classList.remove("searchMaximized")
            }else{
                isClose = false
                closeBox.classList.add("maximized")
                closeBox.classList.remove("reduced")
                searchBar.classList.add("searchMaximized")
                searchBar.classList.remove("searchReduced")
                cityValue.style = "opacity: 1; transition: opacity 1s"
                searchImg.src = "reduce.png"
        }
    })
})

const setText=(e)=>{
    let date = e.current_condition.date
    date = date.split(".")
    date = date.join("/")
    
    let city = cityValue.value
    city = city.toLowerCase()
    city = city.split("")
    city[0] = city[0].toUpperCase()
    city = city.join("")

    let compo = document.createElement("div")
    compo.innerHTML = 
        `<div class="cityContainer">`+
        `<div class="cityTitle">`+
        `    <span id="cityName">${city}</span>`+
        `    <span id="cityDate">${date}</span>`+
        `</div>`+
        `<div class="cityInfos">`+
        `    <ul>`+
        `        <li>`+
        `            <div class="img">`+
        `                <img src="cloud.png">`+
        `            </div>`+
        `            <span id="currentTime">${e.current_condition.condition}</span>`+
        `        </li>`+
        `        <li>`+
        `            <div class="img">`+
        `                <img src="temp.png">`+
        `            </div>`+
        `            <span id="currentTemp">${e.current_condition.tmp} °C</span>`+
        `        </li>`+
        `        <li>`+
        `            <div class="img">`+
        `                <img src="humidity.png">`+
        `            </div>`+
        `            <span id="currentHum">${e.current_condition.humidity} %</span>`+
        `        </li>`+
        `        <li>`+
        `            <div class="img">`+
        `                <img src="pressure.png">`+
        `            </div>`+
        `            <span id="currentPres">${e.current_condition.pressure} hPa</span>`+
        `        </li>`+
        `    </ul>`+
        `</div>`+
        `<div class="cityCross cross">`+
        `    <img src="cross.png" alt="">`+
        `</div>`+
        `</div>`

        compo.classList.add("dragger")
        compo.style = "position: absolute"

        let crossElm = compo.querySelector(".cross")
        crossElm.addEventListener("click", (e)=>{
            if(e.target.tagName != "IMG") e.target.parentNode.remove()
            else e.target.parentNode.parentNode.remove()
        })
        compo.addEventListener("mouseenter", ()=>{
            crossElm.style = "opacity: 1"
        })
        compo.addEventListener("mouseleave", ()=>{
            crossElm.style = "opacity: 0"
        })

    document.body.appendChild(compo)
    compo.addEventListener('mousedown', e => dragStart(e, compo));
}

cityBtn.addEventListener("click", (e)=>{
    fetch(`https://www.prevision-meteo.ch/services/json/${cityValue.value}`)
    .then(e=>e.json())
    .then(e=>{
        setText(e)
        cityValue.value = ""
    })
    .catch(err=>{
        dep = prompt("De quel département parlez-vous ?")
        fetch(`https://www.prevision-meteo.ch/services/json/${cityValue.value}-${dep}`)
        .then(e=>e.json())
        .then(e=>{setText(e);    cityValue.value = ""})
        .catch(e=>alert("La ville n'existe pas !"))
    })
})

/* Drag event */
const el = [...document.querySelectorAll('.dragger')]

function dragStart(e, x) {
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);

    let initialX = e.clientX; 
    let initialY = e.clientY;

    function drag(e) {
        let currentX = initialX - e.clientX;
        let currentY = initialY - e.clientY;

        const rect =  x.getBoundingClientRect();
         x.style.left = rect.left - currentX + "px";
         x.style.top = rect.top - currentY + "px";

        initialX = e.clientX;
        initialY = e.clientY;
    }

    function dragEnd() {
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragEnd);
    }
}

el.map(x => {
    x.addEventListener('mousedown', e => dragStart(e, x));
})