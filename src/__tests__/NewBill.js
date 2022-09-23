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
});
