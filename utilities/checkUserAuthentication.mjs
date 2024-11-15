//@deprecated - use TPEN.getAuthorization() instead

import { eventDispatcher } from "../TPEN/events.mjs"

export default function checkUserAuthentication() {
  try {
    return new Promise((resolve, reject) => {
      eventDispatcher.on("tpen-user-loaded", event => {
        const TPEN_USER = event.detail
        resolve(TPEN_USER)
      })

      // const authButton = document.querySelector('auth-button')

      // if (authButton) {
      //   authButton.addEventListener("tpen-authenticated", (event) => {
      //     const TPEN_USER = event.detail
      //     resolve(TPEN_USER)
      //   })

      // } else {
      //   reject(new Error('auth-button not found on the page.'))
      // }
    })
  } catch (error) {
    console.log("something happened")
  }
}
