import * as yup from "yup";

const createUserSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nome é um campo obrigatório.")
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  username: yup
    .string()
    .required("Nome de usuário é um campo obrigatório.")
    .min(8, "O nome de usuário deve possuir no mínimo 8 caracteres.")
    .max(30, "O nome de usuário deve possuir no máximo 30 caracteres."),
  email: yup
    .string()
    .email("O campo deve ser um e-mail válido.")
    .required("E-mail é um campo obrigatório."),
  phone: yup
    .string()
    .nullable()
    .min(14, "O celular deve possuir no mínimo 14 caracteres.")
    .max(15, "O celular deve possuir no máximo 15 caracteres."),
  role: yup
    .mixed()
    .oneOf(
      ["Admin", "User"],
      "A função deve ser um dos seguintes valores: Admin, User."
    )
    .default("User"),
  password: yup
    .string()
    .required("Senha é um campo obrigatório.")
    .min(8, "A senha deve possuir no mínimo 8 caracteres.")
    .max(25, "A senha deve possuir no máximo 25 caracteres.")
    .test(
      "password",
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

export default createUserSchema;
