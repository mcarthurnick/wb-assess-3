
import axios from "axios";

const fossilButton = document.getElementById('get-random-fossil')

fossilButton.addEventListener('click', () => {
    axios.get(`/random-fossil.json`)
    .then((response) => {
       document.getElementById('random-fossil-image').innerHTML = 
       `
       <img src="${response.data.img}" />
       `
       document.getElementById('random-fossil-name').innerHTML =
       `
       ${response.data.name}
       `
})
    .catch((error) => {
    console.log('error', error)
})
  
})