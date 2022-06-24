import { LiteralUnion } from './util.ts';

export interface User {
  id: string;
  name: string;
}

export interface DeviceCore {
  id: string;
  name: string;
  temperatureOffset: number;
  humidityOffse: number;
  createdAt: string;
  firmwareVersion: string;
  macAddress: string;
  serialNumber: string;
}

export interface Device extends DeviceCore {
  newestEvents: {
    te?: SensorValue;
    hu?: SensorValue;
    il?: SensorValue;
    mo?: SensorValue;
  };
}

export interface SensorValue {
  val: number;
  createdAt: string;
}

// Appliances

export interface ApplianceCore {
  id: string;
  device: DeviceCore;
  model: ApplianceModel;
  nickname: string;
  image: string;
  signals: Signal[];
}

export interface TVAppliance extends ApplianceCore {
  type: 'TV';
  tv: TV;
}

export interface LIGHTAppliance extends ApplianceCore {
  type: 'LIGHT';
  light: LIGHT;
}

export type Appliance = TVAppliance | LIGHTAppliance;
export type ApplianceType = Appliance['type'];

export interface ApplianceModel {
  id: string;
  countory: string;
  manufacturer: string;
  remoteName: string;
  name: string;
  image: string;
}

export interface TV {
  state: TVState;
  buttons: Button[];
}

export interface TVState {
  input: 't' | 'bs' | 'cs';
}

export interface LIGHT {
  state: LIGHTState;
  buttons: Button[];
}

export interface LIGHTState {
  power: 'on' | 'off';
  brightness: string;
  lastButton: string;
}

export interface Button {
  name: string;
  image: string;
  label: string;
}

export type SendableButton = Button | string;

export interface Signal {
  id: string;
  name: string;
  image: string;
}

export type ApplianceImage = LiteralUnion<'ico_ac_1' | 'ico_light' | 'ico_tv'>;
