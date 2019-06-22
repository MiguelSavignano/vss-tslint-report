import { getOrganizationName, getValue } from "../buildAndReleaseTask/helper";

test("#getOrganizationName", () => {
  const result = getOrganizationName("https://dev.azure.com/miguel-savignano/");
  expect(result).toEqual("miguel-savignano");
});
