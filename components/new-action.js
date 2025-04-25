class NewAction extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `
            <style> 
                .new-action {
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                button {
                    margin: 5px;
                    border:none;
                    background-color: transparent;
                    color: black;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    &:hover {
                        font-weight: 600;
                    }
                }
            </style>
          <div class="new-action">
                <button id="create-project">Create a New Project</button>
                <button id="import-resource">Import a Resource</button>
                <button id="upgrade">Upgrade from TPEN 2.8</button>
                <button id="link-tpen-2.8">Link TPEN 2.8 Account</button>
            </div>
        `

        this.shadowRoot.getElementById('import-resource').addEventListener('click', () => {
            window.location.href = '/interfaces/import-project.html'
        })
        this.shadowRoot.getElementById('create-project').addEventListener('click', () => {
            window.location.href = '/interfaces/project/create'
        })
        this.shadowRoot.getElementById("link-tpen-2.8").addEventListener("click", () => {
            const userToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY3YTRlY2U1MDYzODQ4MzIyNWIxYjM3OSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sIm5pY2tuYW1lIjoibWUiLCJuYW1lIjoibWVAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzUyNWNlYjA2YmM4ODYyOTMyZDg1M2EwMzM0MTFlM2I3P3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNlbnRlcmZvcmRpZ2l0YWxodW1hbml0aWVzLmdpdGh1Yi5pbyUyRnJlcnVtLWNvbnNvcnRpdW0lMkZsb2dvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDI1LTA0LTIzVDE3OjM4OjMxLjg4MloiLCJlbWFpbCI6Im1lQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vIiwiYXVkIjoiYkJ1Z0ZNV0hVbzFPaG5TWk1wWVVYeGkzWTFVSkk3S2wiLCJzdWIiOiJhdXRoMHw2N2E0ZWNlMDg4MDY3OTcxYzJjY2FjMjAiLCJpYXQiOjE3NDU1OTQ0NDIsImV4cCI6MTc0NTYzMDQ0Miwic2lkIjoiVnp1MXNaT1RMVHRhU2RWNEcyTG9ndEtGUDlpZXRjQlgiLCJhdF9oYXNoIjoid2x3cXljR2dGak0xV250RnhqekhoUSIsIm5vbmNlIjoiVFFJb1k1MlNkS1JnWGpLYnh3UUVGZVgzNUFGREtlbXkifQ.KGDqqxy1MDD1m7IqbhWxKY-8ycpnw4jKJkvyBhz7SEb9cXQr5fAxHuaCmeBD42Pu6QH1Ov_m0fsMsy1JoK53e064g36ToTO0UJ3IQts2v7VRF5LgX5T4g7R4JIiEziGQe6tQYjI295qbe3YdFhpTO7-o0fzB_bL0kE8U8k9TFkFNE5Nk6k3EsyJQ5gj8nQZ7SCJ_OYDtQTGdKUragr0ZL1JV7ri5-_BkBKgyUr6CXBR0HzqAIZuFBe2znhbD0-i0BeK2rkCivkwpjTV1PIg89YgbPb8taBWbDSveg7fkr7MsIqEmw7d7wf-0UM0_BoGQZvZ-Bq3VE69u1lkxDwFjhQ"
            const redirectUri = encodeURIComponent(`http://localhost:3012/project/import28?token=${userToken}`)
            window.location.href = `http://localhost:8080/TPEN/login.jsp?redirect_uri=${redirectUri}`
        })      
    }
}

customElements.define('tpen-new-action', NewAction) 