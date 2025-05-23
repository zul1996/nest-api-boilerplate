export class SecMenuTreeDto {
  code: string;
  dataOrder: number;
  menuLevel: number;
  icon?: string;
  name: string;
  description: string;
  enable: boolean;
  parentCode?: string;
  fePath?: string;
  featureCode?: string;
  actionTypes: string[];
  children?: SecMenuTreeDto[];
}
