import * as yup from "yup";

const resetPasswordSchema = yup.object().shape({
  token: yup
    .string()
    .required("Token é um campo obrigatório.")
    .min(8, "Token deve ter no mínimo 8 caracteres.")
    .max(8, "Token deve ter no máximo 8 caracteres."),
  newPassword: yup
    .string()
    .required("Senha é um campo obrigatório.")
    .min(8, "A senha deve possuir no mínimo 8 caracteres.")
    .max(25, "A senha deve possuir no máximo 25 caracteres.")
    .test(
      "newPassword",
      "A senha deve possuir no mínimo 8 caracteres, uma letra minúscula e uma letra maiúscula.",
      (value) => {
        if (value) {
          return (
            value.length >= 8 &&
            /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#-_?&]{8,}$/.test(value)
          );
        }
        return true;
      }
    ),
});

export default resetPasswordSchema;
