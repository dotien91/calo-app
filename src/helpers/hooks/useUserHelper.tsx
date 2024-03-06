// Import package from node modules
import { useMemo } from "react";
import useStore from "@services/zustand/store";
import { EnumRole } from "constants/system.constant";

const useUserHelper = () => {
  const userData = useStore((state) => state.userData);

  const isTeacher = useMemo(() => {
    return userData?.user_role == EnumRole.Teacher;
  }, [userData]);

  return {
    isTeacher,
  };
};

export default useUserHelper;
