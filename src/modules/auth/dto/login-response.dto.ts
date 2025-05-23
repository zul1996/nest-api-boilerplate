import { SecMenuTreeDto } from "./sec-menu-tree.dto";
import { SecUserAndRoleDto } from "./sec-user-role.dto";

export class LoginRespDto {
  sessionId: string;
  status: 'SUCCESS' | 'FAILED';
  warningMessage?: string | null;
  user?: SecUserAndRoleDto | null;
  orgUser?: SecUserAndRoleDto | null;
  impersonateFlag: boolean;
  availableImpersonates?: SecUserAndRoleDto[] | null;
  jwtToken?: string;
  menu?: SecMenuTreeDto[] | null;
}