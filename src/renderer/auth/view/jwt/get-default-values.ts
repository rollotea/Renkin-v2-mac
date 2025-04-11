import { SignInSchemaType } from "./jwt-sign-in-view";

export const getDefaultValues = (): SignInSchemaType => {
  const result = localStorage.getItem(
    "SperiolResolution.RenkinTool.SignInDefaultValues"
  );
  if (result) {
    const parsedResult: SignInSchemaType = JSON.parse(result);
    return parsedResult;
  } else {
    return {
      email: "",
      password: "",
    };
  }
};
