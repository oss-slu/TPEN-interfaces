//@deprecated - use TPEN.getAuthorization() instead

import { eventDispatcher } from "../api/events.mjs"

export default function checkUserAuthentication() {
  try {
    return new Promise((resolve, reject) => {
      eventDispatcher.on("tpen-user-loaded", event => {
        const TPEN_USER = event.detail
        resolve(TPEN_USER)
      })
    })
  } catch (error) {
    console.log("something happened")
  }
}
