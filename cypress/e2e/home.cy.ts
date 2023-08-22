/// <reference types="cypress" />

import cities from "../fixtures/cities.json";
import { formatNumber } from "../../src/utils/format";

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
          formatNumber(city?.fields?.population)
        );
      });
    });
  });

  it("renders each list item correctly", () => {
    const city = cities[0];
    cy.get(`[data-cy="city-${city?.fields?.name}"]`).should(
      "have.attr",
      "class"
    );
    cy.get('[data-cy="weather-icon"]').should("have.attr", "src");
    cy.get('[data-cy="fave-btn"]').should("be.visible");
    cy.get('[data-cy="fave-icon"]').should("be.visible");
    cy.get('[data-cy="fave-icon"]').should("have.class", "w-8 h-8");
  });
  it("is able to click favorite button and it works correctly", () => {
    const city = cities[0];
    cy.get('[data-cy="fave-icon"]').should("have.class", "w-8 h-8");
    cy.get(`[data-cy="city-${city?.fields?.name}"]`).within(() => {
      cy.get('[data-cy="fave-btn"]').click({ force: true });
    });
    cy.get('[data-cy="fave-icon"]').should(
      "have.class",
      "w-8 h-8 text-yellow-300 fill-yellow-300"
    );
  });
  it("is able to click delete button and it works correctly", () => {
    const city = cities[0];
    cy.get(`[data-cy="city-${city?.fields?.name}"]`).should("be.visible");
    cy.get('[data-cy="trash-icon"]').should("be.visible");
    cy.get(`[data-cy="city-${city?.fields?.name}"]`).within(() => {
      cy.get('[data-cy="delete-btn"]').click({ force: true });
    });
    cy.get(`[data-cy="city-${city?.fields?.name}"]`).should("not.exist");
  });

  it("searchs city and navigates correctly", () => {
    cy.get('[data-cy="search-city"]').should("be.visible");
    cy.get('[data-cy="search-input"]').should("be.visible");
    cy.get('[data-cy="search-input"]')
      .type("Sapele", { force: true })
      .wait(500)
      .then(() => {
        cy.get('[data-cy="city-list"]').should("be.visible");
        cy.get('[data-cy="city-list"]').within(() => {
          cy.get('[data-cy="city-item"]').should("be.visible");
          cy.get('[data-cy="city-item"]').click({ force: true });
          cy.location().should((location) => {
            expect(location.href).to.include("lat");
          });
        });
      });
  });
  it("navigates to user's city page if user clicks 'okay' on modal", () => {
    cy.clearLocalStorage();
    cy.get('[data-cy="cities-container"]').should("have.class", "mt-6");
    cy.get('[data-cy="okay-location-btn"]')
      .click()
      .wait(500)
      .then(() => {
        cy.location().should((location) => {
          expect(location.href).to.include("lat");
        });
      });
  });
});
