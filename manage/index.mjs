document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("header button")
  const content = document.getElementById("content")

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      buttons.forEach(btn => btn.classList.remove('active'))

      button.classList.add('active')
      const componentName = button.id
      const response = await fetch(`${componentName}.html`)
      const componentHtml = await response.text()
      content.innerHTML = componentHtml

      if (componentName === "collaboration") {
        const modifyTeamBtn = document.getElementById("modify-team-btn")
        if (modifyTeamBtn) {
          modifyTeamBtn.addEventListener("click", () => { 
            const URLParams = new URLSearchParams(window.location.search)
            const projectID =  URLParams.get("projectID")
            const url = `/collaborators/index.html?projectID=${projectID}`
            window.location.href = url
          })
        }
      }
    })
  })

  document.getElementById("projects").click()
})
