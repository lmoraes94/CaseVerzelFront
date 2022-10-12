import * as yup from "yup";

const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .email("O campo deve ser um e-mail válido.")
    .required("E-mail é um campo obrigatório."),
});

export default forgotSchema;
