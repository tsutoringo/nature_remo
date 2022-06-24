import * as NatureRemo from './mod';

export const object2FormData = (obj: Record<string, unknown>) => {
  const formData = new FormData();
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const val = obj[key];

      if (Array.isArray(val)) formData.append(key, val.join(','));
      else if (typeof val === 'object') formData.append(key, JSON.stringify(val));
      else if (typeof val === 'string') formData.append(key, val);
      else if (typeof val === 'number') formData.append(key, val.toString());
    }
  }

  return formData;
}

export const getButtonName = (button: NatureRemo.SendableButton) => {
  if (typeof button === 'string') return button;
  return button.name;
}


export type LiteralUnion<T> = T | (string & Record<never, never>)
