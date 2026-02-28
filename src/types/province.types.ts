export interface Province {
  code: string;
  name: string;
  nameShort: string;
  type: 'city' | 'province';
  region: 'north' | 'central' | 'south';
}

export interface District {
  code: string;
  name: string;
  type: 'district' | 'city' | 'town';
  provinceCode: string;
}
