/// <reference types="Cypress" />
import { faker } from "@faker-js/faker";

describe("Central de Atendimento ao Cliente TAT", function () {
  beforeEach(() => cy.visit("./src/index.html"));
  let nome = faker.name.firstName();
  let sobrenome = faker.name.lastName();
  let email = faker.internet.email();
  let comentario = faker.lorem.paragraph(2);
  let fone = faker.phone.number("55##9########");

  const dadosFormulario = {
    firstName: nome,
    lastName: sobrenome,
    email: email,
    phone: fone,
    openTextArea: comentario,
  };

  context("Digitando em campos e clicando em elementos", () => {
    it("[pre extra] Verificar o título da aplicação", function () {
      cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
    });

    it("[extra 0] Preencher os campos obrigatórios e envia o formulário #1", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(sobrenome, { delay: 0 });
      cy.get(".button").click();
      cy.get(".success").should("be.visible");
      cy.get(".success").should("contain", "Mensagem enviada com sucesso.");
    });

    it("[extra 0] Preencher os campos obrigatórios e envia o formulário #2", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(comentario, { delay: 0 });
      cy.get(".button").click();
      cy.get(".success")
        .should("be.visible")
        .and("contain", "Mensagem enviada com sucesso.");
    });

    it("[extra 1] Preencher os campos obrigatórios e envia o formulário (sobrescrever o delay)", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(faker.lorem.paragraph(20), { delay: 0 });
      cy.get(".button").click();
      cy.get(".success")
        .should("be.visible")
        .and("contain", "Mensagem enviada com sucesso.");
    });

    it("[extra 2] Exibir mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(nome + "@envioerro,com"); //email invalido
      cy.get("#open-text-area").type(comentario, { delay: 0 });
      cy.get(".button").click();
      cy.get(".error")
        .should("be.visible")
        .and("contain", "Valide os campos obrigatórios!");
    });

    it("[extra 3] Preencher com valor não-numérico deverá continuar vazio", function () {
      cy.get("#phone").type(email).should("have.value", "");
    });

    it("[extra 4] Exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(comentario, { delay: 0 });
      cy.get("#phone-checkbox").click();
      cy.get(".button").click();
      cy.get(".error")
        .should("be.visible")
        .and("contain", "Valide os campos obrigatórios!");
    });

    it("[extra 5] Preencher e limpar os campos nome, sobrenome, email e telefone", function () {
      cy.get("#firstName").type(nome).should("have.value", nome);
      cy.get("#lastName").type(sobrenome).should("have.value", sobrenome);
      cy.get("#email").type(email).should("have.value", email);
      cy.get("#phone").type(fone).should("have.value", fone);
      cy.get("#firstName").clear().should("have.value", "");
      cy.get("#lastName").clear().should("have.value", "");
      cy.get("#email").clear().should("have.value", "");
      cy.get("#phone").clear().should("have.value", "");
    });

    it("[extra 6] Exibir mensagem de erro ao submeter o formulário SEM preencher os campos obrigatórios", function () {
      cy.get(".button").click();
      cy.get(".error")
        .should("be.visible")
        .and("contain", "Valide os campos obrigatórios!");
    });

    it("[extra 7][extra 8] Enviar o formuário com sucesso usando um comando customizado", function () {
      cy.fillMandatoryFieldsAndSubmit(dadosFormulario);
      cy.get(".success").should("be.visible");
      cy.get(".success").should("contain", "Mensagem enviada com sucesso.");
    });
  });

  context("Selecionando opções em campos de seleção suspensa", () => {
    it("[extra 0] Selecionar um produto (YouTube) por seu texto", function () {
      cy.get("#product").select("YouTube").should("have.value", "youtube");
    });

    it("[extra 1] Selecionar um produto (Mentoria) por seu valor (value)", function () {
      cy.get("#product").select("mentoria").should("have.value", "mentoria");
    });

    it("[extra 2] Selecionar um produto (Blog) por seu índice", function () {
      cy.get("#product").select(1).should("have.value", "blog");
    });
  });

  context("Marcando inputs do tipo radio", () => {
    it('[extra 0] Marcar o tipo de atendimento "Feedback"', function () {
      cy.get('[type="radio"][value="feedback"]')
        .check()
        .should("be.checked")
        .and("have.value", "feedback");
    });

    it("[extra 1] Marcar cada tipo de atendimento", function () {
      cy.get('[type="radio"]')
        .should("have.length", 3)
        .each(function ($radio) {
          cy.wrap($radio).check();
          cy.wrap($radio).should("be.checked");
        });
    });
  });

  context("Marcando e desmarcando inputs do tipo checkbox", () => {
    it.only('[extra 0] Marcar ambos checkboxes e depois desmarca o último', function () {
      cy.get('[type="checkbox"]')
        .check()
        .should("be.checked")
    });

    it("[extra 1] Marcar cada tipo de atendimento", function () {
      cy.get('[type="radio"]')
        .should("have.length", 3)
        .each(function ($radio) {
          cy.wrap($radio).check();
          cy.wrap($radio).should("be.checked");
        });
    });
  });

});
