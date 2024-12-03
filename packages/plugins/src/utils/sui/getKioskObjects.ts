import { SuiObjectDataOptions } from '@mysten/sui/dist/cjs/client';
import { getClientSui } from '../clients';
import { multipleGetDynamicFieldsObjects } from './multipleGetDynamicFieldsObjects';
import { ObjectResponse } from './types';

export const kioskOwnerCapType = '0x2::kiosk::KioskOwnerCap';
export const ownerTokenType =
  '0x95a441d389b07437d00dd07e0b6f05f513d7659b13fd7c5d3923c7d9d847199b::ob_kiosk::OwnerToken';
export const personalKioskType =
  '0x0cb4bcc0560340eb1a1b929cabe56b33fc6449820ec8c1980d69bb98b649b802::personal_kiosk::PersonalKioskCap';

// Types associés aux objets spécifiques
type PersonalKioskCap = {
  cap: Cap;
  id: ID;
};

type OwnerToken = {
  kiosk: string;
  owner: string;
  id: ID;
};

type KioskOwnerCap = {
  for: string;
  id: ID;
};

// Fonction principale pour parser les objets
export async function getKiosksDynamicFieldsObjects(
  objects: ObjectResponse<unknown>[],
  options?: SuiObjectDataOptions
) {
  const client = getClientSui();
  return (
    await multipleGetDynamicFieldsObjects(
      client,
      getKiosksIds(objects),
      options
    )
  ).flat();
}

export function getKiosksIds(objects: ObjectResponse<unknown>[]) {
  const kiosks: string[] = [];
  objects.forEach((obj) => {
    if (!obj.data?.type) return;
    let kioskId;
    switch (obj.data.type) {
      case kioskOwnerCapType: {
        const parsedKioskObj = obj.data.content?.fields as KioskOwnerCap;
        kioskId = parsedKioskObj.for;
        break;
      }
      case ownerTokenType: {
        const parsedKioskObj = obj.data.content?.fields as OwnerToken;
        kioskId = parsedKioskObj.kiosk;
        break;
      }
      case personalKioskType: {
        const parsedKioskObj = obj.data.content?.fields as PersonalKioskCap;
        kioskId = parsedKioskObj.cap.fields.for;
        break;
      }
      default:
        break;
    }
    if (kioskId) kiosks.push(kioskId);
  });
  return kiosks;
}

// Déclarations des types
export type Cap = {
  fields: Fields;
  type: string;
};

export type Fields = {
  for: string;
  id: ID;
};

export type ID = {
  id: string;
};
