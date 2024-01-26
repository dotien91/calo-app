import { useEffect } from "react";

import useStore from "@services/zustand/store";
import { getCourseFilterKeys } from "@services/api/course.api";

export function useCourse() {
  const setCourseFilterKeys = useStore((store) => store.setCourseFilterKeys);

  useEffect(() => {
    getCourseFilterKeys().then((res) => {
      if (!res.isError) {
        setCourseFilterKeys(res.data);
      }
    });
  }, []);
  return {};
}
