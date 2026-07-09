if (typeof mapToken !== "undefined" && mapToken) {
    mapboxgl.accessToken = mapToken;

    new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [77.209, 28.6139],
        zoom: 9,
    });
} else {
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
        mapContainer.innerHTML = '<div class="alert alert-secondary">Map token is not configured.</div>';
    }
}
