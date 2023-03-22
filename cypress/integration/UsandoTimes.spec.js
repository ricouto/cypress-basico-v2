/// <reference types="Cypress" />
import { faker } from "@faker-js/faker";

describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => cy.visit("./src/index.html"));
  let nome = faker.name.firstName();
  let sobrenome = faker.name.lastName();
  let email = faker.internet.email();

  context("Digitando em campos e clicando em elementos", () => {
    Cypress._.times(3, () => {
      it("[extra 0] Preenchendo o form usando .times()", () => {
        cy.get("#firstName").type(nome);
        cy.get("#lastName").type(sobrenome);
        cy.get("#email").type(email);
        cy.get("#open-text-area").type(sobrenome, { delay: 0 });
        cy.get(".button").click();

        cy.get(".success")
          .contains("Mensagem enviada com sucesso.")
          .should("be.visible");
      });
    });

    Cypress._.times(3, () => {
      it("[extra 1] Preenchendo o textarea com .repeat()", () => {
        const longText = Cypress._.repeat(sobrenome + " ", 20);

        cy.get("#firstName").type(nome);
        cy.get("#lastName").type(sobrenome);
        cy.get("#email").type(email);
        cy.get("#open-text-area").type(longText, { delay: 0 });
        cy.get(".button").click();

        cy.get(".success")
          .contains("Mensagem enviada com sucesso.")
          .should("be.visible");
      });
    });

    it("[extra 2] Exibe e esconde as mensagens de sucesso e erro usando o .invoke()", () => {
      cy.get(".success")
        .should("not.be.visible")
        .invoke("show")
        .should("be.visible")
        .and("contain", "Mensagem enviada com sucesso.")
        .invoke("hide")
        .should("not.be.visible");
      cy.get(".error")
        .should("not.be.visible")
        .invoke("show")
        .should("be.visible")
        .and("contain", "Valide os campos obrigatórios!")
        .invoke("hide")
        .should("not.be.visible");
    });

    it("[extra 3] Preencher a area de texto usando o comando invoke", () => {
      const longText = Cypress._.repeat(sobrenome + " ", 20);

      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);

      cy.get("#open-text-area")
        .invoke("val", longText)
        .should("have.value", longText);

      cy.get(".button").click();

      cy.get(".success")
        .contains("Mensagem enviada com sucesso.")
        .should("be.visible");
    });
  });

  it.only("[extra 4] Faz uma requisição HTTP", () => {
    cy.request({
      method: "GET",
      url: "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html",
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.statusText).to.equal("OK");
      expect(response.body).to.include("CAC TAT")
    });
  });
});
