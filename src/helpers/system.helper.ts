import { EnumRole } from "constants/system.constant";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const checkPermissionMentor = (
  permission: string,
  channel_role: string | undefined,
  permissionList: string[] | undefined,
) => {
  const isAdmin = channel_role === EnumRole.Mentor;
  const create =
    isAdmin || (permissionList || []).includes(`${permission}/create`);
  const update =
    isAdmin || (permissionList || []).includes(`${permission}/update`);
  const _delete =
    isAdmin || (permissionList || []).includes(`${permission}/delete`);
  return {
    create,
    update,
    delete: _delete,
    createUpdate: create && update,
    createDelete: create && _delete,
    updateDelete: update && _delete,
    all: create && update && _delete,
    hasOneCreateUpdate: create || update,
    hasOneCreateDelete: create || _delete,
    hasOneUpdateDelete: update || _delete,
    hasOneAll: create || update || _delete,
  };
};
