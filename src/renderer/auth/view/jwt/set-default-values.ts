import { SignInSchemaType } from "./jwt-sign-in-view";

export const setDefaultValues = (data: SignInSchemaType) => {
  localStorage.setItem(
    "SperiolResolution.RenkinTool.SignInDefaultValues",
    JSON.stringify(data)
  );
};
