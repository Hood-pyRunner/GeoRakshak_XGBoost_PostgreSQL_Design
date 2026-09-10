const regions = [
  { name: "Assam", center: [26.2, 92.9], risk: "moderate", coverage: 72, rainfall: 54 },
  { name: "Arunachal Pradesh", center: [28.2, 94.7], risk: "high", coverage: 48, rainfall: 81 },
  { name: "Meghalaya", center: [25.5, 91.3], risk: "high", coverage: 68, rainfall: 86 },
  { name: "Manipur", center: [24.7, 93.9], risk: "moderate", coverage: 55, rainfall: 63 },
  { name: "Mizoram", center: [23.3, 92.8], risk: "high", coverage: 45, rainfall: 74 },
  { name: "Nagaland", center: [26.1, 94.5], risk: "moderate", coverage: 51, rainfall: 60 },
  { name: "Tripura", center: [23.8, 91.3], risk: "low", coverage: 77, rainfall: 39 },
  { name: "Sikkim", center: [27.6, 88.5], risk: "high", coverage: 62, rainfall: 78 }
];

const advisories = [
  { area: "East Khasi Hills", state: "Meghalaya", level: "high", detail: "Heavy rainfall signal · Check local routes", time: "12 min ago" },
  { area: "Tawang", state: "Arunachal Pradesh", level: "moderate", detail: "Slope movement watch · Stay informed", time: "38 min ago" },
  { area: "Aizawl outskirts", state: "Mizoram", level: "moderate", detail: "Saturated soil signal · Avoid cut slopes", time: "1 hr ago" }
];

const colors = { low: "#2ca25f", moderate: "#fec44f", high: "#de2d26" };
const boundaryUrl = "https://code.highcharts.com/mapdata/countries/in/in-all.geo.json";
const northeastStateCodes = new Set(["IN-AR", "IN-AS", "IN-MN", "IN-ML", "IN-MZ", "IN-NL", "IN-SK", "IN-TR"]);
let map;
let markers = [];
let zones = [];
let labels = [];
let stateLayer;

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3500);
}

function renderAdvisories() {
  document.querySelector("#alert-list").innerHTML = advisories.map((item) => `
    <article class="alert-item">
      <span class="dot ${item.level}" aria-label="${item.level} risk"></span>
      <div><b>${item.area}</b><p>${item.detail}</p></div>
      <time>${item.time}</time>
    </article>
  `).join("");
}

function renderCoverage() {
  document.querySelector("#coverage-bars").innerHTML = regions.map((region) => `
    <div class="bar-wrap" title="${region.name}: ${region.coverage}%">
      <div class="bar ${region.coverage > 60 ? "hot" : ""}" style="height:${Math.max(18, region.coverage * 0.55)}px"></div>
      <span>${region.name.replace(" Pradesh", "").replace("Arunachal", "Arun.")}</span>
    </div>
  `).join("");
}

function renderMap(mode = "landslide") {
  markers.forEach((marker) => marker.remove());
  labels.forEach((label) => label.remove());
  zones = [];
  labels = [];
  if (stateLayer) stateLayer.remove();
  markers = regions.map((region) => {
    const value = mode === "rainfall" ? region.rainfall : region.risk;
    const risk = mode === "rainfall"
      ? (value > 70 ? "high" : value > 45 ? "moderate" : "low")
      : value;
    const label = L.marker(region.center, {
      interactive: false,
      icon: L.divIcon({
        className: "map-region-label",
        html: `<span>${region.name}</span>`,
        iconSize: [110, 20],
        iconAnchor: [55, 10]
      })
    }).addTo(map);
    labels.push(label);
    const marker = L.circleMarker(region.center, {
      radius: risk === "high" ? 17 : 13,
      color: "#fff",
      weight: 2,
      fillColor: colors[risk],
      fillOpacity: 0.88
    }).addTo(map);
    marker.bindPopup(`<strong>${region.name}</strong><br>${mode === "rainfall" ? `${region.rainfall}% rainfall signal` : `${risk} susceptibility`}<br><small>Prototype signal · verify with local authorities</small>`);
    return marker;
  });
  document.querySelector("#legend-title").textContent = mode === "rainfall" ? "Rainfall signal" : "Susceptibility";
  if (window.northeastGeoJson) {
    stateLayer = L.geoJSON(window.northeastGeoJson, {
      style: (feature) => {
        const region = regions.find((item) => item.name === feature.properties.name);
        const value = mode === "rainfall" ? region.rainfall : region.risk;
        const risk = mode === "rainfall"
          ? (value > 70 ? "high" : value > 45 ? "moderate" : "low")
          : value;
        return {
          color: "#ffffff",
          weight: 1,
          fillColor: colors[risk],
          fillOpacity: 0.58
        };
      },
      onEachFeature: (feature, layer) => {
        const region = regions.find((item) => item.name === feature.properties.name);
        layer.bindTooltip(`${region.name} - ${mode === "rainfall" ? `${region.rainfall}% rainfall signal` : `${region.risk} susceptibility`}`, { sticky: true });
      }
    }).addTo(map);
    stateLayer.bringToBack();
  }
}

function initializeMap() {
  map = L.map("map", { zoomControl: true, minZoom: 4, maxZoom: 12 }).setView([25.8, 92.2], 6);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri",
    maxZoom: 19
  }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  renderMap();
  fetch(boundaryUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Boundary request failed with ${response.status}`);
      return response.json();
    })
    .then((data) => {
      window.northeastGeoJson = {
        type: "FeatureCollection",
        features: data.features.filter((feature) => northeastStateCodes.has(feature.properties["iso3166-2"]))
      };
      renderMap(document.querySelector("#hazard").value);
    })
    .catch(() => showToast("State boundaries could not be loaded. Check your internet connection."));
}

document.addEventListener("DOMContentLoaded", () => {
  renderAdvisories();
  renderCoverage();
  initializeMap();

  document.querySelector("#hazard").addEventListener("change", (event) => {
    renderMap(event.target.value);
    showToast(`${event.target.options[event.target.selectedIndex].text} layer enabled`);
  });

  document.querySelectorAll("[data-map-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.mapAction;
      if (action === "zoom-in") map.zoomIn();
      if (action === "zoom-out") map.zoomOut();
      if (action === "locate") map.setView([25.8, 92.2], 6);
    });
  });

  document.querySelector("[data-action='view-alerts']").addEventListener("click", () => {
    document.querySelector("#alerts").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelector("[data-action='join']").addEventListener("click", () => {
    document.querySelector("#phone").focus();
    document.querySelector("#signup").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelector("#alert-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone")).trim();
    const email = String(data.get("email")).trim();
    if (!phone && !email) {
      showToast("Enter a phone number or email address.");
      return;
    }
    if (phone && !/^[+0-9 ()-]{10,}$/.test(phone)) {
      showToast("Please enter a valid phone number.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.");
      return;
    }
    showToast("You're registered for prototype alerts.");
    event.currentTarget.reset();
  });
  document.querySelector("#evidence-files").addEventListener("change", (event) => {
    const files = [...event.target.files];
    document.querySelector("#file-list").textContent = files.length
      ? files.map((file) => `${file.name} (${Math.ceil(file.size / 1024 / 1024)} MB)`).join(" · ")
      : "No files selected";
  });
  document.querySelector("#evidence-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const files = document.querySelector("#evidence-files").files;
    if (!files.length) {
      showToast("Choose at least one photo or video.");
      return;
    }
    if ([...files].some((file) => file.size > 50 * 1024 * 1024)) {
      showToast("Each file must be smaller than 50 MB.");
      return;
    }
    showToast("Evidence added to the local prototype queue.");
    event.currentTarget.reset();
    document.querySelector("#file-list").textContent = "No files selected";
  });
});
