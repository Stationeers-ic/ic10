import { Device, Register } from "./ZodTypes"

/**
 * Register | Device
 */
export const RegisterOrDevice = Register.or(Device)
