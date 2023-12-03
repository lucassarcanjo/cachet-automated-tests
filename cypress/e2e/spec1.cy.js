describe('Login', () => {

  beforeEach(() => {
    cy.visit('https://cachet-web.azurewebsites.net/auth/login')
  })

  it('Login na aplicação com sucesso', () => {
    cy.get('input[name=username]').type('test')
    cy.get('input[name=password]').type('test123')
    cy.get('.btn[type=submit]').click()
    cy.get('.username').invoke('text').then((text) => {
      expect(text.trim()).equal('test')
    });
  })

  it('Login na aplicação com falha', () => {
    cy.get('input[name=username]').type('test')
    cy.get('input[name=password]').type('test')
    cy.get('.btn[type=submit]').click()
    cy.get('.alert-danger').invoke('text').then((text) => {
      expect(text.trim()).equal('Invalid username or password')
    });
  })
})