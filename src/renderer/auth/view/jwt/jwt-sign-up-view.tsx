import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  sendEmailVerification,
} from "firebase/auth";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
// import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "../../../routes/paths";
import { useRouter } from "../../../routes/hooks";
import { RouterLink } from "../../../routes/components";

import { Iconify } from "../../../components/iconify";
import { Form, Field } from "../../../components/hook-form";

import { signUp } from "../../context/jwt";
import { useAuthContext } from "../../hooks";
import { getErrorMessage } from "../../utils";
import { FormHead } from "../../components/form-head";
import { SignUpTerms } from "../../components/sign-up-terms";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { UserCredential } from "firebase/auth";
// import { db } from "../../..";
import { FIRESTORE } from "../../../lib/firebase";
import { createNewData } from "./create-new-data";
// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: "First name is required!" }),
  lastName: zod.string().min(1, { message: "Last name is required!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createRedirectPath = (query: string) => {
    const queryString = new URLSearchParams({ email: query }).toString();
    return `${paths.auth.amplify.verify}?${queryString}`;
  };

  const defaultValues: SignUpSchemaType = {
    firstName: "Hello",
    lastName: "Friend",
    email: "hello@gmail.com",
    password: "@2Minimal",
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const auth = getAuth();
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // ===========================================
      if (!auth.currentUser) {
        throw new Error("no user");
      }
      await sendEmailVerification(auth.currentUser);

      // ===========================================
      const newData = createNewData(
        userCredential,
        data.firstName,
        data.lastName,
        data.email
      );
      await setDoc(doc(FIRESTORE, "users", userCredential.user.uid), newData);
      const userRef = doc(FIRESTORE, "users", userCredential.user.uid);
      await addDoc(collection(userRef, "export"), {
        quantity: 0,
        createdAt: Timestamp.now(),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="lastName"
          label="Last name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text
        name="email"
        label="Email address"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={showPassword.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify
                    icon={
                      showPassword.value
                        ? "solar:eye-bold"
                        : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton> */}
      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
        // onClick={async () => {
        //   const result = await createUserWithEmailAndPassword(
        //     auth,
        //     "rollotea846933@gmail.com",
        //     "dxftk286"
        //   );
        //   console.log(result);
        // }}
      >
        Create account
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get started"
        description={
          <>
            {`Already have an account? `}
            <Link
              component={RouterLink}
              href={paths.auth.jwt.signIn}
              variant="subtitle2"
            >
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: "center", md: "left" } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
function onSolvedRecaptcha() {
  throw new Error("Function not implemented.");
}
