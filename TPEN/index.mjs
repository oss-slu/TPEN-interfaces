/**
 * The TPEN class is the main class for accessing the TPEN services API. It is used to initialize the TPEN module and to make calls to the API.
 * @module TPEN
 * @class
 * @example const tpen = new TPEN(tinyThingsURL?)
 * @param {String} tinyThingsURL - The URL of the TinyThings API. Defaults to "https://dev.tiny.t-pen.org"
 * @imports {User, Project, Transcription}
 */

import { User } from './User/index.mjs'
// import { Project } from './Project/index.mjs'

export class TPEN {
    