import TPEN from "../../api/TPEN.js";
 
const container = document.body;
TPEN.attachAuthentication(container);
 
document.getElementById("goForwardBtn").addEventListener("click", goForward);
document.getElementById("projectSelect").addEventListener("change", () => {
  document.getElementById("projectData").textContent = "";
  document.getElementById("projectDetails").style.display = "none";
});
 
async function fetchProjects() {
  try {
    const AUTH_TOKEN = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userToken="))
      ?.split("=")[1];
 
    const params = new URLSearchParams(window.location.search);
    const UID = params.get("UID");
 
    const response = await fetch(
      `http://localhost:3012/project/import28/${UID}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
 
    const json = await response.json();
    const message = json.message;
    const data = json.data;
 
    document.getElementById("message").textContent = message;
 
    const select = document.getElementById("projectSelect");
    for (let key in data) {
      const option = document.createElement("option");
      option.value = `${data[key].name}/${data[key].id}`;
      option.text = data[key].name;
      select.appendChild(option);
    }
  } catch (err) {
    document.getElementById("message").textContent = "Failed to load projects.";
    console.error("Error fetching projects:", err);
  }
}
 
async function goForward() {
  const select = document.getElementById("projectSelect");
  const selectedValue = select.value;
  const selectedId = selectedValue ? selectedValue.split("/")[2] : null;
 
  const projectDataDiv = document.getElementById("projectData");
  const projectDetailsDiv = document.getElementById("projectDetails");
  const messageDiv = document.getElementById("message");
 
  projectDataDiv.textContent = "";
  projectDetailsDiv.style.display = "none";
  messageDiv.textContent = "";
 
  const AUTH_TOKEN = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userToken="))
    ?.split("=")[1];
 
  const url = `https://t-pen.org/TPEN/manifest/${selectedId}`;
 
  const response = await fetch(
    `${TPEN.servicesURL}/project/import?createFrom=URL`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({ url }),
    }
  );
 
  console.log(response);
 
  if (selectedId) {
    try {
      const response = await fetch(
        `http://localhost:8080/TPEN/getProjectTPENServlet?projectID=${selectedId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
 
      if (!response.ok) {
        messageDiv.textContent = "Unable to import project.";
        return;
      }
 
      const rawText = await response.text();
      let parsedData;
 
      try {
        const firstLevel = JSON.parse(rawText);
        parsedData = {};
 
        for (const [key, value] of Object.entries(firstLevel)) {
          try {
            parsedData[key] = JSON.parse(value);
          } catch {
            parsedData[key] = value;
          }
        }
      } catch (err) {
        console.error("Failed to parse project response:", err);
        messageDiv.textContent = "Unable to import project.";
        return;
      }
 
      projectDataDiv.textContent = JSON.stringify(parsedData, null, 2);
      projectDetailsDiv.style.display = "block";
 
      const projectCollaborators = parsedData.ls_u.map((user) => ({
        email: user.Uname,
      }));
 
      const projectCollaboratorsDiv = document.getElementById(
        "projectCollaborators"
      );
      projectCollaborators.forEach(async (user) => {
        projectCollaboratorsDiv.style.display = "flex";
        projectCollaboratorsDiv.style.justifyContent = "center";
        projectCollaboratorsDiv.style.alignItems = "center";
        projectCollaboratorsDiv.style.gap = "50px";
        const collaboratorP = document.createElement("p");
        collaboratorP.textContent = user.email;
 
        projectCollaboratorsDiv.appendChild(collaboratorP);
      });
    } catch (error) {
      console.error("Error fetching project details:", error);
      messageDiv.textContent = "Unable to import project.";
    }
  } else {
    messageDiv.textContent = "Please select a project first.";
  }
}
 
fetchProjects();