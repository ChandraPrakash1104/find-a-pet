mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: adoptable.geometry.coordinates,
    zoom: 10 
});

new mapboxgl.Marker()
    .setLngLat(adoptable.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${adoptable.title}</h3><p>${adoptable.location}</p>`
            )
    )
    .addTo(map) 

