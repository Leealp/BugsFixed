
describe('Test with backend',()=>{
    beforeEach('Login to the app',()=>{
        cy.intercept({method:'GET',path:'**/tags'},{fixture:'tags.json'})
        // cy.route('GET','https://api.realworld.io/api/tags','fixture:tags.json')         //not working and for companrison with cy.intercept()
        cy.loginToApplication()
    })

    it.skip('Should log in',()=>{
        cy.log("We're in!")
    })

    it('It should create articles',()=>{

        cy.intercept('GET','https://api.realworld.io/api/articles/This-is-an-Article-350',(req)=>{
            req.reply(res =>{
                expect(res.body.article.description).to.equal('This is the description')
                res.body.article.description = 'This is the description 2'
            })
        }).as('getArticles')          
        // cy.route('GET','https://api.realworld.io/api/articles/This-is-an-Article-350').as('getArticles')           //not working
        // cy.intercept('GET','https://api.realworld.io/api/articles/This-is-an-Article-350').as('getArticles')       //working
        // cy.intercept('GET','**/Article1-350').as('getArticles')                                                    //working

        cy.contains('New Article').click()
        cy.get('input').eq(0).click().type('This is an Article')
        cy.get('input').eq(1).click().type('This is the description')
        cy.get('textarea').click().type('This is the body of the Article')
        cy.get('input').eq(2).click().type('tagA1')
        cy.contains('Publish Article').click()
        
        cy.wait('@getArticles')

        cy.get('@getArticles').then(xhr=>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body.article.title).to.equal('This is an Article')
            expect(xhr.response.body.article.description).to.equal('This is the description 2')
        })
    })

    it('should give tags with routing object',()=>{
        cy.get('div .tag-list')
            .should('contain','cypress')
            .and('contain','automation')
            .and('contain','testing')
    })

    it('verify global feed likes count', () =>{
        // cy.intercept('GET','https://api.realworld.io/api/articles/feed?limit=10&offset=0',{"articles":[],"articlesCount":0}) //!!!
        cy.intercept('GET','**/articles/feed*',{"articles":[],"articlesCount":0}) //!!!
        //cy.intercept('GET','https://api.realworld.io/api/articles?limit=10&offset=0',{fixture:'articles.json'})              //!!!
        cy.intercept('GET','**/articles*',{fixture:'articles.json'})              //!!!
        
        cy.contains('Global Fee').click()
        
                
        cy.get('app-article-list button').then(listOfButtons =>{
            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('1882')
        })

        cy.fixture('articles').then(file=>{
            const articleLink = file.articles[1].slug
            cy.intercept('POST','**/articles/'+articleLink+'/favorite')
        })

        cy.get('app-article-list button')
        .eq(1)
        .click()
        .should('contain','1883')
    })

    it.only('delete a new article in the Global Fee',()=>{

        const userCredentials = {
            "user": {
                "email": "lyalpha2401@gmail.com",
                "password": "12345"
            }
        }

        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "cypress",
                "description": "automation",
                "body": "testing"
            }
        }

        cy.get('@token').then(token=>{

                cy.request({
                    method:'POST', 
                    url:'https://api.realworld.io/api/articles/',
                    headers: {'Authorization': 'Token '+ token},
                    body: bodyRequest               
                }).then(res=>{
                    console.log(res)
                    expect(res.status).to.equal(200)
                })

                cy.contains('Global Feed').click()
                cy.wait(500)
                cy.get('app-article-preview').first().click()
                cy.wait(500)
                cy.contains('Delete Article').click()
                cy.wait(500)

                cy.request({
                    method:'GET', 
                    url:'https://api.realworld.io/api/articles?limit=10&offset=0',
                }).its('body').then(body=>{
                    console.log(body)
                    expect(body.articles[0].title).not.to.equal('cypress')
                })
            })
    })
})











