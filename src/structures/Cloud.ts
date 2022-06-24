export type Method = 'GET' | 'POST';
import * as NatureRemo from '../mod.ts';
import { object2FormData, getButtonName } from '../util.ts';
import { camelcaseKeys, snakecaseKeys } from '../deps.ts';

export class Cloud {
  static VERSION = 1;
  static BASE_URL = 'https://api.nature.global/';

  constructor (
    public token: string
  ) {

  }

  getUser (): Promise<NatureRemo.User> {
    return this.request<NatureRemo.User>('GET', '/users/me');
  }

  updateUser (name: string): Promise<NatureRemo.User> {
    return this.request<NatureRemo.User>('POST', '/users/me', { name });
  }

  getDevices (): Promise<NatureRemo.Device[]> {
    return this.request<NatureRemo.Device[]>('GET', '/devices');
  }

  getAppliances (): Promise<NatureRemo.Appliance[]> {
    return this.request<NatureRemo.Appliance[]>('GET', '/appliances');
  }

  createAppliance (newAppliance: {
    nick: string;
    model?: string;
    modelType?: 'AC' | 'TV' | 'LIGHT';
    device: string;
    image: NatureRemo.ApplianceImage;
  }) {
    return this.request<NatureRemo.Appliance>('POST', '/appliances', snakecaseKeys(newAppliance));
  }

  deleteAppliance (applianceId: string) {
    return this.request('POST', `/appliances/${applianceId}/delete`)
  }


  updateAppliance (applianceId: string) {
    return this.request<NatureRemo.Appliance>('POST', `/appliances/${applianceId}`);
  }

  reorderAppliances (order: string[]) {
    return this.request<NatureRemo.Appliance[]>('POST', '/appliance_orders', {
      appliances: order
    });
  }

  updateAirConditionerSetting (applianceId: string, setting: {
    temperature?: string;
    operationMode?: string;
    airVolume?: string;
    airDirection?: string;
    button?: string;
  }) {
    return this.request<{
      temp: string,
      tempUnit: string,
      mode: string,
      vol: string,
      dir: string,
      dirh: string,
      button: string,
      updatedAt: string
    }>('POST', `/appliances/${applianceId}/aircon_settings`, snakecaseKeys(setting));
  }

  sendTVIR (applianceId: string, button: NatureRemo.SendableButton) {
    return this.request('POST', `/appliances/${applianceId}/tv`, {
      button: getButtonName(button)
    });
  }

  sendLIGHTIR (applianceId: string, button: NatureRemo.SendableButton) {
    return this.request('POST', `/appliances/${applianceId}/light`, {
      button: getButtonName(button)
    });
  }
 
  async request <T = void>(method: Method, path: string, body?: FormData | Record<string, unknown>): Promise<T> {
    if (body && !(body instanceof FormData)) {
      body = object2FormData(body);
    }

    const headers = new Headers();

    headers.append('Authorization', `Bearer ${this.token}`);

    return await fetch(`${Cloud.BASE_URL}${Cloud.VERSION}${path}`, {
      method,
      headers,
      body
    })
    .then(res => {
      // Error Handler
      if (res.status !== 200) {
        return res.json().then(json => {
          throw new Error(`${json.code} - ${json.message}`);
        });
      }
      return res;
    })
    .then(res => res.json())
    .then(json => camelcaseKeys(json, {
      deep: true
    })) as Promise<T>;
  }
}