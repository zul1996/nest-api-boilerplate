export class SecUserAndRoleDto {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;

  isActive: boolean;
  mustChangePasswordFlag: boolean;
  
  lastLoginSuccessTs?: Date;
  lastChangePasswordTs?: Date;
}

