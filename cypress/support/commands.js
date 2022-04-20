// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add('loginToApplication',() => {

//     const userCredentials = {
//         "user": {
//             "email": "lyalpha2401@gmail.com",
//             "password": "12345"
//         }
//     }
    
//     cy.request('POST','https://api.realworld.io/api/users/login',userCredentials)
//         .its('body').then(body=>{
//             console.log(body)
//             const token = body.user.token
//             cy.wrap(token).as('token')

//             cy.visit('http://localhost:4200',{
//                 onBeforeLoad(win){
//                     win.localStorage.setItem('jwtToken',token)
//                 }
//             })

//         })




// })


Cypress.Commands.add('loginToApplication',() => {
    cy.visit('http://localhost:4200/login')
    cy.get('[placeholder="Email"]').type('lyalpha2401@gmail.com')
    cy.get('[placeholder="Password"]').type('12345')
    cy.get('form').submit()
})




