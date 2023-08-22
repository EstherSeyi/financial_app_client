/// <reference types="cypress" />

import cities from "../fixtures/cities.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { _ } = Cypress;

describe("Home Page Test", () => {
  beforeEach(() => {
    const city = cities[0];
    cy.visit(
      `/${city.fields.name.toLocaleLowerCase()}?lat=${
        city.fields.latitude
      }&lon=${city.fields.longitude}&geoname_id=${city.fields.geoname_id}`
    );
  });

  it("renders single city page", () => {
    const city = cities[0];
    cy.get(`[data-cy=city_${city?.fields?.name.toLocaleLowerCase()}]`).should(
      "be.visible"
    );
    cy.get('[data-cy="city_name"]').should("be.visible");
    cy.get('[data-cy="city_name"]').should("contain.text", city?.fields?.name);
    cy.get("h2").should("contain", city.fields.country);
    cy.get('[data-cy="weather-dets-section"]').should("be.visible");
    cy.get('[data-cy="notes-form"]').should("be.visible");
    cy.get('[data-cy="notes-list"]').should("be.visible");
  });
  it("can properly handle notes feature", () => {
    cy.get("ul").should("not.exist");
    cy.get('[data-cy="no-notes"]').should("be.visible");
    cy.get('[data-cy="note-input"]').should("be.visible");
    cy.get('[data-cy="note-input"]').type("Hello World Already!");
    cy.get('[ data-cy="note-submit-btn"]').click({ force: true });
    cy.get("ul").should("be.visible");
    cy.get('[data-cy="edit-btn"]').should("be.visible");
    cy.get('[data-cy="edit-icon"]').should("be.visible");
    cy.get('[data-cy="edit-btn"]').click({ force: true });
    cy.get('[data-cy="note-input"]').type("Hello World Already! It is time");
    cy.get('[data-cy="note-submit-btn"]').click({ force: true });
    cy.get("ul").within(() => {
      cy.get("li").should("be.visible");
      cy.get("li").should("contain.text", "Hello World Already! It is time");
      cy.get("[data-cy='del-checkbox']").check();
    });
    cy.get('[data-cy="del-btn"]').should("be.visible");
    cy.get('[data-cy="del-btn"]').click({ force: true });
    cy.get("ul").should("not.exist");
  });
});
