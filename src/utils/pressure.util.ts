import { PressureUnit } from "../definitions/units.def";

// Convert pressure value with input pressure unit
export function getPressure(pressureUnit: PressureUnit, pressureKpa: number): number {
  let pressureOut: number = pressureKpa;

  if (pressureUnit == PressureUnit.Psi) {
    pressureOut = pressureKpa * 0.14503773;
  }
  else if (pressureUnit === PressureUnit.KgCm2) {
    pressureOut = pressureKpa * 0.0101972;
  }
  return pressureOut;
}

// Get pressure in kPa
export function getPressureKpa(pressureUnit: PressureUnit, pressure: number): number {
  let pressureOut: number = pressure;

  if (pressureUnit == PressureUnit.Psi) {
    pressureOut = pressure / 0.14503773;
  }
  else if (pressureUnit == PressureUnit.KgCm2) {
    pressureOut = pressure / 0.0101972;
  }
  return pressureOut;
}