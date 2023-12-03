describe("Incidentes", () => {
  beforeEach(() => {
    cy.visit("https://cachet-web.azurewebsites.net/auth/login");
    cy.get("input[name=username]").type("test");
    cy.get("input[name=password]").type("test123");
    cy.get(".btn[type=submit]").click();
    cy.get("a").contains("Incidents").click();
  });

  it("Cadastro de Incidentes com sucesso", () => {
    cy.contains("a", "Report an incident").click();
    cy.get("#incident-name").type("Incident Test");
    cy.get("input[name=status]:radio").first().click();
    cy.get("textarea[name=message]").type("Message Test");
    cy.get(".btn-success").click();
    cy.get(".alert-success")
      .contains("Awesome. Incident added.")
      .should("exist");
  });

  it("Confirmação de criação de um Incidentes", () => {
    cy.contains("a", "Report an incident").click();
    cy.get("#incident-name").type("Incident Test 2");
    cy.get("input[name=status]:radio").first().click();
    cy.get("textarea[name=message]").type("Message Test 2");
    cy.get(".btn-success").click();
    cy.get(".header.sub-header").contains("Incidents").should("exist");
    cy.get("div.striped-list-item").first().as("stripedItemElement");
    cy.get("@stripedItemElement").within(() => {
      cy.get("> div strong").contains("Incident Test 2").should("exist");
    });
  });

  it("Cadastro de Incidentes com falha", () => {
    cy.contains("a", "Report an incident").click();
    cy.get("#incident-name").type("Incident Test 3");
    cy.get("input[name=status]:radio").first().click();
    cy.get(".btn-success").click();
    cy.get("textarea[name=message]")
      .invoke("prop", "validationMessage")
      .should("equal", "Preencha este campo.");
    cy.get(".header").contains("Report an incident").should("exist");
  });

  it("Sucesso na edição de um incidente", () => {
    cy.get(
      '.striped-list-item:contains("Incident Test 2") a:contains("Edit")'
    ).click();
    cy.get("#incident-name").clear().type("Incident Test 2.1");
    cy.get(".btn-success").click();
    cy.get(".alert-success")
      .contains("Awesome. Incident updated.")
      .should("exist");
  });

  it("Cancelar a edição de um incidente", () => {
    cy.get(
      '.striped-list-item:contains("Incident Test 2.1") a:contains("Edit")'
    ).click();
    cy.get(".btn-default").click();
    cy.get(".header.sub-header").contains("Incidents").should("exist");
    cy.get(".alert-success").should("not.exist");
  });

  it("Tentativa de edição de um incidente sem fazer alterações", () => {
    cy.get(
      '.striped-list-item:contains("Incident Test 2.1") a:contains("Edit")'
    ).click();
    cy.get(".btn-success").click();
    cy.get(".alert-success")
      .contains("Awesome. Incident updated.")
      .should("exist");
  });

  it("Apresentação de confirmação de decisão de exclusão do incidente", () => {
    cy.get(
      '.striped-list-item:contains("Incident Test 2.1") a:contains("Delete")'
    ).click();
    cy.get(".swal2-modal").contains("Confirm your action").should("exist");
  });

  it("Deleção um incidente", () => {
    cy.get(
      '.striped-list-item:contains("Incident Test 2.1") a:contains("Delete")'
    ).click();
    cy.get(".swal2-modal").contains("Confirm your action").should("exist");
    cy.get(".swal2-confirm").click();
    cy.get(".alert-success")
      .contains(
        "Awesome. The incident has been deleted and will not show on your status page."
      )
      .should("exist");
  });

  it("Confirmação da deleção um incidente", () => {
    cy.get('.striped-list-item:contains("Incident Test 2.1")').should(
      "not.exist"
    );
  });
});
