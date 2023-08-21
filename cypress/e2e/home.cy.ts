/// <reference types="cypress" />

import cities from "../fixtures/cities.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { _ } = Cypress;

describe("Home Page Test", () => {
  beforeEach(() => {
    cy.intercept("GET", "*/search*", {
      fixture: "cities.json",
    }).as("getCities");

    cy.visit("/");
  });

  it("renders all cities and their temp detail", () => {
    cy.get('[data-cy="cities-container"]').should("have.class", "mt-6");
    cy.get('[data-cy="no-btn"]').click();
    cy.get('[data-cy="cities-list"]').within(() => {
      _.each(cities, (city) => {
        cy.get(`[data-cy="city-${city?.fields?.name}"]`).contains(
          city?.fields?.population
        );
      });
    });
  });
  it("navigates to user's city page", () => {
    cy.get('[data-cy="cities-container"]').should("have.class", "mt-6");
    cy.get('[data-cy="okay-location-btn"]')
      .click()
      .then(() => {
        cy.location().should((location) => {
          expect(location.pathname).to.include("lat");
        });
      });
  });
});
