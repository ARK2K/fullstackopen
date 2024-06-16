describe("Blog app", function () {
  beforeEach(function () {
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    // Check if the login form contains specific text or elements
    cy.contains("Login").should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[name="Username"]').should("be.visible");
      cy.get('input[name="Password"]').should("be.visible");
      cy.get('button[type="submit"]').contains("login").should("be.visible");
    });
  });
});
