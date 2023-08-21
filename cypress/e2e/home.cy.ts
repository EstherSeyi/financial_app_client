/// <reference types="cypress" />

// import cities from "../fixtures/cities.json";
import citiesWeather from "../fixtures/cities-weather.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { _ } = Cypress;

describe("Home Page Test", () => {
  beforeEach(() => {
    cy.intercept("GET", "*/search*", {
      fixture: "cities-weather.json",
    }).as("getCities");
    cy.intercept("GET", "*/weather**", {
      fixture: "cities-weather.json",
    }).as("getCitiesWeather");

    cy.visit("/");
  });

  it("renders all cities and their temp detail", () => {
    cy.get('[data-cy="city-weather-list"]').within(() => {
      _.each(citiesWeather, (cityWeather) => {
        const cityName = cityWeather.name;
        cy.get(`[data-cy="city-${cityWeather.id}"]`).contains(cityName, {
          matchCase: false,
        });
      });
    });
  });
});
