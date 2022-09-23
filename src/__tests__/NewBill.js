/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";
import { ROUTES } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore);

const file = new File(["bobcat"], "bobcat.jpg", {
  type: "image/jpg",
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see new bill form ", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
    test("I should be able to load a new bill", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          email: "a@a",
        })
      );
      const store = mockStore;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const fileInput = screen.getByTestId("file");
      fileInput.addEventListener("change", (e) => handleChangeFile(e));
      userEvent.upload(fileInput, file);
      expect(handleChangeFile).toHaveBeenCalled();
      expect(fileInput.files[0]).toStrictEqual(file);
    });
  });
  test("I should be able to POST a new bill and navigate back to bill page", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        email: "a@a",
      })
    );
    const store = mockStore;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const newBill = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });

    const submitButton = screen.getByText("Envoyer");
    const form = screen.getByTestId("form-new-bill");

    const expenseTypeSelect = screen.getByTestId("expense-type");
    const expenseNameInput = screen.getByTestId("expense-name");
    const datePicker = screen.getByTestId("datepicker");
    const amout = screen.getByTestId("amount");
    const vat = screen.getByTestId("vat");
    const pct = screen.getByTestId("pct");
    const commentary = screen.getByTestId("commentary");
    const file = screen.getByTestId("file");

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    file.addEventListener("change", (e) => handleChangeFile(e));
    form.addEventListener("submit", (e) => handleSubmit(e));

    userEvent.selectOptions(expenseTypeSelect, "Transports");
    userEvent.type(expenseNameInput, "Test");
    userEvent.type(datePicker, "23/09/2022");
    userEvent.type(amout, "3000");
    userEvent.type(vat, "300");
    userEvent.type(pct, "30");
    userEvent.type(commentary, "Test du commentaire");

    userEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
    expect(screen.getByText("Mes notes de frais")).toBeTruthy();
  });
});
