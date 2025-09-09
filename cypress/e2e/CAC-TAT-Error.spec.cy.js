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

  context.only("Digitando em campos e clicando em elementos", () => {
    it.only("[pre extra] Verificar o título da aplicação", function () {
      cy.title().should("eq", "Atendimento ao Cliente TAT");
    });

    it.only("[extra 0] Preencher os campos obrigatórios e envia o formulário #1", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(sobrenome, { delay: 0 });
      cy.get(".button").click();
      //cy.get(".success").should("be.visible").and('have.text', 'Mensagem enviada com sucesso.');
      cy.get(".success").contains('Mensagem enviada com sucesso.').should('be.visible')
      //cy.contains('.success', 'Mensagem enviada com sucesso.').should('be.visible')
      //cy.get(".success").should("be.visible", "Mensagem enviada com sucesso.");
      cy.contains('.success', 'enviada com sucesso.').should('not.be.visible')
      //cy.get(".success").should("not.be.visible", "Mensagem enviada com sucesso.");
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

    it("[extra 2] Usando Clock() e Tick() para exibir mensagem de erro ao submeter o formulário", function () {
      cy.clock()
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(nome + "@envioerro,com"); //email invalido
      cy.get("#open-text-area").type(comentario, { delay: 0 });
      cy.get(".button").click();
      
      cy.get(".error")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!");
      
      cy.tick(3000)
      cy.get(".error")
      .should("not.be.visible")
      //.and("contain", "Valide os campos obrigatórios!");

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
    it("[extra 0] Marcar ambos checkboxes e depois desmarca o último", function () {
      cy.get('[type="checkbox"]')
        .check()
        .should("be.checked")
        .last()
        .uncheck()
        .should("not.be.checked");
    });

    it("[extra 1] Exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
      cy.get("#firstName").type(nome);
      cy.get("#lastName").type(sobrenome);
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(comentario, { delay: 0 });
      cy.get("#phone-checkbox").check();
      cy.get(".button").click();
      cy.get(".error")
        .should("be.visible")
        .and("contain", "Valide os campos obrigatórios!");
    });
  });

  context("Fazendo upload de arquivos", () => {
    it("[extra 0] Selecionar um arquivo da pasta fixtures", function () {
      cy.get('input[type="file"]')
        .should("not.have.value")
        .selectFile("cypress/fixtures/example.json")
        .then((input) => {
          expect(input[0].files[0].name).to.eq("example.json");
        });
    });

    it("[extra 1] Selecionar um arquivo simulando um drag-and-drop", function () {
      cy.get("#file-upload")
        .should("not.have.value")
        .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
        .then((input) => {
          expect(input[0].files[0].name).to.eq("example.json");
        });
    });

    it("[extra 2] Selecionar um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
      cy.fixture("example.json", { encoding: null }).as("myFile");
      cy.get("#file-upload")
        .should("not.have.value")
        .selectFile("@myFile")
        .then((input) => {
          expect(input[0].files[0].name).to.eq("example.json");
        });
    });
  });

  context('Lidando com links que abrem em outra aba', () => {
    it('[extra 0] Verificar que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
      cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });

    it('[extra 1] Acessar a página da política de privacidade removendo o target e então clicando no link', () => {
      cy.get('#privacy a').invoke('removeAttr', 'target').click()
      cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
      cy.contains('Talking About Testing').should('be.visible')
    });

    it('[extra 2] Testar a página da política de privacidade de forma independente', () => {
      cy.visit('./src/privacy.html')
      cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
      cy.contains('Talking About Testing').should('be.visible')
    });
  });

  context('Simulando o viewport de um dispositivo móvel', () => {
  });
});
