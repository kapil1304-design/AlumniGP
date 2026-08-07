const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const storageKey = "crossroadsPrototypeState";
const mapsKey = window.CROSSROADS_CONFIG?.googleMapsApiKey || "";

const names = [
  "Aarav",
  "Nisha",
  "Zoya",
  "Kabir",
  "Meera",
  "Dev",
  "Riya",
  "Ishan",
  "Tara",
  "Neil",
  "Sara",
  "Ved",
];

const palette = ["#00c2a8", "#ff5c4d", "#ffd166", "#4361ee", "#8a4fff", "#171717"];
let nodes = [];
let links = [];
let time = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildNetwork(rect.width, rect.height);
}

function buildNetwork(width, height) {
  nodes = names.map((name, index) => {
    const angle = (Math.PI * 2 * index) / names.length;
    const ring = index % 3 === 0 ? 0.28 : index % 3 === 1 ? 0.38 : 0.47;
    return {
      name,
      x: width * 0.5 + Math.cos(angle) * width * ring * 0.78,
      y: height * 0.46 + Math.sin(angle) * height * ring,
      r: index % 4 === 0 ? 24 : 19,
      color: palette[index % palette.length],
      phase: Math.random() * Math.PI * 2,
    };
  });

  nodes.push({
    name: "You",
    x: width * 0.5,
    y: height * 0.45,
    r: 34,
    color: "#171717",
    phase: 0,
  });

  const center = nodes.length - 1;
  links = nodes
    .slice(0, -1)
    .map((_, index) => [center, index])
    .concat([
      [0, 3],
      [1, 5],
      [2, 7],
      [4, 9],
      [6, 10],
      [8, 11],
    ]);
}

function drawNode(node, index) {
  const bob = Math.sin(time * 0.018 + node.phase) * 6;
  const x = node.x;
  const y = node.y + bob;

  ctx.beginPath();
  ctx.arc(x, y, node.r + 9, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, node.r, 0, Math.PI * 2);
  ctx.fillStyle = node.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - node.r * 0.24, y - node.r * 0.26, node.r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  ctx.font = index === nodes.length - 1 ? "800 15px Inter" : "800 12px Inter";
  ctx.textAlign = "center";
  ctx.fillStyle = "#171717";
  ctx.fillText(node.name, x, y + node.r + 22);
}

function animate() {
  time += 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 1.6;
  links.forEach(([a, b], index) => {
    const start = nodes[a];
    const end = nodes[b];
    const pulse = (Math.sin(time * 0.024 + index) + 1) / 2;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y + Math.sin(time * 0.018 + start.phase) * 6);
    ctx.lineTo(end.x, end.y + Math.sin(time * 0.018 + end.phase) * 6);
    ctx.strokeStyle = `rgba(23, 23, 23, ${0.1 + pulse * 0.18})`;
    ctx.stroke();
  });

  nodes.forEach(drawNode);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();

const starterGroups = [
  {
    id: "st-xaviers-2012",
    institute: "St. Xavier's School",
    batch: "2012",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    locality: "Fort",
    type: "School",
    members: 42,
    approvalsRequired: 3,
  },
  {
    id: "iit-bombay-2018",
    institute: "IIT Bombay",
    batch: "2018",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    locality: "Powai",
    type: "College",
    members: 128,
    approvalsRequired: 3,
  },
  {
    id: "infosys-pune-2019",
    institute: "Infosys Pune",
    batch: "2019",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    locality: "Hinjewadi",
    type: "Workplace",
    members: 27,
    approvalsRequired: 3,
  },
];

const initialState = {
  user: null,
  profile: null,
  groups: starterGroups,
  memberships: ["st-xaviers-2012"],
  requests: [],
  recommendations: [],
};

let state = loadState();
let profileStep = 0;

function loadState() {
  try {
    return { ...initialState, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return initialState;
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildGroupId(institute, batch, city = "", locality = "") {
  return [institute, batch, city, locality].filter(Boolean).map(slugify).join("-");
}

function buildSchoolCommunityId(institute, city = "", locality = "") {
  return [institute, "school-community", city, locality].filter(Boolean).map(slugify).join("-");
}

function groupTitle(group) {
  const place = [group.locality, group.city].filter(Boolean).join(", ");
  return `${group.institute}${place ? `, ${place}` : ""} · ${group.batch}`;
}

function schoolAttendanceLabel(profile) {
  const start = [profile.schoolFromClass, profile.schoolFromYear].filter(Boolean).join(" in ");
  const end = [profile.schoolToClass, profile.schoolToYear].filter(Boolean).join(" in ");
  if (start && end) return `${start} to ${end}`;
  if (end) return `left/passed ${end}`;
  if (start) return `joined ${start}`;
  return "school attendance range can be added later";
}

function buildAffiliations(profile) {
  const affiliations = [
    {
      type: "School",
      institute: profile.school,
      batch: "All years",
      city: profile.schoolCity,
      locality: profile.schoolLocality,
      state: profile.schoolState,
      country: profile.schoolCountry,
      communityGroup: true,
      fromClass: profile.schoolFromClass,
      fromYear: profile.schoolFromYear,
      toClass: profile.schoolToClass,
      toYear: profile.schoolToYear,
      signal: `${schoolAttendanceLabel(profile)} · common school group${profile.bestFriend ? ` · friend signal: ${profile.bestFriend}` : ""}`,
    },
    {
      type: "College",
      institute: profile.college,
      batch: profile.collegeBatch,
      city: profile.collegeCity,
      locality: profile.collegeLocality,
      state: profile.collegeState,
      country: profile.collegeCountry,
      signal: "College, city, and batch matched from profile",
    },
    {
      type: "Workplace",
      institute: profile.workplace,
      batch: profile.workBatch,
      city: profile.workCity,
      locality: profile.workLocality,
      state: profile.workState,
      country: profile.workCountry,
      signal: "Workplace, city, and period matched from profile",
    },
  ];

  return affiliations.filter((item) => item.institute && item.batch);
}

function getJourneyAdvice(profile) {
  if (!profile) return "";
  if (profile.stage === "school-student") {
    return "School student journey: school/current-class circle only. College and company are optional future fields.";
  }
  if (profile.stage === "college-student") {
    return "College student journey: school and college circles are enough. Company can be added after internship or job.";
  }
  if (profile.stage === "alumni") {
    return "Alumni journey: school, college, and old workplace circles can be added over time.";
  }
  return "Professional journey: school, college, and workplace circles can all help with trust and discovery.";
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function parseAddressComponents(place) {
  const parts = {
    locality: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    formattedAddress: place.formatted_address || "",
    placeId: place.place_id || "",
    lat: "",
    lng: "",
  };

  if (place.geometry?.location) {
    parts.lat = place.geometry.location.lat();
    parts.lng = place.geometry.location.lng();
  }

  (place.address_components || []).forEach((component) => {
    const types = component.types || [];
    if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) {
      parts.locality = parts.locality || component.long_name;
    }
    if (types.includes("locality") || types.includes("postal_town")) {
      parts.city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      parts.state = component.long_name;
    }
    if (types.includes("country")) {
      parts.country = component.long_name;
    }
    if (types.includes("postal_code")) {
      parts.postalCode = component.long_name;
    }
  });

  return parts;
}

function setValue(id, value) {
  const input = document.getElementById(id);
  if (input && value) input.value = value;
}

function bindPlaceAutocomplete(inputId, targets = {}, options = {}) {
  const input = document.getElementById(inputId);
  if (!input || !window.google?.maps?.places) return;
  if (input.dataset.placesBound === "true") return;
  input.dataset.placesBound = "true";
  input.setAttribute("autocomplete", "off");

  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["address_components", "formatted_address", "geometry", "name", "place_id"],
    types: options.types || ["geocode"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const parts = parseAddressComponents(place);
    setValue(targets.locality, parts.locality || place.name);
    setValue(targets.city, parts.city);
    setValue(targets.state, parts.state);
    setValue(targets.country, parts.country);
  });
}

function initGooglePlaces() {
  bindPlaceAutocomplete("profileCountry", {
    country: "profileCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileState", {
    state: "profileState",
    country: "profileCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileCity", {
    city: "profileCity",
    state: "profileState",
    country: "profileCountry",
  }, { types: ["(cities)"] });
  bindPlaceAutocomplete("profileLocality", {
    locality: "profileLocality",
    city: "profileCity",
    state: "profileState",
    country: "profileCountry",
  });
  bindPlaceAutocomplete("profileSchoolCountry", {
    country: "profileSchoolCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileSchoolState", {
    state: "profileSchoolState",
    country: "profileSchoolCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileSchoolCity", {
    city: "profileSchoolCity",
    state: "profileSchoolState",
    country: "profileSchoolCountry",
  }, { types: ["(cities)"] });
  bindPlaceAutocomplete("profileSchoolLocality", {
    locality: "profileSchoolLocality",
    city: "profileSchoolCity",
    state: "profileSchoolState",
    country: "profileSchoolCountry",
  });
  bindPlaceAutocomplete("profileCollegeCountry", {
    country: "profileCollegeCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileCollegeState", {
    state: "profileCollegeState",
    country: "profileCollegeCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileCollegeCity", {
    city: "profileCollegeCity",
    state: "profileCollegeState",
    country: "profileCollegeCountry",
  }, { types: ["(cities)"] });
  bindPlaceAutocomplete("profileCollegeLocality", {
    locality: "profileCollegeLocality",
    city: "profileCollegeCity",
    state: "profileCollegeState",
    country: "profileCollegeCountry",
  });
  bindPlaceAutocomplete("profileWorkCountry", {
    country: "profileWorkCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileWorkState", {
    state: "profileWorkState",
    country: "profileWorkCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("profileWorkCity", {
    city: "profileWorkCity",
    state: "profileWorkState",
    country: "profileWorkCountry",
  }, { types: ["(cities)"] });
  bindPlaceAutocomplete("profileWorkLocality", {
    locality: "profileWorkLocality",
    city: "profileWorkCity",
    state: "profileWorkState",
    country: "profileWorkCountry",
  });
  bindPlaceAutocomplete("groupCountry", {
    country: "groupCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("groupState", {
    state: "groupState",
    country: "groupCountry",
  }, { types: ["(regions)"] });
  bindPlaceAutocomplete("groupCity", {
    city: "groupCity",
    state: "groupState",
    country: "groupCountry",
  }, { types: ["(cities)"] });
  bindPlaceAutocomplete("groupLocality", {
    locality: "groupLocality",
    city: "groupCity",
    state: "groupState",
    country: "groupCountry",
  });
}

function loadGooglePlaces() {
  if (!mapsKey || window.google?.maps?.places) {
    initGooglePlaces();
    return;
  }

  window.initCrossRoadsPlaces = initGooglePlaces;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(mapsKey)}&libraries=places&callback=initCrossRoadsPlaces`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function setDatalist(id, values) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = uniqueValues(values)
    .map((value) => `<option value="${value}"></option>`)
    .join("");
}

function renderDropdownData() {
  const schools = state.groups.filter((group) => group.type === "School").map((group) => group.institute);
  const colleges = state.groups.filter((group) => group.type === "College").map((group) => group.institute);
  const companies = state.groups.filter((group) => group.type === "Workplace").map((group) => group.institute);
  const allOrgs = state.groups.map((group) => group.institute);
  const cities = state.groups.map((group) => group.city).concat(["Delhi", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Gurgaon"]);
  const countries = state.groups.map((group) => group.country).concat(["India", "United States", "United Kingdom", "Canada", "UAE", "Singapore", "Australia"]);

  setDatalist("schoolOptions", schools);
  setDatalist("collegeOptions", colleges);
  setDatalist("companyOptions", companies);
  setDatalist("allOrgOptions", allOrgs);
  setDatalist("cityOptions", cities);
  setDatalist("countryOptions", countries);
}

function upsertProfileGroups(profile) {
  const affiliations = buildAffiliations(profile);
  const recommendations = [];

  affiliations.forEach((affiliation) => {
    const id = affiliation.communityGroup
      ? buildSchoolCommunityId(affiliation.institute, affiliation.city, affiliation.locality)
      : buildGroupId(affiliation.institute, affiliation.batch, affiliation.city, affiliation.locality);
    let group = state.groups.find((item) => item.id === id);
    let autoCreated = false;

    if (!group) {
      group = {
        id,
        institute: affiliation.institute,
        batch: affiliation.batch,
        city: affiliation.city,
        locality: affiliation.locality,
        state: affiliation.state,
        country: affiliation.country,
        communityGroup: Boolean(affiliation.communityGroup),
        type: affiliation.type,
        members: 1,
        approvalsRequired: 1,
        autoCreatedFromProfile: true,
      };
      state.groups.unshift(group);
      autoCreated = true;
    }

    recommendations.push({
      groupId: id,
      type: affiliation.type,
      signal: affiliation.signal,
      autoCreated,
    });
  });

  state.recommendations = recommendations;
}

function getApprovalRule(group) {
  if (group.members === 0) return "You become first member. No admin power.";
  if (group.members === 1) return "Needs nod from the first existing member.";
  if (group.members === 2) return "Needs nod from existing members. 3-vouch starts after this.";
  return `Needs ${group.approvalsRequired} approvals from existing members.`;
}

function setStatus(element, message, isWarning = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("warn", isWarning);
}

function renderLogin() {
  const status = document.getElementById("loginStatus");
  if (!status) return;
  if (!state.user) {
    setStatus(status, "Not logged in", true);
    return;
  }
  setStatus(status, `Logged in as ${state.user.email}`);
}

function renderProfile() {
  const preview = document.getElementById("profilePreview");
  if (!preview) return;
  if (!state.profile) {
    preview.innerHTML = `
      <span class="avatar a2"></span>
      <div>
        <strong>Profile not created</strong>
        <small>Complete this before joining a group</small>
      </div>
    `;
    return;
  }
  const photo = state.profile.currentPhoto || "";
  preview.innerHTML = `
    ${photo ? `<img class="photo-avatar" src="${photo}" alt="${state.profile.name} current photo" />` : '<span class="photo-avatar" aria-hidden="true"></span>'}
    <div>
      <strong>${state.profile.name}</strong>
      <small>${state.profile.role} · ${state.profile.city}</small>
      <small>${state.profile.skills || "Skills can be added later"}</small>
      <small>${getJourneyAdvice(state.profile)}</small>
      <small>DOB saved privately · ${state.profile.bestFriend ? `friend signal: ${state.profile.bestFriend}` : "friend signal optional"}</small>
      <div class="photo-strip">
        <span class="photo-chip">Current photo ${state.profile.currentPhoto ? "added" : "optional"}</span>
        <span class="photo-chip">School photo ${state.profile.schoolPhoto ? "added" : "optional"}</span>
        <span class="photo-chip">College photo ${state.profile.collegePhoto ? "added" : "optional"}</span>
      </div>
    </div>
  `;
}

function renderRecommendations() {
  const container = document.getElementById("recommendationList");
  if (!container) return;

  if (!state.profile) {
    container.innerHTML = "";
    return;
  }

  if (!state.recommendations.length) {
    container.innerHTML = `
      <div class="recommendation-item">
        <strong>No auto groups yet</strong>
        <small>Add school, college, or workplace with batch to get recommendations.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = state.recommendations
    .map((recommendation) => {
      const group = state.groups.find((item) => item.id === recommendation.groupId);
      if (!group) return "";
      const isMember = state.memberships.includes(group.id);
      const request = state.requests.find((item) => item.groupId === group.id);
      const badge = isMember
        ? '<span class="badge member">Member</span>'
        : recommendation.autoCreated
          ? '<span class="badge pending">Auto-created</span>'
          : '<span class="badge">Existing group</span>';
      const action = isMember
        ? '<button class="secondary-button" type="button" disabled>Already inside</button>'
        : request
          ? '<button class="secondary-button" type="button" disabled>Request pending</button>'
          : `<button class="primary-button" type="button" data-request-group="${group.id}">Request to join</button>`;

      return `
        <article class="recommendation-item">
          <div class="recommendation-top">
            <div>
              <strong>${groupTitle(group)}</strong>
              <small>${recommendation.type} circle · ${recommendation.signal}</small>
            </div>
            ${badge}
          </div>
          <small>${recommendation.autoCreated ? "This group was generated from your profile because it did not exist." : "Existing group found from your profile details."}</small>
          <div class="group-actions">${action}</div>
        </article>
      `;
    })
    .join("");
}

function renderGroups() {
  const container = document.getElementById("groupResults");
  const query = document.getElementById("groupSearch")?.value.trim().toLowerCase() || "";
  if (!container) return;

  const groups = state.groups.filter((group) => {
    const text = `${group.institute} ${group.batch} ${group.locality || ""} ${group.city || ""} ${group.state || ""} ${group.country || ""} ${group.type}`.toLowerCase();
    return !query || text.includes(query);
  });

  if (!groups.length) {
    container.innerHTML = `
      <div class="group-result">
        <strong>No matching group found</strong>
        <small>Create it above and invite the second member by email.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = groups
    .map((group) => {
      const isMember = state.memberships.includes(group.id);
      const request = state.requests.find((item) => item.groupId === group.id);
      const badge = isMember
        ? '<span class="badge member">Member</span>'
        : request
          ? '<span class="badge pending">Request pending</span>'
          : '<span class="badge">Open to request</span>';
      const action = isMember
        ? '<button class="secondary-button" type="button" disabled>Already inside</button>'
        : request
          ? '<button class="secondary-button" type="button" disabled>Waiting for nods</button>'
          : `<button class="primary-button" type="button" data-request-group="${group.id}">Send joining request</button>`;

      return `
        <article class="group-result">
          <div class="group-result-top">
            <div>
              <strong>${groupTitle(group)}</strong>
              <small>${group.type} circle · ${group.members} existing members</small>
            </div>
            ${badge}
          </div>
          <small>${getApprovalRule(group)}</small>
          <div class="group-actions">${action}</div>
        </article>
      `;
    })
    .join("");
}

function renderRequests() {
  const container = document.getElementById("requestList");
  if (!container) return;

  if (!state.requests.length) {
    container.innerHTML = `
      <div class="request-item">
        <strong>No pending requests</strong>
        <small>Search for a group and send a joining request.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = state.requests
    .map((request) => {
      const group = state.groups.find((item) => item.id === request.groupId);
      if (!group) return "";
      const remaining = Math.max(request.required - request.approvals, 0);
      return `
        <article class="request-item">
          <div class="request-top">
            <div>
              <strong>${groupTitle(group)}</strong>
              <small>Requested by ${request.email}</small>
            </div>
            <span class="badge pending">${request.approvals}/${request.required} nods</span>
          </div>
          <small>${remaining === 0 ? "Ready to enter." : `${remaining} more approval${remaining === 1 ? "" : "s"} required from existing members.`}</small>
          <div class="group-actions">
            <button class="secondary-button" type="button" data-simulate-approval="${request.groupId}">Simulate member nod</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderApp() {
  renderDropdownData();
  renderProfileWizard();
  renderLogin();
  renderProfile();
  renderRecommendations();
  renderGroups();
  renderRequests();
}

function renderProfileWizard() {
  const form = document.getElementById("profileForm");
  const steps = [...document.querySelectorAll(".wizard-step")];
  const progress = [...document.querySelectorAll(".wizard-progress span")];
  const back = document.getElementById("profileBack");
  if (!form || !steps.length) return;

  steps.forEach((step, index) => step.classList.toggle("active", index === profileStep));
  progress.forEach((item, index) => item.classList.toggle("active", index === profileStep));
  form.classList.toggle("is-final", profileStep === steps.length - 1);
  if (back) back.disabled = profileStep === 0;
}

function canLeaveCurrentProfileStep() {
  const step = document.querySelector(`.wizard-step[data-step="${profileStep}"]`);
  if (!step) return true;
  const requiredFields = [...step.querySelectorAll("[required]")];
  return requiredFields.every((field) => {
    if (field.value.trim()) return true;
    field.reportValidity();
    return false;
  });
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.getElementById("loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const otp = document.getElementById("loginOtp").value.trim();
  if (!email || !otp) return;
  state.user = { email };
  saveState();
  renderApp();
});

document.getElementById("profileNext")?.addEventListener("click", () => {
  const steps = document.querySelectorAll(".wizard-step");
  if (!canLeaveCurrentProfileStep()) return;
  profileStep = Math.min(profileStep + 1, steps.length - 1);
  renderProfileWizard();
});

document.getElementById("profileBack")?.addEventListener("click", () => {
  profileStep = Math.max(profileStep - 1, 0);
  renderProfileWizard();
});

document.getElementById("profileForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const currentPhoto = await fileToDataUrl(document.getElementById("profileCurrentPhoto").files[0]);
  const schoolPhoto = await fileToDataUrl(document.getElementById("profileSchoolPhoto").files[0]);
  const collegePhoto = await fileToDataUrl(document.getElementById("profileCollegePhoto").files[0]);
  state.profile = {
    name: document.getElementById("profileName").value.trim(),
    dob: document.getElementById("profileDob").value,
    stage: document.getElementById("profileStage").value,
    role: document.getElementById("profileRole").value.trim(),
    city: document.getElementById("profileCity").value.trim(),
    locality: document.getElementById("profileLocality").value.trim(),
    state: document.getElementById("profileState").value.trim(),
    country: document.getElementById("profileCountry").value.trim(),
    skills: document.getElementById("profileSkills").value.trim(),
    bestFriend: document.getElementById("profileBestFriend").value.trim(),
    school: document.getElementById("profileSchool").value.trim(),
    schoolFromClass: document.getElementById("profileSchoolFromClass").value.trim(),
    schoolFromYear: document.getElementById("profileSchoolFromYear").value.trim(),
    schoolToClass: document.getElementById("profileSchoolToClass").value.trim(),
    schoolToYear: document.getElementById("profileSchoolToYear").value.trim(),
    schoolCity: document.getElementById("profileSchoolCity").value.trim(),
    schoolLocality: document.getElementById("profileSchoolLocality").value.trim(),
    schoolState: document.getElementById("profileSchoolState").value.trim(),
    schoolCountry: document.getElementById("profileSchoolCountry").value.trim(),
    college: document.getElementById("profileCollege").value.trim(),
    collegeBatch: document.getElementById("profileCollegeBatch").value.trim(),
    collegeCity: document.getElementById("profileCollegeCity").value.trim(),
    collegeLocality: document.getElementById("profileCollegeLocality").value.trim(),
    collegeState: document.getElementById("profileCollegeState").value.trim(),
    collegeCountry: document.getElementById("profileCollegeCountry").value.trim(),
    workplace: document.getElementById("profileWorkplace").value.trim(),
    workBatch: document.getElementById("profileWorkBatch").value.trim(),
    workCity: document.getElementById("profileWorkCity").value.trim(),
    workLocality: document.getElementById("profileWorkLocality").value.trim(),
    workState: document.getElementById("profileWorkState").value.trim(),
    workCountry: document.getElementById("profileWorkCountry").value.trim(),
    currentPhoto: currentPhoto || state.profile?.currentPhoto || "",
    schoolPhoto: schoolPhoto || state.profile?.schoolPhoto || "",
    collegePhoto: collegePhoto || state.profile?.collegePhoto || "",
    bio: document.getElementById("profileBio").value.trim(),
  };
  upsertProfileGroups(state.profile);
  saveState();
  renderApp();
});

document.getElementById("createGroupForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const institute = document.getElementById("groupInstitute").value.trim();
  const batch = document.getElementById("groupBatch").value.trim();
  const locality = document.getElementById("groupLocality").value.trim();
  const city = document.getElementById("groupCity").value.trim();
  const stateName = document.getElementById("groupState").value.trim();
  const country = document.getElementById("groupCountry").value.trim();
  const invite = document.getElementById("groupInvite").value.trim();
  const status = document.getElementById("groupCreateStatus");

  if (!state.user || !state.profile) {
    setStatus(status, "Login and create your profile before starting a group.", true);
    return;
  }

  const id = buildGroupId(institute, batch, city, locality);
  if (state.groups.some((group) => group.id === id)) {
    setStatus(status, "This group already exists. Use Find group to request entry.", true);
    return;
  }

  state.groups.unshift({
    id,
    institute,
    batch,
    city,
    locality,
    state: stateName,
    country,
    type: "User-created",
    members: 1,
    approvalsRequired: 1,
    invitedEmail: invite,
  });
  state.memberships.push(id);
  saveState();
  event.target.reset();
  setStatus(status, invite ? `Group created. OTP invite is locked to ${invite}.` : "Group created. Invite the second member next.");
  renderApp();
});

document.getElementById("groupSearch")?.addEventListener("input", renderGroups);
document.getElementById("clearSearch")?.addEventListener("click", () => {
  document.getElementById("groupSearch").value = "";
  renderGroups();
});

document.getElementById("resetPrototype")?.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  state = loadState();
  renderApp();
});

function handleJoinRequestClick(event) {
  const button = event.target.closest("[data-request-group]");
  if (!button) return;
  const group = state.groups.find((item) => item.id === button.dataset.requestGroup);
  if (!group) return;
  if (!state.user || !state.profile) {
    alert("Login and create your profile before sending a joining request.");
    return;
  }
  if (state.requests.some((item) => item.groupId === group.id)) {
    renderApp();
    return;
  }

  const required = group.members <= 1 ? 1 : group.members === 2 ? 2 : 3;
  state.requests.push({
    groupId: group.id,
    email: state.user.email,
    approvals: 0,
    required,
    createdAt: new Date().toISOString(),
  });
  saveState();
  renderApp();
}

document.getElementById("groupResults")?.addEventListener("click", handleJoinRequestClick);
document.getElementById("recommendationList")?.addEventListener("click", handleJoinRequestClick);

document.getElementById("requestList")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-simulate-approval]");
  if (!button) return;
  const request = state.requests.find((item) => item.groupId === button.dataset.simulateApproval);
  if (!request) return;
  request.approvals += 1;

  if (request.approvals >= request.required) {
    const group = state.groups.find((item) => item.id === request.groupId);
    if (group) group.members += 1;
    state.memberships.push(request.groupId);
    state.requests = state.requests.filter((item) => item.groupId !== request.groupId);
  }

  saveState();
  renderApp();
});

renderApp();
loadGooglePlaces();
