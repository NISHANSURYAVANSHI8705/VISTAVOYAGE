// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;

// const coordinates = JSON.parse(mapCoordinates);
// console.log('Map coordinates:', coordinates);

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',    
    // center: coordinates,
    center: listing.geometry.coordinates,
    zoom: 12
});

// const marker = new mapboxgl.Marker({color:"red"})
//     .setLngLat(coordinates)
//     .setPopup(new mapboxgl.Popup({offset: 25})
//     .setHTML("<p>Exact location provided after booking</p>")
//     .addTo(map));

// const marker = new mapboxgl.Marker({ color: "red" }) // Marker create karna
//     .setLngLat(listing.geometry.coordinates) // Listing ke coordinates set karna
//     .setPopup(
//         new mapboxgl.Marker())
//     .setHTML(
//             `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
//         )
    
// .addTo(map); // Map par add karna
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Popup object create karna
        .setHTML(
            `<h4>${listing.title}</h4><p>Exact location provided after booking</p>`
        ) // setHTML yahan aayega
    )
    .addTo(map);