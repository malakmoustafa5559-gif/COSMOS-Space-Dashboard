
let a = document.querySelector('[data-section="today-in-space"]');
let b = document.querySelector('[data-section="launches"]');
let c = document.querySelector('[data-section="planets"]');
let d = document.querySelector("#today-in-space");
let e = document.querySelector("#launches");
let f = document.querySelector("#planets");
let g = document.querySelector("#apod-date-input");
let h = document.querySelector("#load-date-btn");
let i = document.querySelector("#today-apod-btn");
let j = g.value || new Date().toISOString().split("T")[0];
let k = document.querySelectorAll(".nav-link");
let l = document.querySelectorAll(".app-section");

g.setAttribute("max", j);
g.nextElementSibling.innerHTML = formatDateValue(j);
g.addEventListener("change", (m) => {
  j = m.target.value;
  g.nextElementSibling.innerHTML = formatDateValue(j);
});

if (j === "2025-12-25") {
  j = "2025-12-17";
  g.value = j;
  g.nextElementSibling.innerHTML = formatDateValue(j);
}

i.addEventListener("click", () => {
  j = new Date().toISOString().split("T")[0];
  g.value = j;
  g.nextElementSibling.innerHTML = formatDateValue(j);
  getTodayPhoto(j);
});

h.addEventListener("click", () => {
  getTodayPhoto(j);
});


function formatDateValue(n) {
  const [o, p, q] = n.split("-").map(Number);
  const r = new Date(o, p - 1, q);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(r);
}

document.addEventListener("DOMContentLoaded", () => {
  getTodayPhoto(j);
  getPlanets();
  getLaunches();
});

for (const s of k) {
  s.addEventListener("click", () => {
    let t = s.getAttribute("data-section");
    for (const u of l) {
      u.classList.toggle("hidden", u.id !== t);
      if (u.classList.contains("hidden")) {
        s.classList.remove("bg-blue-500/10", "text-blue-400");
        s.classList.add("text-slate-300", "hover:bg-slate-800");
      } else {
        s.classList.add("bg-blue-500/10", "text-blue-400");
        s.classList.remove("text-slate-300", "hover:bg-slate-800");
      }
    }
    for (const v of k) {
      v.classList.remove("bg-blue-500/10", "text-blue-400");
      v.classList.add("text-slate-300", "hover:bg-slate-800");
    }
    s.classList.add("bg-blue-500/10", "text-blue-400");
    s.classList.remove("text-slate-300", "hover:bg-slate-800");
  });
}

async function getTodayPhoto(w) {
  try {
    const x = await fetch(`https://api.nasa.gov/planetary/apod?api_key=81YEX8ibz5aKLJZzHayiRHa2WQQAWZfk5wfH4coV&date=${w}`);
    const y = await x.json();
    displayTodayPhoto(y);
  } catch (z) {
    displayTodayPhoto(false);
  }
}

let aa = null;
let ab = false;

// Launches
async function getLaunches() {
  if (aa) {
    displayLaunches(aa);
    return;
  }
  if (ab) return;
  ab = true;
  try {
    const ac = "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10";
    const ad = await fetch(ac);
    if (ad.status === 429) {
      console.warn("Rate limited (429). Try again later.");
      displayLaunches([]);
      return;
    }
    if (!ad.ok) {
      throw new Error(`HTTP ${ad.status} ${ad.statusText}`);
    }
    const ae = await ad.json();
    const af = ae ? ae.results : [];
    aa = af;
    displayLaunches(af);
  } catch (ag) {
    console.error("getLaunches error:", ag);
  } finally {
    ab = false;
  }
}

// Launches Display
function displayLaunches(ah) {
  if (!ah || ah.length === 0) return;
  let ai = Array.from(ah);
  let aj = ai.slice(0, 1);
  let ak = ai.slice(1);
  for (const al of aj) {
    let am = document.createElement("div");
    am.classList.add("relative", "bg-slate-800/30", "border", "border-slate-700", "rounded-3xl", "overflow-hidden", "group", "hover:border-blue-500/50", "transition-all");
    am.innerHTML = `
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">Go</span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">${al.name}</h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${al.launch_service_provider.name}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${al.rocket.configuration.name}</span>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i>
                  Launch Date
                </p>
                <p class="font-semibold">${formatDateValue(al.net.split("T")[0])}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i>
                  Launch Time
                </p>
                <p class="font-semibold">${al.net.split("T")[1].split("Z")[0]} UTC</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  Location
                </p>
                <p class="font-semibold text-sm">${al.pad.location.name}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i>
                  Country
                </p>
                <p class="font-semibold">${al.pad.country.name}</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6">${al.mission.description || "No mission description available."}</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div id="main-launches" class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            <img class="w-full h-full object-cover" src="${al.image.image_url}" alt="${al.name}"/>
          </div>
        </div>
      </div>
    `;
    document.querySelector("#featured-launch").innerHTML = "";
    document.querySelector("#featured-launch").appendChild(am);
  }
  document.querySelector("#launches-grid").innerHTML = "";
  for (const an of ak) {
    let ao = document.createElement("div");
    ao.classList.add("bg-slate-800/50", "border", "border-slate-700", "rounded-2xl", "overflow-hidden", "hover:border-blue-500/30", "transition-all", "group", "cursor-pointer");
    ao.innerHTML = `
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform" src="${an.image ? an.image.image_url : "../../assets/images/flying-rocket-background_1270-85.avif"}" alt="${an.name}"/>
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">Go</span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">${an.name}</h4>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <i class="fas fa-building text-xs"></i>
            ${an.launch_service_provider.name}
          </p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-calendar text-slate-500 w-4"></i>
            <span class="text-slate-300">${formatDateValue(an.net.split("T")[0])}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-clock text-slate-500 w-4"></i>
            <span class="text-slate-300">${an.net.split("T")[1]} UTC</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-rocket text-slate-500 w-4"></i>
            <span class="text-slate-300">${an.rocket.configuration.name}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
            <span class="text-slate-300 line-clamp-1">${an.pad.location.name}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
          <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>
          <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;
    document.querySelector("#launches-grid").appendChild(ao);
  }
}

// Planet API
function getPlanets() {
  fetch("https://solar-system-opendata-proxy.vercel.app/api/planets")
    .then((ap) => ap.json())
    .then((aq) => {
      displayPlanets(aq.bodies);
    });
}


function displayTodayPhoto(ar) {
  let as = document.querySelector("#apod-image");
  let at = document.querySelector("#apod-title");
  let au = document.querySelector("#apod-date-detail");
  let av = document.querySelector("#apod-date-info");
  let aw = document.querySelector("#apod-explanation");
  let ax = document.querySelector("#apod-copyright");
  let ay = document.querySelector("#apod-media-type");
  let az = document.querySelector("#apod-date");
  az.innerHTML = `Astronomy Picture of the Day - ${formatDateValue(j)}`;
  as.setAttribute("src", ar.url);
  at.innerHTML = ar.title;
  au.innerHTML = ar.date;
  av.innerHTML = ar.date;
  aw.innerHTML = ar.explanation;
  ax.innerHTML = `&copy; ${ar.copyright ? ar.copyright : "Apod NASA"}`;
  ay.innerHTML = ar.media_type;
}

let ba = [];
let bb;

// Planets Details
function displayPlanets(bc) {
  let bd = document.querySelector("#planets-grid");
  let be = document.querySelector("#planet-comparison-tbody");
  ba = bc;
  bd.innerHTML = "";
  be.innerHTML = "";
  displayEarthDetails();
  for (const bf of bc) {
    let bg = document.createElement("div");
    let bh, bi;
    switch (bf.englishName.trim().toLowerCase()) {
      case "mercury":
        bh = "#eab308";
        bi = "Terrestrial";
        break;
      case "venus":
        bh = "#f97316";
        bi = "Terrestrial";
        break;
      case "earth":
        bh = "#3b82f6";
        bi = "Terrestrial";
        break;
      case "mars":
        bh = "#ef4444";
        bi = "Terrestrial";
        break;
      case "jupiter":
        bh = "#fb923c";
        bi = "Gas Giant";
        break;
      case "saturn":
        bh = "#facc15";
        bi = "Gas Giant";
        break;
      case "uranus":
        bh = "#06b6d4";
        bi = "Ice Giant";
        break;
      case "neptune":
        bh = "#2563eb";
        bi = "Ice Giant";
        break;
    }
    bg.classList.add("planet-card", "bg-slate-800/50", "border", "border-slate-700", "rounded-2xl", "p-4", "transition-all", "cursor-pointer", "group");
    bg.setAttribute("data-planet-id", bf.englishName.toLowerCase());
    bg.setAttribute("style", "--planet-color: #eab308;");
    bg.setAttribute("onmouseover", `this.style.borderColor = "${bh}";`);
    bg.setAttribute("onmouseout", 'this.style.borderColor = "#334155";');
    bg.innerHTML = `
      <div class="relative mb-3 h-24 flex items-center justify-center">
        <img class="w-20 h-20 object-contain group-hover:scale-110 transition-transform" src="${bf.image}" alt="${bf.englishName}"/>
      </div>
      <h4 class="font-semibold text-center text-sm">${bf.englishName}</h4>
      <p class="text-xs text-slate-400 text-center">${(bf.semimajorAxis / 149597870.7).toFixed(2) + " AU"}</p>
    `;
    bg.addEventListener("click", () => {
      let bj = bg.getAttribute("data-planet-id").trim().toLowerCase();
      displayPlanetsDetails(bj);
    });
    bd.appendChild(bg);
    let bk = document.createElement("tr");
    bk.innerHTML = `
      <tr class="hover:bg-slate-800/30 transition-colors">
        <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
          <div class="flex items-center space-x-2 md:space-x-3">
            <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${bh}"></div>
            <span class="font-semibold text-sm md:text-base whitespace-nowrap">${bf.englishName}</span>
          </div>
        </td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${(bf.semimajorAxis / 149597870.7).toFixed(2)} AU</td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${bf.meanRadius * 2}</td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${((bf.mass.massValue * Math.pow(10, bf.mass.massExponent)) / 5.97237e24).toFixed(2) + " Earths"}</td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${(bf.sideralOrbit / 365.25).toFixed(2)} Years</td>
        <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">${bf.moons ? bf.moons.length : "0"}</td>
        <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
          <span style="background-color: ${bh}; color: white;" class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200">${bi}</span>
        </td>
      </tr>
    `;
    be.appendChild(bk);
  }
}

function displayPlanetsDetails(bl) {
  let bm = ba.find((bn) => bn.englishName.toLowerCase() === bl);
  let bo = {
    planetDistance: document.querySelector("#planet-distance"),
    planetMass: document.querySelector("#planet-mass"),
    planetDensity: document.querySelector("#planet-density"),
    planetRadius: document.querySelector("#planet-radius"),
    planetOrbitalPeriod: document.querySelector("#planet-orbital-period"),
    planetRotation: document.querySelector("#planet-rotation"),
    planetMoons: document.querySelector("#planet-moons"),
    planetGravity: document.querySelector("#planet-gravity"),
  };
  let bp = {
    planetDiscoverer: document.querySelector("#planet-discoverer"),
    planetDiscoveryDate: document.querySelector("#planet-discovery-date"),
    planetBodyType: document.querySelector("#planet-body-type"),
    planetVolume: document.querySelector("#planet-volume"),
  };
  let bq = {
    planetPerihelion: document.querySelector("#planet-perihelion"),
    planetAphelion: document.querySelector("#planet-aphelion"),
    planetEccentricity: document.querySelector("#planet-eccentricity"),
    planetInclination: document.querySelector("#planet-inclination"),
    planetAxialTilt: document.querySelector("#planet-axial-tilt"),
    planetTemperature: document.querySelector("#planet-temp"),
    planetEscape: document.querySelector("#planet-escape"),
  };
  document.querySelector("#planet-detail-image").setAttribute("src", bm.image);
  document.querySelector("#planet-detail-name").innerHTML = bm.englishName;
  document.querySelector("#planet-detail-description").innerHTML = bm.description;
  bo.planetDistance.innerHTML = (bm.semimajorAxis / 149597870.7).toFixed(1) + "M KM";
  bo.planetMass.innerHTML = bm.mass.massValue + " x 10^" + bm.mass.massExponent + " KG";
  bo.planetDensity.innerHTML = bm.density;
  bo.planetRadius.innerHTML = bm.equaRadius + " KM";
  bo.planetOrbitalPeriod.innerHTML = bm.sideralOrbit + " DAYS";
  bo.planetRotation.innerHTML = bm.sideralRotation + " HOURS";
  bo.planetMoons.innerHTML = bm.moons ? bm.moons.length : "0";
  bo.planetGravity.innerHTML = bm.gravity;
  bp.planetBodyType.innerHTML = bm.bodyType;
  bp.planetDiscoverer.innerHTML = bm.discoveredBy ? bm.discoveredBy : "Known since antiquity";
  bp.planetDiscoveryDate.innerHTML = bm.discoveryDate ? bm.discoveryDate : "Ancient times";
  bp.planetVolume.innerHTML = bm.vol.volValue + " x10^" + bm.vol.volExponent + " km³";
  let br = document.querySelector("#planet-facts");
  br.innerHTML = `
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Mass: ${bm.mass.massValue} x 10^${bm.mass.massExponent} KG</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Surface gravity: ${bm.gravity}</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Density: ${bm.density}</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Axial tilt: ${bm.axialTilt}°</span>
    </li>
  `;
  bq.planetPerihelion.innerHTML = (bm.perihelion / 149597870.7).toFixed(2) + " AU";
  bq.planetAphelion.innerHTML = (bm.aphelion / 149597870.7).toFixed(2) + " AU";
  bq.planetEccentricity.innerHTML = bm.eccentricity;
  bq.planetInclination.innerHTML = bm.inclination + "°";
  bq.planetAxialTilt.innerHTML = bm.axialTilt + "°";
  bq.planetTemperature.innerHTML = bm.avgTemp + " K";
  bq.planetEscape.innerHTML = bm.escape + " m/s";
}

// Earth Details
function displayEarthDetails() {
  let bs = ba.find((bt) => bt.englishName.toLowerCase().trim() === "earth");
  let bu = {
    planetDistance: document.querySelector("#planet-distance"),
    planetMass: document.querySelector("#planet-mass"),
    planetDensity: document.querySelector("#planet-density"),
    planetRadius: document.querySelector("#planet-radius"),
    planetOrbitalPeriod: document.querySelector("#planet-orbital-period"),
    planetRotation: document.querySelector("#planet-rotation"),
    planetMoons: document.querySelector("#planet-moons"),
    planetGravity: document.querySelector("#planet-gravity"),
  };
  let bv = {
    planetDiscoverer: document.querySelector("#planet-discoverer"),
    planetDiscoveryDate: document.querySelector("#planet-discovery-date"),
    planetBodyType: document.querySelector("#planet-body-type"),
    planetVolume: document.querySelector("#planet-volume"),
  };
  let bw = {
    planetPerihelion: document.querySelector("#planet-perihelion"),
    planetAphelion: document.querySelector("#planet-aphelion"),
    planetEccentricity: document.querySelector("#planet-eccentricity"),
    planetInclination: document.querySelector("#planet-inclination"),
    planetAxialTilt: document.querySelector("#planet-axial-tilt"),
    planetTemperature: document.querySelector("#planet-temp"),
    planetEscape: document.querySelector("#planet-escape"),
  };
  document.querySelector("#planet-detail-image").setAttribute("src", bs.image ? bs.image : "");
  document.querySelector("#planet-detail-name").innerHTML = bs.englishName;
  document.querySelector("#planet-detail-description").innerHTML = bs.description;
  bu.planetDistance.innerHTML = (bs.semimajorAxis / 149597870.7).toFixed(1) + "M KM";
  bu.planetMass.innerHTML = bs.mass.massValue + " x 10^" + bs.mass.massExponent + " KG";
  bu.planetDensity.innerHTML = bs.density;
  bu.planetRadius.innerHTML = bs.equaRadius + " KM";
  bu.planetOrbitalPeriod.innerHTML = bs.sideralOrbit + " DAYS";
  bu.planetRotation.innerHTML = bs.sideralRotation + " HOURS";
  bu.planetMoons.innerHTML = bs.moons ? bs.moons.length : "0";
  bu.planetGravity.innerHTML = bs.gravity;
  bv.planetBodyType.innerHTML = bs.bodyType;
  bv.planetDiscoverer.innerHTML = bs.discoveredBy ? bs.discoveredBy : "Known since antiquity";
  bv.planetDiscoveryDate.innerHTML = bs.discoveryDate ? bs.discoveryDate : "Ancient times";
  bv.planetVolume.innerHTML = bs.vol.volValue + " x10^" + bs.vol.volExponent + " km³";
  let bx = document.querySelector("#planet-facts");
  bx.innerHTML = `
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Mass: ${bs.mass.massValue} x 10^${bs.mass.massExponent} KG</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Surface gravity: ${bs.gravity}</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Density: ${bs.density}</span>
    </li>
    <li class="flex items-start">
      <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
      <span class="text-slate-300">Axial tilt: ${bs.axialTilt}°</span>
    </li>
  `;
  bw.planetPerihelion.innerHTML = (bs.perihelion / 149597870.7).toFixed(2) + " AU";
  bw.planetAphelion.innerHTML = (bs.aphelion / 149597870.7).toFixed(2) + " AU";
  bw.planetEccentricity.innerHTML = bs.eccentricity;
  bw.planetInclination.innerHTML = bs.inclination + "°";
  bw.planetAxialTilt.innerHTML = bs.axialTilt + "°";
  bw.planetTemperature.innerHTML = bs.avgTemp + " K";
  bw.planetEscape.innerHTML = bs.escape + " m/s";
}