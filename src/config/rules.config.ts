import { IsEmailAlreadyExistConstraint } from "src/rules/IsEmailAlreadyExist.validate";
import { IsEmailDoesNotExistConstraint } from "src/rules/IsEmailDoesNotExist.validate";

export default [
    IsEmailAlreadyExistConstraint,
    IsEmailDoesNotExistConstraint,
];