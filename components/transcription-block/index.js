const inputBlock = document.getElementById("input-block")
const prevButton = document.getElementById("prev-line")
const nextButton = document.getElementById("next-line")
const dragHandle = document.getElementById("drag-handle")
const canvas = document.getElementById("transcription-canvas")

let currentLineIndex = 0
let isDragging = false
let startY, startTop

// Adjust this according to the actual line height or canvas spacing
const lineHeight = 50

// Function to move the input block to the next or previous line
function moveToLine(index) {
  const newTop = index * lineHeight
  inputBlock.style.top = `${newTop}px`
}

// Move to the next line
nextButton.addEventListener("click", () => {
  currentLineIndex++
  moveToLine(currentLineIndex)
})

// Move to the previous line
prevButton.addEventListener("click", () => {
  if (currentLineIndex > 0) {
    currentLineIndex--
    moveToLine(currentLineIndex)
  }
})

// Drag functionality
dragHandle.addEventListener("mousedown", (e) => {
  isDragging = true
  startY = e.clientY
  startTop = inputBlock.offsetTop
  inputBlock.style.cursor = "grabbing"
})

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return
  const deltaY = e.clientY - startY
  const newTop = Math.max(0, startTop + deltaY) // Prevent dragging above the canvas
  inputBlock.style.top = `${newTop}px`
})

document.addEventListener("mouseup", () => {
  isDragging = false
  inputBlock.style.cursor = "grab"
})
