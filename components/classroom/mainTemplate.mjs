import { templates } from './templates.mjs';

// MainTemplate function that manages and displays other templates
const MainTemplate = () => {
  let selectedTemplate = null; // Variable to store the currently selected template

  // Function to handle template button clicks
  const handleTemplateClick = (index) => {
    selectedTemplate = templates[index]; // Set the selected template based on the clicked button
    render(); // Re-render the main template to display the selected template
  };

  // Function to render the main template and the selected template content
  const render = () => {
    const container = document.getElementById('main-template');
    container.innerHTML = `
      <div>
        <h1>Main Template</h1>
        <div id="buttons-container">
          ${templates.map((template, index) => `
            <button class="template-button" data-index="${index}">
              ${template.templateName}
            </button>
          `).join('')}
        </div>
        <div id="selected-template">
          ${selectedTemplate ? `
            <div>
              <h2>${selectedTemplate.templateName}</h2>
              ${selectedTemplate.content}
            </div>
          ` : `
            <p>Please select a template to view its content.</p>
          `}
        </div>
      </div>
    `;
  
    // Attach event listeners to buttons dynamically
    document.querySelectorAll('.template-button').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        handleTemplateClick(parseInt(index));
      });
    });
  };

  return { render, handleTemplateClick }; // Return the render and handleTemplateClick functions
};

const mainTemplate = MainTemplate(); // Create an instance of the MainTemplate

// Event listener to render the main template when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app'); // Get the app container element
  app.innerHTML = '<div id="main-template"></div>'; // Set the inner HTML of the app container
  mainTemplate.render(); // Render the main template
});