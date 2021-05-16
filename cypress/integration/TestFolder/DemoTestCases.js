/// <reference types="cypress" />
describe('Validate is CRUD options',()=>{
 var accesstoken= '86b62a940c3e6fa9404588463ba30e543f046fc86f9c5611c9409dee71c632c3'
 var userId="";
 var testEmail="";
 var userEmail="";
it('Validate Get Request',()=>{
    cy.request({
        method : 'GET',
        url : 'https://gorest.co.in/public-api/users/123/posts',
        headers: {
            'authorization': 'Bearer '+accesstoken,
          }
          
    }).then((res)=>{
        expect(res.status).to.eq(200)
        expect(res.body.meta.pagination).has.property('limit',20)
        expect(res.body).has.to.deep.equal({
            "code": 200,
            "meta": {
                "pagination": {
                    "total": 0,
                    "pages": 0,
                    "page": 1,
                    "limit": 20
                }
            },
            "data": []
            })
    })
})

it('Validate Post Request',()=>{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));   
    testEmail = text + '@gmail.com'
      cy.request({
            method : 'POST',
            url : 'https://gorest.co.in/public-api/users',
            body:{
                "name":'Test Automation',
                "gender":"Male",
                "email": testEmail,
                "status":"Active"
             },
            headers: {
                'authorization': 'Bearer '+accesstoken,
              }
        }).then((res)=>{
            expect(res.body.data).has.property('email',testEmail)
            expect(res.body.data).has.property('gender','Male')
            expect(res.body.data).has.property('status','Active')
            userId= res.body.data.id;
            cy.log(userId)
            testEmail=res.body.data.email;
            cy.log(testEmail)

        })
    }) 
    it('Validate Put Request',()=>{
      cy.request({
            method : 'PUT',
            url : 'https://gorest.co.in/public-api/users/'+userId,
            body:{
                "name":'Test Automation',
                "gender":"Female",
                "email": testEmail,
                "status":"Active"
             },
            headers: {
                'authorization': 'Bearer '+accesstoken,
              }
        }).then((res)=>{
            expect(res.body.data).has.property('email',testEmail)
            expect(res.body.data).has.property('gender','Female')
            expect(res.body.data).has.property('status','Active')
        
        })
    }) 

    it('Validate Delete Request',()=>{
      cy.request({
            method : 'DELETE',
            url : 'https://gorest.co.in/public-api/users/'+userId,
            headers: {
                'authorization': 'Bearer '+accesstoken,
              }
        }).then((res)=>{
            expect(res.body).has.property('code',204)
        })
    })     
    
    it('Email already existing',()=>{
        cy.fixture('example.json').as('exampleAPI');
        cy.get('@exampleAPI').then(myFixture => { 
        cy.request({
            method : 'POST',
            url : 'https://gorest.co.in/public-api/users',
            body:myFixture,
            headers: {
                'authorization': 'Bearer '+accesstoken,
              }
        }).then((res)=>{
            expect(res.body.data[0]).has.property('message',"has already been taken")
            
        })
    })
    })
    it('Amozon login',()=>{
        cy.visit('https://www.amazon.in/')	
        cy.get('span[class="nav-action-inner"]').eq(0).click({force: true})
        cy.wait(4000)
        cy.get("#ap_email").type(testEmail)
        cy.get('#continue').click()
        cy.get('h4[class="a-alert-heading"]').contains('There was a problem').should('exist')
    })
})