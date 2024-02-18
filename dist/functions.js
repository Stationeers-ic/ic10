import { arithmetic } from "./functions/arithmetic";
import { misc } from "./functions/misc";
import { jump } from "./functions/jump";
import { select } from "./functions/select";
import { device } from "./functions/device";
import { stack } from "./functions/stack";
export const functions = {
    ...arithmetic,
    ...misc,
    ...jump,
    ...select,
    ...device,
    ...stack,
};
export default functions;
