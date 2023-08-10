import { MSSModel } from "@models/MSSModel";
import { safeAssign } from "@utils/safeAssign";

export function compose<
  AA extends object,
  AB extends object,
  AC extends object,
  BA extends object,
  BB extends object,
  BC extends object
>(
  model1: MSSModel<AA, AB, AC>,
  model2: MSSModel<BA, BB, BC>
): MSSModel<AA & BA, AB & BB, AC & BC>;

export function compose<
  AA extends object,
  AB extends object,
  AC extends object,
  BA extends object,
  BB extends object,
  BC extends object,
  CA extends object,
  CB extends object,
  CC extends object
>(
  model1: MSSModel<AA, AB, AC>,
  model2: MSSModel<BA, BB, BC>,
  model3: MSSModel<CA, CB, CC>
): MSSModel<AA & BA & CA, AB & BB & CB, AC & BC & CC>;

export function compose<
  AA extends object,
  AB extends object,
  AC extends object,
  BA extends object,
  BB extends object,
  BC extends object,
  CA extends object,
  CB extends object,
  CC extends object,
  DA extends object,
  DB extends object,
  DC extends object
>(
  model1: MSSModel<AA, AB, AC>,
  model2: MSSModel<BA, BB, BC>,
  model3: MSSModel<CA, CB, CC>,
  model4: MSSModel<DA, DB, DC>
): MSSModel<AA & BA & CA & DA, AB & BB & CB & DB, AC & BC & CC & DC>;

export function compose<
  AA extends object,
  AB extends object,
  AC extends object,
  BA extends object,
  BB extends object,
  BC extends object,
  CA extends object,
  CB extends object,
  CC extends object,
  DA extends object,
  DB extends object,
  DC extends object,
  EA extends object,
  EB extends object,
  EC extends object
>(
  model1: MSSModel<AA, AB, AC>,
  model2: MSSModel<BA, BB, BC>,
  model3: MSSModel<CA, CB, CC>,
  model4: MSSModel<DA, DB, DC>,
  model5: MSSModel<EA, EB, EC>
): MSSModel<
  AA & BA & CA & DA & EA,
  AB & BB & CB & DB & EB,
  AC & BC & CC & DC & EC
>;

export function compose<
  AA extends object,
  AB extends object,
  AC extends object,
  BA extends object,
  BB extends object,
  BC extends object,
  CA extends object,
  CB extends object,
  CC extends object,
  DA extends object,
  DB extends object,
  DC extends object,
  EA extends object,
  EB extends object,
  EC extends object,
  FA extends object,
  FB extends object,
  FC extends object
>(
  model1: MSSModel<AA, AB, AC>,
  model2: MSSModel<BA, BB, BC>,
  model3: MSSModel<CA, CB, CC>,
  model4: MSSModel<DA, DB, DC>,
  model5: MSSModel<EA, EB, EC>,
  model6: MSSModel<FA, FB, FC>
): MSSModel<
  AA & BA & CA & DA & EA & FA,
  AB & BB & CB & DB & EB & FB,
  AC & BC & CC & DC & EC & FC
>;

export function compose(...models: MSSModel<any, any, any>[]) {
  const modelData = { observables: {}, actions: {}, views: {} } as any;
  for (let model of models) {
    const { observables, actions, views } = model.getProperties();
    Object.assign(modelData.observables, observables);
    Object.assign(modelData.actions, actions);
    safeAssign(modelData.views, views);
  }
  return new MSSModel(
    modelData.observables,
    modelData.views,
    modelData.actions
  );
}
