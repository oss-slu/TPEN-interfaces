---
title: User Class
author: <cubap@slu.edu>
layout: default
tags: [tpen, api, javascript, interface]
---

The User class is used to represent an authenticated TPEN user. Interfaces in TPEN will often need details about the currently authenticated user as well as simple information about the users referenced as contributors, group members, etc.

1. [Constructor](#constructor)
2. [Properties](#properties)
3. [Methods](#methods)
  - [getProfile()](#getprofile)
  - [getProjects(withRole)](#getprojectswithrole)
  - [getPublicProjects()](#getpublicprojects)
  - [updateProfile(data)](#updateprofiledata)
  - [updateMetadata(data)](#updatemetadatadata)
4. [Implementation Notes](#implementation-notes)

## Constructor

The constructor for the User class is used to initialize the User object with an identifier unique among users. Instantiating 
a User with no argument `new User()` will return a container for a User for loading or building. An `idString` can also be used 
to asynchronously load an existing User.

An `idString` will be one of the following:

* A string that is a valid `_id` 24-bit hexString from the private TPEN database
* A string that is a valid URI for the public Agent stored in RERUM or compatible repository
* The string ('any') to represent any authenticated User
* The string ('anonymous') to create an instance of a public User

If you are using the TPEN Authentication system, a logged in User will be available as `TPEN.currentUser`, which will include
an authentication token you may pass to the API.

In the default authentication system, a RERUM Public Agent and the private User in the database have synchronized `_id` values. That is, 
user "https://store.rerum.io/v1/id/1234567890abcdef87654321" may be called forth with `new User("1234567890abcdef87654321")`.

```javascript
const user = new User(idString?)
```

## Properties

The User class may have the following properties:

* `id`: The unique hexString identifier for the user.
* `authenticationToken`: The authentication token for the user from `TPEN.currentUser`.
* `agent`: The identifying public Agent URI for the user following the pattern "https://store.rerum.io/v1/id/${id}".
* `displayName`: The name of the user intended for onscreen display in TPEN.
* `profile`: An object containing all profile information the User identified as publicly available. Some examples of values that may be made public include:
  * `profile.name`: The full name of the user intended for the public.
  * `profile.mbox`: The email address of the user.
  * `profile.avatar`: The URL to the user's avatar image.
  * `profile.website`: The URL to the user's website.
  * `profile.identities`: An array of URIs containing all identities the user has.
  * `profile.links`: An array of URIs containing all links related to this user.

> &#42; Any additional metadata attached to the `currentUser` will also be provided.

## Methods

### `getProfile()`

Returns the profile information for the user. This method only returns the publicly available profile 
and is available on any User.

#### Returns (Promise)

* Resolve(`Object`): An object containing the user's profile information.
* Reject(`Error`): 404 if the User is not located, 500 if the server has failed.

#### Example

```js
const webUser = new User(TPEN.currentUser.id)
const profile = await webUser.getProfile()
console.log(profile)

// { "id"         : "1234567890abcdef87654321",
//   "displayName": "Web User",
//   "profile"    : {
//     "avatar"   : "https://1.gravatar.com/avatar/7be054ac552a31f284705148f7c6dcfc0a6c3fcd61f0847619dc495e32c52192",
//     "website"  : "https://mastodon.social/@webuser"
//   }
// }
```

### `getProjects(withRole)`

Returns a list of all the Projects the user has access to. If a `withRole` is provided, the response will be filtered to 
include only those Projects where the user has the specified Role (exact match, case-insensitive). 
Only available on the `currentUser`.

#### Returns (Promise)

* Resolve(`Array<Object>`): An array of Project stubs, with `id` and `title`. With no matches, the array is empty.
* Reject(`Error`): 500 if the server has failed.

#### Example

```js
const webUser = new User(TPEN.currentUser.id)
console.log(await webUser.getProfile())
console.log(await webUser.getProfile("LEADER"))

// [{"id": "abcdef0987654321", "title": "My First Project"},
//  {"id": "bcdefa0987654321", "title": "Some Other Project"},
//  {"id": "cdefab0987654321", "title": "My Second Project"}
// ]
// 
// [{"id": "abcdef0987654321", "title": "My First Project"},
//  {"id": "cdefab0987654321", "title": "My Second Project"}
// ]
```
### `getPublicProjects()`

Returns a list of all the public Projects the user is explicitly a member of.
This is not the same as the method on [`TPEN`](./TPEN) that returns all public projects.

#### Returns (Promise)

* Resolve(`Array<Object>`): An array of Project stubs, with `id` and `title`. With no matches, the array is empty.
* Reject(`Error`): 500 if the server has failed.

### `updateProfile(data)`

Updates the profile information for the `currentUser`. New keys are added and any keys set to `null` will be removed. Only the authenticated user may modify their profile.

#### Returns (Promise)

* Resolve(`User.profile`): The new `profile` property on this User with all modifications applied.
* Reject(`Error`): 403 for unauthenticated Users, 405, for malformed requests, 500 for server errors.

#### Example

```javascript
const webUser = new User(TPEN.currentUser)
document.addEventListener("TPEN-user-loaded",ev=>{
  console.log(webUser.profile)
//   { "avatar"   : "https://1.gravatar.com/avatar/7be054ac552a31f284705148f7c6dcfc0a6c3fcd61f0847619dc495e32c52192",
//     "website"  : "https://mastodon.social/@webuser" }
  const newProfile = {
    avatar: null,
    website: "https://github.io/webuser",
    name: "Charlotte" 
  }
  webUser.updateProfile(newProfile).then(res=>{
    console.log(webUser.profile) // same as res JSON, automatically applied
//   { "name"   : "Charlotte",
//     "website"  : "https://github.io/webuser" }
  })
```

### `updateMetadata(data)`

Updates the user metadata for the `currentUser`. New keys are added and any keys set to `null` will be removed. Only the authenticated user may modify their metadata. Some properties may be protected and resist modification or removal.

#### Returns (Promise)

* Resolve(`User`): The new JSON entry for this User with all modifications applied.
* Reject(`Error`): 403 for unauthenticated Users, 405, for malformed requests, 500 for server errors.

## Implementation Notes

The permissions for a User are controlled by the Project. Changing the active Project will update the permissions and reset all the group members. The `currentUser` is only changed by authentication and cannot be programmatically switched in an Interface.

There are two special case Users that exist only to assign specific Roles in a Project. The **any** User `new User("any")` represents Any authenticated User in TPEN, while the **anonymous** User `new User("anonymous")` includes any visitor to the interface. Find more information in the [Project Class](Project.md).
